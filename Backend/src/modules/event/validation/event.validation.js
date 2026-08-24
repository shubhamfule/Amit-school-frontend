const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow(""),
  date: Joi.date().required(),
  time: Joi.string().trim().allow(""),
  venue: Joi.string().trim().allow(""),
  type: Joi.string().valid("due", "holiday", "meeting", "bookfair", "workshop", "academic", "sports"),
  status: Joi.string().valid("Scheduled", "Upcoming", "Completed", "Cancelled"),
});

const update = create.fork(["title", "date"], (s) => s.optional());

module.exports = { create, update };
