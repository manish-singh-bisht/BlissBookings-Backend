const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  CLIENT_ID: process.env.CLIENT_ID,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
};
