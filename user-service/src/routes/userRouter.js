const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  userIdValidationSchema,
  updateUserValidationSchema,
  registerValidationSchema,
} = require("../utils/validation");
const {
  getUser,
  deleteUser,
  updateUser,
  register,
} = require("../controllers/userController");
const { checkSchema } = require("express-validator");
const { isAuthorized } = require("../middlewares/isAuthorized");

const router = express.Router();

router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(userIdValidationSchema),
  getUser
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(userIdValidationSchema),
  deleteUser
);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(updateUserValidationSchema),
  updateUser
);
router.post("/register", checkSchema(registerValidationSchema), register);

module.exports = router;
