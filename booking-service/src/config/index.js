const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  CLIENT_ID: process.env.CLIENT_ID,
  REDIS_URL: process.env.REDIS_URL,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
};
