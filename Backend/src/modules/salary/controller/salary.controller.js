const catchAsync = require("../../../utils/catchAsync");
const service = require("../service/salary.service");
const SalaryPayment = require("../model/SalaryPayment");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.staffId) filter.staffId = req.query.staffId;
  if (req.query.month) filter.month = req.query.month;
  const docs = await SalaryPayment.find(filter).populate("staffId").sort({ month: -1 });
  res.json({ success: true, data: docs });
});

const generate = catchAsync(async (req, res) => {
  const doc = await service.generate(req.body);
  res.status(201).json({ success: true, data: doc });
});

const pay = catchAsync(async (req, res) => {
  const doc = await service.pay(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: doc });
});

module.exports = { list, generate, pay };
