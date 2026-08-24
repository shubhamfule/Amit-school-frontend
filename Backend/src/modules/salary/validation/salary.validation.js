const Joi = require("joi");

const generate = Joi.object({
  staffId: Joi.string().hex().length(24).required(),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
});

const pay = Joi.object({
  amount: Joi.number().greater(0).required(),
  method: Joi.string().valid("Online", "Bank Transfer", "Cash", "UPI").required(),
});

module.exports = { generate, pay };
