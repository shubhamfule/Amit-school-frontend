const Joi = require("joi");

const create = Joi.object({
  employeeCode: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  staffType: Joi.string().valid("teaching", "non-teaching").required(),
  designation: Joi.string().trim().required(),
  department: Joi.string().trim(),
  classesAssigned: Joi.array().items(Joi.string().trim()).default([]),
  mobile: Joi.string().trim(),
  email: Joi.string().trim().email(),
  joiningDate: Joi.date().required(),
  monthlySalary: Joi.number().min(0).required(),
  status: Joi.string().valid("Active", "On Leave", "Inactive"),
});

const update = create.fork(
  ["employeeCode", "name", "staffType", "designation", "joiningDate", "monthlySalary"],
  (s) => s.optional()
);

module.exports = { create, update };
