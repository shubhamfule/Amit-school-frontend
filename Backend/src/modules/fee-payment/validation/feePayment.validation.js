const Joi = require("joi");

const pay = Joi.object({
  studentFeeId: Joi.string().hex().length(24).required(),
  installmentId: Joi.string().hex().length(24).required(),
  amount: Joi.number().greater(0).required(),
  method: Joi.string().valid("Online", "Bank Transfer", "Cash", "UPI").required(),
  paidAt: Joi.date(),
});

module.exports = { pay };
