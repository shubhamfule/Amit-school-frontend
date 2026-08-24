const Joi = require("joi");

const create = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().required(),
  category: Joi.string().valid("excellence", "academic", "sports", "participation").required(),
  issuer: Joi.string().trim().allow(""),
  date: Joi.date().required(),
  fileUrl: Joi.string().trim().allow(""),
});

const update = create.fork(["studentId", "title", "category", "date"], (s) => s.optional());

module.exports = { create, update };
