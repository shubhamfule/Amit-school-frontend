const Joi = require("joi");

const guardian = Joi.object({
  name: Joi.string().trim().allow(""),
  occupation: Joi.string().trim().allow(""),
  qualification: Joi.string().trim().allow(""),
  phone: Joi.string().trim().allow(""),
  email: Joi.string().trim().allow(""),
});

const create = Joi.object({
  admissionNo: Joi.string().trim().required(),
  rollNo: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  class: Joi.string().required(),
  section: Joi.string().trim(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  dob: Joi.date(),
  father: guardian,
  mother: guardian,
  contact: Joi.string().trim(),
  address: Joi.string().trim(),
  admissionDate: Joi.date().required(),
  status: Joi.string().valid("Active", "Inactive", "Pending"),
});

const update = create.fork(
  ["admissionNo", "rollNo", "name", "class", "gender", "admissionDate"],
  (s) => s.optional()
);

module.exports = { create, update };
