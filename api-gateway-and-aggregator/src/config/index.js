const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  REVIEW_SERVICE_URL: process.env.REVIEW_SERVICE_URL,
  PROPERTY_SERVICE_URL: process.env.PROPERTY_SERVICE_URL,
};
