const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const Book = require("../model/Book");

const base = crudController(Book, { filterableFields: ["category"] });

// availableCopies must never exceed totalCopies when totalCopies is raised/lowered by hand.
const updateById = catchAsync(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });

  const issuedOut = book.totalCopies - book.availableCopies;
  Object.assign(book, req.body);
  if (req.body.totalCopies !== undefined) {
    book.availableCopies = Math.max(0, req.body.totalCopies - issuedOut);
  }
  await book.save();
  res.json({ success: true, data: book });
});

module.exports = { ...base, updateById };
