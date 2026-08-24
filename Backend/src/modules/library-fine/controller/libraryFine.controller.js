const catchAsync = require("../../../utils/catchAsync");
const LibraryFine = require("../model/LibraryFine");
const service = require("../service/libraryFine.service");

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const docs = await LibraryFine.find(filter).populate("issueId").sort({ createdAt: -1 });
  res.json({ success: true, data: docs });
});

const clear = catchAsync(async (req, res) => {
  const fine = await service.clear(req.params.id, req.body);
  res.json({ success: true, data: fine });
});

module.exports = { list, clear };
