const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().trim().required(),
  subject: Joi.string().trim().required(),
  class: Joi.string().required(),
  dueDate: Joi.date().required(),
  description: Joi.string().trim().allow(""),
  status: Joi.string().valid("Active", "Completed", "Archived"),
  teacherId: Joi.string().hex().length(24).required(),
});

const update = create.fork(["title", "subject", "class", "dueDate", "teacherId"], (s) => s.optional());

module.exports = { create, update };
