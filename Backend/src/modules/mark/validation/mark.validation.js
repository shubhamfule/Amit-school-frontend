const Joi = require("joi");

const create = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  examId: Joi.string().hex().length(24),
  testName: Joi.string().trim(),
  subject: Joi.string().trim().required(),
  term: Joi.string().valid("unit1", "unit2", "term1", "term2", "final"),
  marksObtained: Joi.number().min(0).required(),
  maxMarks: Joi.number().min(1).default(100),
});

const update = create.fork(["studentId", "subject", "marksObtained"], (s) => s.optional());

module.exports = { create, update };
