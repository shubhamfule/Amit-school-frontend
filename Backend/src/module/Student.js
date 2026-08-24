// Student portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/student/student/* — Attendance, Certificate,
// Fees, Leave, ParentInfo, ProfileInfo, Exam, Result, Notice, Event, Library.
// Unlike the teacher portal, EVERY page here is 100% local component state —
// no fetch/apiGet/apiPost anywhere in this module. Still modeled the same
// way as every other portal for consistency and because it's the same real
// data shape a future API would need to accept.
//
// Reuses Student (extended: bloodGroup/classTeacherName/classTeacherContact/
// subjects) and LeaveApplication (already compatible as-is — this portal's
// Attendance.jsx leave modal and Leave.jsx wizard both send fromDate/toDate/
// reason, which Admin's own naming already covers) and Notice (extended:
// category/by) and Event (already compatible — this is a literal copy of
// Admin's own Events.jsx data) from Admin.js; StudentFeeRecord (extended:
// installments) and Transaction (extended: desc alias, relaxed requireds)
// and BookIssue (extended: lowercase status, optional bookId, author) from
// Main-accountant.js. Four models are genuinely new: Certificate, ParentInfo,
// Exam, Result — nothing else has anything resembling them.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Student, LeaveApplication, Notice, Event } = require("./Admin");
const { StudentFeeRecord, Transaction, BookIssue } = require("./Main-accountant");

// ---- Certificate --------------------------------------------------------
// Matches Certificate.jsx's upload form: { title, category, issuer, date,
// imageFile/imagePreview }. imageUrl/imageExt are what a real upload would
// resolve to server-side — the frontend currently only ever stores a local
// data: URL, never actually uploads anywhere.

const certificateSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["academic", "sports", "participation", "excellence"],
      required: true,
    },
    issuer: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    imageUrl: { type: String }, // resolved file URL once a real upload pipeline exists
    imageExt: { type: String },
  },
  { timestamps: true }
);

// ---- Parent Info ----------------------------------------------------------
// Matches ParentInfo.jsx exactly: editable Father/Mother detail blocks plus
// a Verification block. Kept as its own document (one per student) rather
// than folded into Student, since it's edited as a unit with its own
// draft/save flow, distinct from the rest of the student profile.

const guardianDetailSchema = new Schema(
  {
    name: { type: String, required: true },
    occupation: { type: String },
    qualification: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const parentInfoSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
    father: { type: guardianDetailSchema, required: true },
    mother: { type: guardianDetailSchema, required: true },
    verification: {
      documentsVerified: { type: Boolean, default: false },
      kycComplete: { type: Boolean, default: false },
      lastUpdatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// ---- Exam -----------------------------------------------------------------
// Matches Exam.jsx's hardcoded EXAMS list: { subject, date, time, room,
// syllabus, status }. Distinct from teacher.js's ScheduleEntry (a weekly
// timetable slot) — this is a one-off exam sitting with its own syllabus
// scope, not a recurring class.

const examSchema = new Schema(
  {
    subject: { type: String, required: true },
    class: { type: String }, // implicit "the logged-in student's class" in the frontend, kept explicit here
    date: { type: Date, required: true },
    time: { type: String, required: true },
    room: { type: String, required: true },
    syllabus: { type: String }, // free text, e.g. "Ch 1-10"
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);

// ---- Result ----------------------------------------------------------
// Matches Result.jsx's hardcoded RESULTS list: { subject, term, marks, max,
// grade, status }. grade/status are computed client-side from marks/max in
// the frontend (never independently authored), but are stored here anyway
// since the UI always sends and reads them as plain fields, not virtuals.

const resultSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    subject: { type: String, required: true },
    term: { type: String, enum: ["unit1", "unit2", "term1", "term2", "final"], required: true },
    marks: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 1 },
    grade: { type: String }, // e.g. "A+", "A", "B+" — free-form, not a fixed enum in the frontend
    status: { type: String, enum: ["pass", "average", "fail"], required: true },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js
  Student,
  LeaveApplication,
  Notice,
  Event,
  // reused from main-accountant.js
  StudentFeeRecord,
  Transaction,
  BookIssue,
  // owned here
  Certificate: mongoose.model("Certificate", certificateSchema),
  ParentInfo: mongoose.model("ParentInfo", parentInfoSchema),
  Exam: mongoose.model("Exam", examSchema),
  Result: mongoose.model("Result", resultSchema),
};
