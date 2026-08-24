const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  isbn: Joi.string().trim().allow(""),
  publisher: Joi.string().trim().allow(""),
  category: Joi.string().trim().required(),
  totalCopies: Joi.number().min(0).default(1),
});

const update = Joi.object({
  title: Joi.string().trim(),
  author: Joi.string().trim(),
  isbn: Joi.string().trim().allow(""),
  publisher: Joi.string().trim().allow(""),
  category: Joi.string().trim(),
  totalCopies: Joi.number().min(0),
});

module.exports = { create, update };
