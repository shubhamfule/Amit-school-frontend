const ApiError = require("../utils/ApiError");

// Validates req[source] against a Joi schema, replacing it with the coerced value.
function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(400, "Validation failed", details));
    }
    req[source] = value;
    next();
  };
}

module.exports = validate;
