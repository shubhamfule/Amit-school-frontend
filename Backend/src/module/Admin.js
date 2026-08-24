// Admin portal — consolidated Mongoose schemas.
//
// This file is the single owner of every model the Admin portal manages
// (src/modules/admin in the frontend): Student roster + fee status, Staff
// roster + attendance + salary, Leave Applications, Notices, Events, the
// separate Calendar view, and per-admin Settings.
//
// Other portal files (main-accountant.js, teacher-accountant.js, ...) that
// need one of these models (e.g. Staff for payroll) should `require` it
// from here rather than redefining the schema — Mongoose throws
// OverwriteModelError if mongoose.model(name, schema) is called twice for
// the same name.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// ---- User (auth) --------------------------------------------------------
// One login per portal role, matching the frontend's separate Login.jsx
// pages (admin, library, main-accountant, non-teaching-accountant,
// student-accountant, teaching-accountant, teacher, student). Every real
// login form across the whole app only ever collects email + password —
// `identifier` accepts either email or username at login time.

const ROLES = [
  "admin", "library", "main-accountant", "non-teaching-accountant",
  "student-accountant", "teaching-accountant", "teacher", "student",
];

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ROLES },
    label: { type: String, trim: true },
    refId: { type: Schema.Types.ObjectId }, // e.g. the linked Staff/Student document, when applicable
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};
userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

// ---- Student --------------------------------------------------------
// Base shape matches admin/pages/Students.jsx (roster + fee status view).
// father/mother/dob/gender/admissionNo/contact/address/academicYear/feeStatus
// added for student-accountant's directoryData.jsx, which carries a full
// admission profile — parentName/phone/status kept alongside rather than
// removed, since Admin's own Students.jsx still uses those directly.

const studentSchema = new Schema(
  {
    rollNumber: { type: String, unique: true, sparse: true, trim: true },
    roll: { type: String, trim: true }, // teacher portal's real create form (StudentPortal.jsx) sends this, not rollNumber
    admissionNo: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true }, // CLASS_DEFS key: 'N','LKG','UKG','1'..'10'
    section: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    parentName: { type: String, trim: true },
    father: { type: String, trim: true },
    mother: { type: String, trim: true },
    phone: { type: String, trim: true },
    contact: { type: String, trim: true }, // duplicate of phone in some portals' UI — kept as-is
    mobile: { type: String, trim: true }, // teacher portal's own naming, again different from phone/contact
    address: { type: String, trim: true },
    admissionDate: { type: Date },
    academicYear: { type: String },
    // From student portal's ProfileInfo.jsx — none of these existed before.
    bloodGroup: { type: String },
    classTeacherName: { type: String, trim: true },
    classTeacherContact: { type: String, trim: true },
    subjects: { type: [String], default: [] },
    feeTotal: { type: Number, default: 0, min: 0 },
    feePaid: { type: Number, default: 0, min: 0 },
    feeStatus: { type: String, enum: ["Paid", "Due"] },
    // KNOWN GAP: `status` means three different things across portals —
    // Admin's own Students.jsx: fee status (Paid/Pending); student-accountant's
    // directoryData.jsx: admission status (Active/Pending), fee tracked
    // separately via feeStatus above; teacher portal's StudentPortal.jsx:
    // enrollment status (Active/Inactive). All three value sets accepted.
    // AUDITED: the /students route (routes/Admin.routes.js) is a plain
    // crudRouter(Student, {...}) with no `filterableFields` and no
    // status-specific logic anywhere in crudFactory.js — the backend never
    // interprets `status`, only stores and echoes back whatever value a
    // portal wrote. So there is no server-side read path that could apply
    // one portal's meaning to another portal's value; each portal only ever
    // sees status values it (or Admin) wrote for its own case. No fix needed.
    status: { type: String, enum: ["Active", "Inactive", "Pending", "Paid"], default: "Active" },
  },
  { timestamps: true }
);

// Never stored — always derived, matches Students.jsx's computed `pending`.
studentSchema.virtual("feePending").get(function feePending() {
  return Math.max(0, this.feeTotal - this.feePaid);
});
studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

// ---- Staff -----------------------------------------------------------
// Matches admin/data/staffData.js + components/teachers/StaffSection.jsx.
// `attendance` is stored as the same nested year->month->day map the UI
// already builds client-side, rather than one document per day.

const staffSchema = new Schema(
  {
    staffId: { type: String, required: true, unique: true, trim: true }, // e.g. T001, S001
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["teaching", "other"], required: true },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    role: { type: String, required: true }, // e.g. "Mathematics Teacher", "Cleaner"
    classes: { type: String, default: "—" }, // e.g. "6th, 7th" — teaching staff only
    joiningDate: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 1 },
    academicYear: { type: String }, // derived April->March session, auto-set below
    attendance: { type: Schema.Types.Mixed, default: {} }, // { [year]: { [month]: { [day]: 'Present'|'Absent' } } }
  },
  { timestamps: true }
);

staffSchema.pre("save", function setAcademicYear(next) {
  if (this.isModified("joiningDate") || !this.academicYear) {
    const d = new Date(this.joiningDate);
    const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
    this.academicYear = `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
  }
  next();
});

// ---- Leave Application -------------------------------------------------
// Matches admin/pages/teachers/LeaveApplications.jsx directly, but reused by
// every accountant portal (main/teaching/non-teaching) — all three actually
// send employeeId/employeeName/from/to, NOT staffId/staffName/staffType/
// fromDate/toDate. Only Admin's own UI uses the fromDate/toDate/staffType
// names. The teacher portal's real POST /leave (LeaveApplications.jsx) is a
// third variant again: studentName/startDate/endDate, and never sends
// leaveType at all — so leaveType can't be required either. Every naming
// variant is kept; only reason is required.

const leaveApplicationSchema = new Schema(
  {
    staffId: { type: String }, // Staff.staffId — Admin's own naming
    staffName: { type: String },
    employeeId: { type: String }, // accountant portals' naming for the same thing
    employeeName: { type: String },
    studentName: { type: String }, // teacher portal applies leave for a student by name only
    staffType: { type: String, enum: ["teaching", "other"] },
    role: { type: String }, // library portal's own naming — free text (Teacher/Librarian/Admin Staff), not the teaching/other enum above
    // Student portal's Leave.jsx wizard uses a completely different value
    // set (Medical/Personal/Family Function/Emergency/Other) than every
    // staff-leave form (Sick/Casual/Earned/Maternity-Paternity/Unpaid) —
    // both kept since they're genuinely different leave-type vocabularies.
    leaveType: {
      type: String,
      enum: [
        "Sick Leave", "Casual Leave", "Earned Leave", "Maternity/Paternity Leave", "Unpaid Leave",
        "Medical Leave", "Personal Leave", "Family Function", "Emergency", "Other",
      ],
    },
    fromDate: { type: Date },
    toDate: { type: Date },
    from: { type: Date }, // accountant portals' naming for fromDate
    to: { type: Date }, // accountant portals' naming for toDate
    startDate: { type: Date }, // teacher portal's naming for fromDate
    endDate: { type: Date }, // teacher portal's naming for toDate
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    appliedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ---- Notice ------------------------------------------------------------
// Matches admin/pages/Notices.jsx.

const noticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    audience: { type: String, enum: ["All Students", "Parents", "Staff"], default: "All Students" },
    body: { type: String, trim: true },
    // Neither used by Admin's own Notices.jsx — student/student/Notice.jsx
    // uses `category` (academic/event/holiday/urgent) instead of priority,
    // and `by` for the poster's display name. `unread` stays computed
    // per-viewer (matches Admin's own module comment pattern), never stored.
    category: { type: String, enum: ["academic", "event", "holiday", "urgent"] },
    by: { type: String, trim: true },
  },
  { timestamps: true }
);

// ---- Event ---------------------------------------------------------
// Matches admin/pages/Events.jsx.

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    venue: { type: String, trim: true },
    icon: { type: String, default: "🎓" }, // emoji shown on the event card
    status: { type: String, enum: ["upcoming", "scheduled", "planning"], default: "upcoming" },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// ---- Calendar Event ------------------------------------------------
// Matches admin/pages/CalendarPage.jsx — a deliberately separate, thinner
// shape from Event above; the two are NOT reconciled in the frontend.

const calendarEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true }, // "HH:mm" — UI shows "All day" when empty
    color: { type: String, default: "var(--blue)" },
  },
  { timestamps: true }
);

// ---- Settings --------------------------------------------------------
// Matches admin/pages/Settings.jsx exactly (profile / rules / notifications /
// appearance / security / data tabs). One document per admin user.

const settingsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    profile: {
      name: String,
      designation: String,
      email: String,
      phone: String,
      department: { type: String, enum: ["Administration", "Academics", "Finance"] },
      employeeId: String,
    },
    notifPrefs: {
      admissions: { type: Boolean, default: true },
      feeReminders: { type: Boolean, default: true },
      calendarEvents: { type: Boolean, default: true },
      staffAlerts: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    toggles: {
      autoSuspend: { type: Boolean, default: true },
      allowHold: { type: Boolean, default: true },
      twoFa: { type: Boolean, default: false },
      autoBackup: { type: Boolean, default: true },
    },
    themeChoice: { type: String, enum: ["light", "dark", "system"], default: "light" },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  ROLES,
  Student: mongoose.model("Student", studentSchema),
  Staff: mongoose.model("Staff", staffSchema),
  LeaveApplication: mongoose.model("LeaveApplication", leaveApplicationSchema),
  Notice: mongoose.model("Notice", noticeSchema),
  Event: mongoose.model("Event", eventSchema),
  CalendarEvent: mongoose.model("CalendarEvent", calendarEventSchema),
  Settings: mongoose.model("Settings", settingsSchema),
};
