const mongoose = require("mongoose");
const ApiError = require("../../../utils/ApiError");
const BookIssue = require("../model/BookIssue");
const Book = require("../../book/model/Book");
const LibraryMember = require("../../library-member/model/LibraryMember");
const LibraryFine = require("../../library-fine/model/LibraryFine");
const { FINE_PER_OVERDUE_DAY, DAMAGE_FINE } = require("../../../constants/library");

async function issueBook({ bookId, memberId, issueDate, dueDate }) {
  const session = await mongoose.startSession();
  try {
    let issue;
    await session.withTransaction(async () => {
      const book = await Book.findById(bookId).session(session);
      if (!book) throw new ApiError(404, "Book not found");
      if (book.availableCopies < 1) throw new ApiError(409, "No copies of this book are available");

      const member = await LibraryMember.findById(memberId).session(session);
      if (!member) throw new ApiError(404, "Library member not found");
      if (member.membershipStatus !== "Active") throw new ApiError(403, "Membership is not active");

      book.availableCopies -= 1;
      await book.save({ session });

      const created = await BookIssue.create(
        [{ bookId, memberId, issueDate: issueDate || new Date(), dueDate, status: "Issued" }],
        { session }
      );
      issue = created[0];
    });
    return issue;
  } finally {
    session.endSession();
  }
}

async function returnBook(issueId, { returnDate, returnCondition, damageType, remarks }) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const issue = await BookIssue.findById(issueId).session(session);
      if (!issue) throw new ApiError(404, "Book issue not found");
      if (issue.returnDate) throw new ApiError(409, "This book has already been returned");

      const effectiveReturnDate = returnDate || new Date();
      issue.returnDate = effectiveReturnDate;
      issue.returnCondition = returnCondition;
      issue.status = "Returned";
      await issue.save({ session });

      const book = await Book.findById(issue.bookId).session(session);
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      await book.save({ session });

      const overdueDays = Math.max(
        0,
        Math.ceil((effectiveReturnDate - issue.dueDate) / 86400000)
      );
      const overdueFineAmount = overdueDays * FINE_PER_OVERDUE_DAY;
      const damageFineAmount = DAMAGE_FINE[damageType] || 0;

      let fine = null;
      if (overdueFineAmount > 0 || damageFineAmount > 0) {
        const created = await LibraryFine.create(
          [
            {
              issueId: issue._id,
              overdueDays,
              overdueFineAmount,
              damageType: damageType || "No Damage",
              damageFineAmount,
              remarks,
              status: "Pending",
            },
          ],
          { session }
        );
        fine = created[0];
      }

      result = { issue, fine };
    });
    return result;
  } finally {
    session.endSession();
  }
}

// Recomputes status for any Issued record whose dueDate has passed — call from a scheduled
// job or on-read; kept as an explicit function rather than a cron per the "no background
// jobs beyond scope" brief.
async function refreshOverdueStatuses() {
  return BookIssue.updateMany(
    { status: "Issued", returnDate: null, dueDate: { $lt: new Date() } },
    { $set: { status: "Overdue" } }
  );
}

module.exports = { issueBook, returnBook, refreshOverdueStatuses };
