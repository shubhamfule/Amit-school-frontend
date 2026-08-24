// Teacher portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/teacher/* — the ONE portal actually wired to real
// API calls (utils/api.js -> fetch(`${BASE_URL}${endpoint}`), used by every
// page via the shared RecordManager component). This is the ground-truth
// contract for /students, /attendance(+/bulk), /leave, /library, /marks,
// /schedule(+/bulk), /assignments — every other portal's data is local mock
// state and never actually reaches an API.
//
// Reuses Student / LeaveApplication from Admin.js and Book from
// main-accountant.js (each required real fixes there — see comments in
// those files: Student needed `roll`/`mobile`/an `Inactive` status value,
// LeaveApplication needed `studentName`/`startDate`/`endDate` with
// `leaveType` no longer required, Book needed author/isbn/category/quantity/
// description and an optional bookId). Four models are genuinely new:
// StudentAttendance, Mark, ScheduleEntry, Assignment — none of the other
// four portal files have anything resembling them.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Student, LeaveApplication } = require("./Admin");
const { Book } = require("./Main-accountant");

// ---- Student Attendance ------------------------------------------------
// Matches Attendance.jsx's real POST /attendance/bulk payload exactly:
// { date, records: [{ studentId, studentName, class, status }] }, and its
// GET /attendance?date= read path (records keyed by studentId/status).
// Deliberately its own model — distinct from Admin.js's Staff-only
// attendance map and main-accountant's StaffAttendanceMark, since this is
// student attendance with a real Student ObjectId link.

const studentAttendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    studentName: { type: String, required: true },
    class: { type: String },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], required: true }, // lowercase — matches the real payload exactly
  },
  { timestamps: true }
);
studentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// ---- Mark ---------------------------------------------------------------
// Matches Marks.jsx's real POST /marks payload: { test, roll, name, subject,
// marks }. `grade` is computed client-side (gradeFor) and never sent/stored
// — kept out of the schema rather than duplicated.

const markSchema = new Schema(
  {
    test: { type: String, required: true }, // test/exam name, free text
    roll: { type: String, required: true },
    name: { type: String, required: true }, // auto-filled client-side from roll, still sent as a plain string
    subject: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

// ---- Schedule Entry ------------------------------------------------------
// Matches Schedule.jsx's real POST /schedule and bulk-import POST
// /schedule/bulk ({ entries: [...] }) payloads: { time, subject, class,
// room, status }. `time` is a single free-text range ("09:00 - 09:45"), not
// separate start/end fields.

const scheduleEntrySchema = new Schema(
  {
    time: { type: String, required: true }, // e.g. "09:00 - 09:45"
    subject: { type: String, required: true },
    class: { type: String, required: true },
    room: { type: String, required: true },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Upcoming" },
  },
  { timestamps: true }
);

// ---- Assignment ----------------------------------------------------------
// Matches Assignments.jsx's real POST /assignments payload: { title,
// subject, class, dueDate, description, status }.

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    dueDate: { type: Date, required: true },
    description: { type: String },
    status: { type: String, enum: ["Active", "Completed", "Archived"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js
  Student,
  LeaveApplication,
  // reused from main-accountant.js
  Book,
  // owned here
  StudentAttendance: mongoose.model("StudentAttendance", studentAttendanceSchema),
  Mark: mongoose.model("Mark", markSchema),
  ScheduleEntry: mongoose.model("ScheduleEntry", scheduleEntrySchema),
  Assignment: mongoose.model("Assignment", assignmentSchema),
};
