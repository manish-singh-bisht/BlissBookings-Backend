const express = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
  verifyToken,
} = require("../controllers/authController");
const { checkSchema } = require("express-validator");
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../utils/validations");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/register", checkSchema(registerValidationSchema), register);
router.post("/login", checkSchema(loginValidationSchema), login);
router.post("/logout", isAuthenticated, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/verify-token", verifyToken);

module.exports = router;
