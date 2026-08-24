const Joi = require("joi");

const LEAVE_TYPES = [
  "Sick Leave", "Casual Leave", "Earned Leave", "Maternity/Paternity Leave", "Unpaid Leave",
  "Medical Leave", "Personal Leave", "Family Function", "Emergency", "Other",
];

const create = Joi.object({
  applicantId: Joi.string().hex().length(24).required(),
  applicantType: Joi.string().valid("Student", "Staff").required(),
  leaveType: Joi.string().valid(...LEAVE_TYPES).required(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().min(Joi.ref("fromDate")).required(),
  reason: Joi.string().trim().required(),
});

const updateStatus = Joi.object({
  status: Joi.string().valid("Pending", "Approved", "Rejected").required(),
});

module.exports = { create, updateStatus };
