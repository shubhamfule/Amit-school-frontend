const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { jwtSecret, cookieName } = require("../config/env");
const { User } = require("../module/Admin");

const protect = catchAsync(async (req, res, next) => {
  const token =
    req.cookies?.[cookieName] ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) throw new ApiError(401, "Not authenticated");

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired session");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, "Not authenticated");

  req.user = user;
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated"));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}

module.exports = { protect, authorize };
