const {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} = require("../config");

const jwt = require("jsonwebtoken");

// Generate JWT for access token
const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate JWT for refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
