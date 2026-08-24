const Joi = require("joi");

const clear = Joi.object({
  remarks: Joi.string().trim().allow(""),
});

module.exports = { clear };
