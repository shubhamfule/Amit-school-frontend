// Main Accountant portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/main-accountant/Accountant/* (accountsData.jsx,
// salaryData.jsx, staffAttendanceData.jsx, leaveApplicationData.jsx,
// libraryData.jsx, eventsData.jsx, directoryData.jsx, TeacherRegistration.jsx,
// NonTeachingRegistration.jsx, SchoolExpenses.jsx, AttendanceManagement.jsx).
//
// Reuses Staff / LeaveApplication / Notice / Event / Student from Admin.js,
// and Book / BookIssue / BookReturn / LibraryFine / LibraryClearance from
// library-shared.js, instead of redefining them — same OverwriteModelError
// reasoning as there. Models below are new: this portal is the one place
// they're actually used.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Staff, LeaveApplication, Notice, Event, Student } = require("./Admin");
const { Book, BookIssue, BookReturn, LibraryFine, LibraryClearance } = require("./library-shared");

// ---- Transaction --------------------------------------------------------
// Matches accountsData.jsx: recentTransactions — the unified fees+salary+
// expenses feed shown on the Accountant Dashboard.

const transactionSchema = new Schema(
  {
    date: { type: Date, required: true },
    name: { type: String, trim: true }, // payer/payee/vendor name
    desc: { type: String, trim: true }, // student portal's Fees.jsx names the same idea `desc` instead
    type: { type: String, enum: ["Fee Collection", "Salary Payment", "Expense"] },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["Online", "Bank Transfer", "Cash", "UPI"] },
    status: { type: String, enum: ["Completed", "Pending", "paid", "pending", "overdue"], default: "Pending" },
  },
  { timestamps: true }
);

// ---- Teacher Salary Payment ----------------------------------------
// Matches salaryData.jsx: teacherSalaryRows. NOTE: this is a flat "current
// salary / paid so far" row with no month field — unlike a real payroll
// history, re-saving a payment overwrites `paid` rather than adding a new
// period. Flagging rather than inventing a month dimension the frontend
// doesn't have.

const teacherSalaryPaymentSchema = new Schema(
  {
    staffId: { type: String, required: true, ref: "Staff" }, // Staff.staffId, e.g. "T001"
    name: { type: String, required: true },
    designation: { type: String, required: true }, // "Teacher" | "Senior Teacher"
    meta: { type: String }, // e.g. "Mathematics · 9th"
    salary: { type: Number, required: true, min: 0 },
    paid: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// ---- Non-Teaching Salary Payment ------------------------------------
// Matches salaryData.jsx: staffRoles / nonTeachingRows. Individual role
// (cleaner/clerk/driver/peon/security/librarian) is kept as its own field
// since the same numeric ID (e.g. C001) repeats across roles — role+id
// together are the real unique key, not id alone.

const nonTeachingSalaryPaymentSchema = new Schema(
  {
    roleKey: {
      type: String,
      required: true,
      enum: ["cleaner", "clerk", "driver", "peon", "security", "librarian"],
    },
    staffId: { type: String, required: true }, // role-scoped id, e.g. "C001" under "clerk"
    name: { type: String, required: true },
    designation: { type: String, required: true }, // human label: "Cleaner", "Security Guard", ...
    meta: { type: String }, // area/department/shift — column label varies per role in the UI
    salary: { type: Number, required: true, min: 0 },
    paid: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);
nonTeachingSalaryPaymentSchema.index({ roleKey: 1, staffId: 1 }, { unique: true });

// ---- Student Fee Record ----------------------------------------------
// Matches salaryData.jsx: studentFeeRows + StudentFeeCollection.jsx/FeeReceipt.jsx.
// KNOWN GAP / DESIGN NOTE: kept separate from Admin.js's Student.feeTotal/
// feePaid fields — the two are genuinely independent per the frontend, not
// a bug to fix:
//   - Admin's own Students.jsx reads/writes Student.feeTotal/feePaid/
//     feeStatus directly, keyed by the Student ObjectId (admin's roster view).
//   - This portal (and student-accountant/teaching-accountant/
//     non-teaching-accountant, which reuse StudentFeeRecord) key their fee
//     ledger by roll number instead, and additionally carry `installments`,
//     which Student has no room for.
// No frontend page ever reads both for the same student, and no page writes
// one expecting the other to update — so there is nothing to reconcile.
// Do NOT add a sync hook between them: that would be inventing behavior no
// portal asks for and would risk silently overwriting one accountant
// portal's ledger from another's write. If a future page needs a single
// source of truth, that's a product decision (which portal owns billing)
// the frontend hasn't made yet, not a bug in this backend.

const installmentSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true }, // display string, e.g. "Due 15 Jul 2024" — matches student Fees.jsx exactly
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const studentFeeRecordSchema = new Schema(
  {
    roll: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    total: { type: Number, required: true, min: 0 },
    paid: { type: Number, default: 0, min: 0 },
    // student portal's own Fees.jsx additionally tracks upcoming installments
    // inline rather than as a separate collection — kept here since it's the
    // same conceptual record (one student's fee ledger).
    installments: { type: [installmentSchema], default: [] },
  },
  { timestamps: true }
);

// ---- Expense -----------------------------------------------------------
// Matches salaryData.jsx: initialExpenses + SchoolExpenses.jsx's add form
// (date, expense, category, amount, mode — exactly these 5 fields, nothing
// more). `paymentProof` is intentionally never a status source — the UI
// derives Paid/Pending purely from whether a proof file exists.

const expenseSchema = new Schema(
  {
    date: { type: Date, required: true },
    expense: { type: String, required: true, trim: true }, // description
    category: { type: String, enum: ["Office", "Transport", "Utility", "Maintenance"], required: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, enum: ["Cash", "Bank"], required: true },
    paymentProof: { type: String, default: null }, // file reference; null => Pending in the UI
  },
  { timestamps: true }
);

// ---- Staff Attendance Mark --------------------------------------------
// Matches AttendanceManagement.jsx: one mark per (staffType, person, date).
// Deliberately separate from Admin.js's Staff.attendance nested map — this
// portal reads/writes day-by-day marks directly, keyed the same way the UI
// keys them (staff `key` when present, else `id`, since role-scoped ids like
// Clerk C001 / Driver C001 collide otherwise).

const staffAttendanceMarkSchema = new Schema(
  {
    staffType: { type: String, enum: ["teaching", "nonTeaching"], required: true },
    personKey: { type: String, required: true }, // teachingStaff.id or nonTeachingStaff.key
    date: { type: Date, required: true },
    // "Leave" added: teaching-accountant's attendanceStore.jsx STATUSES includes
    // it (main-accountant's own UI never sends it, but this shared model must
    // accept whatever any reusing portal actually produces).
    status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
  },
  { timestamps: true }
);
staffAttendanceMarkSchema.index({ staffType: 1, personKey: 1, date: 1 }, { unique: true });

module.exports = {
  // reused from Admin.js — do not redefine
  Staff,
  LeaveApplication,
  Notice,
  Event,
  Student,
  // reused from library-shared.js — do not redefine
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
  // owned here
  Transaction: mongoose.model("Transaction", transactionSchema),
  TeacherSalaryPayment: mongoose.model("TeacherSalaryPayment", teacherSalaryPaymentSchema),
  NonTeachingSalaryPayment: mongoose.model("NonTeachingSalaryPayment", nonTeachingSalaryPaymentSchema),
  StudentFeeRecord: mongoose.model("StudentFeeRecord", studentFeeRecordSchema),
  Expense: mongoose.model("Expense", expenseSchema),
  StaffAttendanceMark: mongoose.model("StaffAttendanceMark", staffAttendanceMarkSchema),
};
