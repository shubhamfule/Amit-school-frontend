const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().trim().required(),
  body: Joi.string().required(),
  date: Joi.date(),
  priority: Joi.string().valid("high", "medium", "low"),
  audience: Joi.array().items(Joi.string()),
  category: Joi.string().valid("event", "academic", "holiday", "urgent"),
});

const update = create.fork(["title", "body"], (s) => s.optional());

module.exports = { create, update };
