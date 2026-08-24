const jwt = require("jsonwebtoken");
const ApiError = require("../../../utils/ApiError");
const { jwtSecret, jwtExpiresIn } = require("../../../config/env");
const User = require("../model/User");

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

async function register({ username, email, password, role, label, refId }) {
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) throw new ApiError(409, "Username or email already in use");

  const passwordHash = await User.hashPassword(password);
  const refModel = role === "student" ? "Student" : role === "teacher" ? "Staff" : undefined;

  const user = await User.create({
    username,
    email,
    passwordHash,
    role,
    label,
    refId: refModel ? refId : undefined,
    refModel,
  });

  return { user, token: signToken(user) };
}

async function login({ identifier, password }) {
  const normalized = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ username: normalized }, { email: normalized }],
  }).select("+passwordHash");

  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  user.lastLoginAt = new Date();
  await user.save();

  return { user, token: signToken(user) };
}

module.exports = { register, login, signToken };
