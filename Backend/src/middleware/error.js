const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let { statusCode, message, details } = err;

  if (err.name === "ValidationError") {
    // mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : "Duplicate value";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  statusCode = statusCode || 500;
  message = message || "Internal server error";

  if (statusCode === 500) {
    console.error(err); // eslint-disable-line no-console
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = { notFound, errorHandler };
