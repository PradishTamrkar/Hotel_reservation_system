const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require("./env");

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
const verifyRawToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

module.exports = {
  generateToken,
  verifyRawToken,
  cookieOptions,
  JWT_SECRET,
};
