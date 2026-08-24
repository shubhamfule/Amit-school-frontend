const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const ScheduleEntry = require("../model/ScheduleEntry");

const base = crudController(ScheduleEntry, { filterableFields: ["class", "teacherId", "dayOfWeek"] });

const bulkCreate = catchAsync(async (req, res) => {
  const docs = await ScheduleEntry.insertMany(req.body.entries);
  res.status(201).json({ success: true, data: docs });
});

module.exports = { ...base, bulkCreate };
