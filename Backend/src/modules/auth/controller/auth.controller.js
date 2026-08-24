const catchAsync = require("../../../utils/catchAsync");
const authService = require("../service/auth.service");
const { cookieName, nodeEnv } = require("../../../config/env");

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    label: user.label,
    refId: user.refId,
  };
}

function setAuthCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ success: true, data: toPublicUser(user) });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  setAuthCookie(res, token);
  res.json({ success: true, data: toPublicUser(user) });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie(cookieName);
  res.json({ success: true, data: null });
});

const me = catchAsync(async (req, res) => {
  res.json({ success: true, data: toPublicUser(req.user) });
});

module.exports = { register, login, logout, me };
