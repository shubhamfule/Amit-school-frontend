const Joi = require("joi");

const update = Joi.object({
  notifications: Joi.object(),
  rules: Joi.object(),
  theme: Joi.string().valid("light", "dark", "system"),
  twoFactorEnabled: Joi.boolean(),
  autoBackup: Joi.boolean(),
});

module.exports = { update };
