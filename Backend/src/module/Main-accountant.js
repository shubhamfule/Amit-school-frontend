// Main Accountant portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/main-accountant/Accountant/* (accountsData.jsx,
// salaryData.jsx, staffAttendanceData.jsx, leaveApplicationData.jsx,
// libraryData.jsx, eventsData.jsx, directoryData.jsx, TeacherRegistration.jsx,
// NonTeachingRegistration.jsx, SchoolExpenses.jsx, AttendanceManagement.jsx).
//
// Reuses Staff / LeaveApplication / Notice / Event / Student from Admin.js
// instead of redefining them — same OverwriteModelError reasoning as there.
// Models below are new: this portal is the one place they're actually used.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Staff, LeaveApplication, Notice, Event, Student } = require("./Admin");

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
// KNOWN GAP: kept separate from Admin.js's Student.feeTotal/feePaid fields —
// the two were never reconciled in the frontend (Admin's Students.jsx uses
// its own feeTotal/feePaid directly on Student; this portal keeps a
// parallel per-row ledger keyed by roll number instead of a Student ref).

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

// ---- Library: Book / BookIssue / BookReturn / Fine / Clearance --------
// Matches libraryData.jsx (clearanceRecords, bookIssues, bookReturns,
// fineCollections) as used by BookIssue.jsx/BookReturn.jsx/FineCollection.jsx/
// LibraryClearance.jsx in THIS portal. TODO: once a dedicated library.js
// portal file exists, these five should move there and this file should
// require them back — same reuse pattern as Staff/Notice/Event above.

// bookId no longer required: the teacher portal's real POST /library create
// form (Library.jsx) never sends one — only title/author/isbn/category/
// quantity/description/status. author/isbn/category/quantity/description
// added for that same reason; none of them existed here before.
const bookSchema = new Schema(
  {
    bookId: { type: String, unique: true, sparse: true }, // e.g. "BK-3001"
    title: { type: String, required: true },
    author: { type: String },
    isbn: { type: String },
    publisher: { type: String }, // library portal's own BookCatalog.jsx add-form has this; teacher portal's doesn't
    category: { type: String },
    quantity: { type: Number, min: 0 },
    description: { type: String },
    status: { type: String, enum: ["Available", "Issued", "Overdue"], default: "Available" },
  },
  { timestamps: true }
);

const bookIssueSchema = new Schema(
  {
    // Not required: the dedicated library portal's IssueReturn.jsx reuses
    // the member's own ID (e.g. "MEM-101") as the record's id instead of
    // generating a separate ISS-xxx code — memberId captures that usage,
    // issueId stays for the other portals that do generate one.
    issueId: { type: String, unique: true, sparse: true }, // "ISS-001"
    memberId: { type: String }, // e.g. "MEM-101" — library portal's own record id
    name: { type: String, required: true },
    userType: { type: String, enum: ["Student", "Teacher"], required: true },
    bookId: { type: String, ref: "Book" },
    bookName: { type: String, required: true },
    author: { type: String }, // student portal's Library.jsx embeds this directly, denormalized
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    // lowercase values added: student portal's own Library.jsx uses
    // issued/returned/overdue, not the capitalized versions every other
    // portal uses.
    status: {
      type: String,
      enum: ["Issued", "Returned", "Overdue", "issued", "returned", "overdue"],
      default: "Issued",
    },
  },
  { timestamps: true }
);

const bookReturnSchema = new Schema(
  {
    returnId: { type: String, unique: true, sparse: true }, // "RTN-001" — see bookIssueSchema.memberId note
    memberId: { type: String }, // e.g. "MEM-101" — library portal's own record id
    name: { type: String, required: true },
    userType: { type: String, enum: ["Student", "Teacher"], required: true },
    bookId: { type: String, required: true },
    bookName: { type: String }, // not required: library portal's IssueReturn.jsx return rows never include it, only bookId
    issueDate: { type: Date }, // teaching-accountant's libraryData.jsx includes this; main-accountant's doesn't
    returnDate: { type: Date, required: true },
    // Not required: teaching-accountant's bookReturnRecords never set condition/fine
    // (its returns are just { status: "Returned" }) — main-accountant's always do.
    condition: { type: String, enum: ["Good", "Damaged", "Late"] },
    // library portal's own IssueReturn.jsx return rows use a different,
    // more granular damage vocabulary + a separate clearanceAmount/payment
    // pair instead of fine/condition — kept alongside rather than merged in.
    damageType: { type: String, enum: ["No Damage", "Torn Pages", "Missing Pages", "Water Damage", "Lost Book"] },
    clearanceAmount: { type: Number, min: 0 },
    payment: { type: String, enum: ["Paid", "Unpaid"] },
    fine: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const libraryFineSchema = new Schema(
  {
    fineId: { type: String, required: true, unique: true }, // "FIN-001"
    name: { type: String, required: true },
    userType: { type: String, enum: ["Student", "Teacher"], required: true },
    bookId: { type: String, required: true },
    // main-accountant sends type+amount; teaching-accountant sends only
    // fineAmount with no type/reason — both kept, neither required.
    type: { type: String, enum: ["Overdue", "Damage"] },
    amount: { type: Number, min: 0 },
    fineAmount: { type: Number, min: 0 },
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  },
  { timestamps: true }
);

// KNOWN GAP: three different frontend variants of "library clearance" exist
// across portals and none agree on shape — this one (main-accountant) tracks
// per-book overdue/damage fines; teaching-accountant's version tracks only
// a single pendingFine + booksIssued count with no per-book detail at all.
// bookId/bookName kept optional so the simpler variant still validates.
const libraryClearanceSchema = new Schema(
  {
    clearanceId: { type: String, required: true, unique: true }, // "CLR-001"
    name: { type: String, required: true },
    userType: { type: String, enum: ["Student", "Teacher"], required: true },
    bookId: { type: String },
    bookName: { type: String },
    overdueFine: { type: Number, default: 0, min: 0 },
    damageFine: { type: Number, default: 0, min: 0 },
    booksIssued: { type: Number, default: 0, min: 0 },
    pendingFine: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Cleared", "Pending"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js — do not redefine
  Staff,
  LeaveApplication,
  Notice,
  Event,
  Student,
  // owned here
  Transaction: mongoose.model("Transaction", transactionSchema),
  TeacherSalaryPayment: mongoose.model("TeacherSalaryPayment", teacherSalaryPaymentSchema),
  NonTeachingSalaryPayment: mongoose.model("NonTeachingSalaryPayment", nonTeachingSalaryPaymentSchema),
  StudentFeeRecord: mongoose.model("StudentFeeRecord", studentFeeRecordSchema),
  Expense: mongoose.model("Expense", expenseSchema),
  StaffAttendanceMark: mongoose.model("StaffAttendanceMark", staffAttendanceMarkSchema),
  Book: mongoose.model("Book", bookSchema),
  BookIssue: mongoose.model("BookIssue", bookIssueSchema),
  BookReturn: mongoose.model("BookReturn", bookReturnSchema),
  LibraryFine: mongoose.model("LibraryFine", libraryFineSchema),
  LibraryClearance: mongoose.model("LibraryClearance", libraryClearanceSchema),
};
