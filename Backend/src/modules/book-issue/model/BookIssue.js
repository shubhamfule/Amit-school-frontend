const mongoose = require("mongoose");

const bookIssueSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "LibraryMember", required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    returnCondition: { type: String, enum: ["Good", "Damaged", "Late"] },
    // Stored + recalculated denormalization (documented in Phase 1 mapping), not the
    // sole source of truth — overdue-ness is always re-derivable from dueDate/returnDate.
    status: { type: String, enum: ["Issued", "Returned", "Overdue"], default: "Issued" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookIssue", bookIssueSchema);
