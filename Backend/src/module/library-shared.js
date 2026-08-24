// Library models — single owner of Book / BookIssue / BookReturn /
// LibraryFine / LibraryClearance. These were originally defined inline in
// Main-accountant.js (the first portal to need them) with a TODO to move
// them out once a dedicated library.js portal file existed. Library.js now
// exists, so they live here instead and every portal that needs them
// (Main-accountant.js, Library.js, Student-account.js, Teacher.js,
// Teacher-accountant.js) requires them from this file — same
// single-definition-only reasoning as Admin.js's models: Mongoose throws
// OverwriteModelError if mongoose.model(name, schema) runs twice for the
// same name.

const mongoose = require("mongoose");
const { Schema } = mongoose;

// ---- Book / BookIssue / BookReturn / Fine / Clearance --------
// Matches libraryData.jsx (clearanceRecords, bookIssues, bookReturns,
// fineCollections) as used by BookIssue.jsx/BookReturn.jsx/FineCollection.jsx/
// LibraryClearance.jsx in the main-accountant portal, and BookCatalog.jsx/
// IssueReturn.jsx/Members.jsx/FinesFees.jsx in the dedicated library portal.

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
  Book: mongoose.model("Book", bookSchema),
  BookIssue: mongoose.model("BookIssue", bookIssueSchema),
  BookReturn: mongoose.model("BookReturn", bookReturnSchema),
  LibraryFine: mongoose.model("LibraryFine", libraryFineSchema),
  LibraryClearance: mongoose.model("LibraryClearance", libraryClearanceSchema),
};
