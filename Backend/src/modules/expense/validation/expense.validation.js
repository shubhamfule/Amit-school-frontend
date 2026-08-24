const Joi = require("joi");

const create = Joi.object({
  date: Joi.date(),
  expense: Joi.string().trim().required(),
  category: Joi.string().valid("Utility", "Office", "Transport", "Maintenance", "Other"),
  amount: Joi.number().greater(0).required(),
  mode: Joi.string().valid("Cash", "Bank", "UPI").required(),
  paymentProof: Joi.string().allow(""),
  notes: Joi.string().allow(""),
});

module.exports = { create };
