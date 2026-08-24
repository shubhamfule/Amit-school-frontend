const Joi = require("joi");

const issue = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  memberId: Joi.string().hex().length(24).required(),
  issueDate: Joi.date(),
  dueDate: Joi.date().required(),
});

const returnBook = Joi.object({
  returnDate: Joi.date(),
  returnCondition: Joi.string().valid("Good", "Damaged", "Late").required(),
  damageType: Joi.string().valid("No Damage", "Torn Pages", "Missing Pages", "Water Damage", "Lost Book"),
  remarks: Joi.string().trim().allow(""),
});

module.exports = { issue, returnBook };
