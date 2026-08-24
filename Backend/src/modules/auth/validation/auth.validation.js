const Joi = require("joi");
const { ROLES } = require("../../../constants/roles");

const register = Joi.object({
  username: Joi.string().trim().min(3).max(40).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(72).required(),
  role: Joi.string().valid(...ROLES).required(),
  label: Joi.string().trim().max(80),
  refId: Joi.string().hex().length(24),
});

const login = Joi.object({
  identifier: Joi.string().trim().required(), // username or email
  password: Joi.string().required(),
});

module.exports = { register, login };
