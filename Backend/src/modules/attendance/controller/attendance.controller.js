const catchAsync = require("../../../utils/catchAsync");
const service = require("../service/attendance.service");

const bulkMark = catchAsync(async (req, res) => {
  const docs = await service.bulkMark(req.body, req.user._id);
  res.status(201).json({ success: true, data: docs });
});

const list = catchAsync(async (req, res) => {
  const docs = await service.listByDate(req.query);
  res.json({ success: true, data: docs });
});

const stats = catchAsync(async (req, res) => {
  const data = await service.statsForPerson(req.params.personId, req.query);
  res.json({ success: true, data });
});

module.exports = { bulkMark, list, stats };
