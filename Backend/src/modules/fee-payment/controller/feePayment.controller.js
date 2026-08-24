const catchAsync = require("../../../utils/catchAsync");
const service = require("../service/feePayment.service");
const FeePayment = require("../model/FeePayment");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.studentId) filter.studentId = req.query.studentId;
  const docs = await FeePayment.find(filter).sort({ paidAt: -1 });
  res.json({ success: true, data: docs });
});

const pay = catchAsync(async (req, res) => {
  const payment = await service.pay(req.body, req.user._id);
  res.status(201).json({ success: true, data: payment });
});

module.exports = { list, pay };
