const Joi = require("joi");

const create = Joi.object({
  personId: Joi.string().hex().length(24).required(),
  memberType: Joi.string().valid("Student", "Staff").required(),
  membershipStatus: Joi.string().valid("Active", "Suspended"),
});

const update = Joi.object({
  membershipStatus: Joi.string().valid("Active", "Suspended").required(),
});

module.exports = { create, update };
