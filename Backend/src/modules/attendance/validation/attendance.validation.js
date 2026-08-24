const Joi = require("joi");

const record = Joi.object({
  personId: Joi.string().hex().length(24).required(),
  personType: Joi.string().valid("Student", "Staff").required(),
  class: Joi.string().allow(""),
  status: Joi.string().valid("present", "absent", "leave", "holiday").required(),
  remarks: Joi.string().trim().allow(""),
});

const bulkMark = Joi.object({
  date: Joi.date().required(),
  records: Joi.array().items(record).min(1).required(),
});

const query = Joi.object({
  date: Joi.date(),
  from: Joi.date(),
  to: Joi.date(),
  personId: Joi.string().hex().length(24),
  personType: Joi.string().valid("Student", "Staff"),
  class: Joi.string(),
});

module.exports = { bulkMark, query };
