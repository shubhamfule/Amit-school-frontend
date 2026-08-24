const Joi = require("joi");

const installment = Joi.object({
  label: Joi.string().trim().required(),
  amount: Joi.number().min(0).required(),
  dueDate: Joi.date().required(),
});

const create = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  academicYear: Joi.string().required(),
  totalAmount: Joi.number().min(0).required(),
  installments: Joi.array().items(installment).default([]),
});

module.exports = { create };
