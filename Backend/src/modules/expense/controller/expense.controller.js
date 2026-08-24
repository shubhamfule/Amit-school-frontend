const catchAsync = require("../../../utils/catchAsync");
const ApiError = require("../../../utils/ApiError");
const service = require("../service/expense.service");
const Expense = require("../model/Expense");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.mode) filter.mode = req.query.mode;
  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to) filter.date.$lte = new Date(req.query.to);
  }
  const docs = await Expense.find(filter).sort({ date: -1 });
  res.json({ success: true, data: docs });
});

const create = catchAsync(async (req, res) => {
  const doc = await service.create(req.body, req.user._id);
  res.status(201).json({ success: true, data: doc });
});

const deleteById = catchAsync(async (req, res) => {
  const doc = await Expense.findByIdAndDelete(req.params.id);
  if (!doc) throw new ApiError(404, "Expense not found");
  res.status(204).send();
});

module.exports = { list, create, deleteById };
