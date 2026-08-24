// Library portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/library/library/* — BookCatalog, IssueReturn,
// Members, FinesFees, LeaveApplications, Events, CalendarPage, staffData.js.
// This is the dedicated library-staff portal; its data is the richest real
// usage of the library models, which is why several fixes landed in
// library-shared.js instead of being redefined here (bookId no longer
// required on BookIssue/BookReturn, memberId added for the reused-ID
// pattern this portal's IssueReturn.jsx uses, damageType/clearanceAmount/
// payment added to BookReturn, publisher + Overdue status added to Book).
// LeaveApplication.role was also added to Admin.js for this portal's
// Teacher/Librarian/Admin Staff role labels.
//
// Reuses LeaveApplication / Event / CalendarEvent from Admin.js, and Book /
// BookIssue / BookReturn / LibraryFine / LibraryClearance from
// library-shared.js. One model is genuinely new: LibraryMember — no other
// portal file has anything resembling it (a borrowing-standing record, not
// a person record).

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LeaveApplication, Event, CalendarEvent } = require("./Admin");
const { Book, BookIssue, BookReturn, LibraryFine, LibraryClearance } = require("./library-shared");

// ---- Library Member -----------------------------------------------------
// Matches Members.jsx exactly: { id, name, subject, role, issued, returned,
// record }. `record` is a computed borrowing-standing badge (Active/Clear/
// Overdue), not membership status — kept as its own enum rather than
// reusing any existing "status" field elsewhere, since it means something
// different again.

const libraryMemberSchema = new Schema(
  {
    memberId: { type: String, required: true, unique: true }, // e.g. "MEM-101"
    name: { type: String, required: true, trim: true },
    subject: { type: String }, // "Class 8A" for students, subject name for teachers — same field, dual meaning in the UI
    role: { type: String, enum: ["Student", "Teacher"], required: true },
    issued: { type: Number, default: 0, min: 0 }, // currently-issued count
    returned: { type: Number, default: 0, min: 0 }, // lifetime returned count
    record: { type: String, enum: ["Active", "Clear", "Overdue"], default: "Clear" },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js
  LeaveApplication,
  Event,
  CalendarEvent,
  // reused from main-accountant.js
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
  // owned here
  LibraryMember: mongoose.model("LibraryMember", libraryMemberSchema),
};
