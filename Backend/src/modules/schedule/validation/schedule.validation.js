const Joi = require("joi");

const entry = Joi.object({
  dayOfWeek: Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat").required(),
  startTime: Joi.string().trim().required(),
  endTime: Joi.string().trim().required(),
  subject: Joi.string().trim().required(),
  class: Joi.string().required(),
  room: Joi.string().trim().allow(""),
  teacherId: Joi.string().hex().length(24).required(),
  status: Joi.string().valid("Upcoming", "Ongoing", "Completed"),
});

const create = entry;
const update = entry.fork(
  ["dayOfWeek", "startTime", "endTime", "subject", "class", "teacherId"],
  (s) => s.optional()
);
const bulkCreate = Joi.object({ entries: Joi.array().items(entry).min(1).required() });

module.exports = { create, update, bulkCreate };
