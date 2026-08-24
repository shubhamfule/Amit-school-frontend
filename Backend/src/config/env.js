require("dotenv").config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amit_school",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "amit_school_token",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
