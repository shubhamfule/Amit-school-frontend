const Joi = require("joi");

const create = Joi.object({
  subject: Joi.string().trim().required(),
  class: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().trim().allow(""),
  room: Joi.string().trim().allow(""),
  syllabus: Joi.string().trim().allow(""),
  status: Joi.string().valid("upcoming", "completed"),
});

const update = create.fork(["subject", "class", "date"], (s) => s.optional());

module.exports = { create, update };
