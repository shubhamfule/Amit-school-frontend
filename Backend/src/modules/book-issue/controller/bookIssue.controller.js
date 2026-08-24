const catchAsync = require("../../../utils/catchAsync");
const service = require("../service/bookIssue.service");
const BookIssue = require("../model/BookIssue");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.memberId) filter.memberId = req.query.memberId;
  if (req.query.status) filter.status = req.query.status;
  const docs = await BookIssue.find(filter).populate("bookId memberId").sort({ issueDate: -1 });
  res.json({ success: true, data: docs });
});

const issue = catchAsync(async (req, res) => {
  const doc = await service.issueBook(req.body);
  res.status(201).json({ success: true, data: doc });
});

const returnBook = catchAsync(async (req, res) => {
  const data = await service.returnBook(req.params.id, req.body);
  res.json({ success: true, data });
});

module.exports = { list, issue, returnBook };
