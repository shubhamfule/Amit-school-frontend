const Joi = require("joi");

const create = Joi.object({
  key: Joi.string().trim().required(),
  label: Joi.string().trim().required(),
  sections: Joi.array().items(Joi.string().trim()).default([]),
  classTeacherId: Joi.string().hex().length(24),
});

const update = create.fork(["key", "label"], (s) => s.optional());

module.exports = { create, update };
