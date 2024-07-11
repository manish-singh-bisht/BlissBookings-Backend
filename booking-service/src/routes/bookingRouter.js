const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");

const { checkSchema } = require("express-validator");
const { isAuthorized } = require("../middlewares/isAuthorized");
const {
  createBooking,
  markBookingPast,
} = require("../controllers/bookingController");
const {
  createBookingValidationSchema,
  idValidationSchema,
} = require("../utils/validation");

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(createBookingValidationSchema),
  createBooking
);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(idValidationSchema),
  markBookingPast
);

module.exports = router;
