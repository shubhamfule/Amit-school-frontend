const catchAsync = require("../../../utils/catchAsync");
const Transaction = require("../model/Transaction");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  const docs = await Transaction.find(filter).sort({ date: -1 }).limit(200);
  res.json({ success: true, data: docs });
});

module.exports = { list };
