const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { checkSchema } = require("express-validator");
const { paymentValidationSchema } = require("../utils/validation");
const { paymentCallback } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", checkSchema(paymentValidationSchema), paymentCallback);

//maybe another endpoint for getting all payments for some analysis purpose.

module.exports = router;
