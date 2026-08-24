const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const LeaveApplication = require("../model/LeaveApplication");
const service = require("../service/leave.service");

const base = crudController(LeaveApplication, {
  filterableFields: ["applicantId", "applicantType", "status"],
});

const apply = catchAsync(async (req, res) => {
  const leave = await service.apply(req.body);
  res.status(201).json({ success: true, data: leave });
});

const review = catchAsync(async (req, res) => {
  const leave = await service.setStatus(req.params.id, req.body.status, req.user._id);
  res.json({ success: true, data: leave });
});

module.exports = { ...base, create: apply, review };
