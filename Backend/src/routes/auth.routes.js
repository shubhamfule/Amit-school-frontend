// Auth routes — one login per portal role (admin, library, main-accountant,
// non-teaching-accountant, student-accountant, teaching-accountant,
// teacher, student), matching the frontend's separate Login.jsx pages.
// Every real login form only ever collects email + password; `identifier`
// here accepts either email or username.

const jwt = require("jsonwebtoken");
const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { User, ROLES } = require("../module/Admin");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { jwtSecret, jwtExpiresIn, cookieName, nodeEnv } = require("../config/env");

const router = Router();

// Throttles brute-force login/register attempts. Skipped in tests so the
// test suite isn't rate-limited when it hits these routes repeatedly.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => nodeEnv === "test",
  message: { success: false, message: "Too many attempts, please try again later" },
});

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function setAuthCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function toPublicUser(user) {
  return { id: user._id, username: user.username, email: user.email, role: user.role, label: user.label };
}

router.post(
  "/register",
  authLimiter,
  catchAsync(async (req, res) => {
    const { username, email, password, role, label, refId } = req.body;
    if (!username || !email || !password || !role) {
      throw new ApiError(400, "username, email, password and role are required");
    }
    if (!ROLES.includes(role)) throw new ApiError(400, `role must be one of: ${ROLES.join(", ")}`);

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) throw new ApiError(409, "Username or email already in use");

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ username, email, passwordHash, role, label, refId });
    const token = signToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ success: true, data: toPublicUser(user) });
  })
);

router.post(
  "/login",
  authLimiter,
  catchAsync(async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) throw new ApiError(400, "identifier and password are required");

    const normalized = String(identifier).trim().toLowerCase();
    const user = await User.findOne({ $or: [{ username: normalized }, { email: normalized }] }).select(
      "+passwordHash"
    );
    if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    setAuthCookie(res, token);
    res.json({ success: true, data: toPublicUser(user) });
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie(cookieName);
  res.json({ success: true, data: null });
});

router.get("/me", protect, (req, res) => {
  res.json({ success: true, data: toPublicUser(req.user) });
});

module.exports = router;
