const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  propertyIdValidationSchema,
  updatePropertyValidationSchema,
  createPropertyValidationSchema,
} = require("../utils/validation");
const { checkSchema } = require("express-validator");
const {
  isAuthorized,
  canPerformActionOnProperty,
} = require("../middlewares/isAuthorized");
const {
  getPropertyById,
  getAllProperties,
  deleteProperty,
  updateProperty,
  createProperty,
} = require("../controllers/propertyController");

const router = express.Router();

router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(propertyIdValidationSchema),
  getPropertyById
);
router.get(
  "/",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  getAllProperties
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("HOST"),
  canPerformActionOnProperty,
  checkSchema(propertyIdValidationSchema),
  deleteProperty
);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("HOST"),
  canPerformActionOnProperty,
  checkSchema(updatePropertyValidationSchema),
  updateProperty
);
router.post(
  "/",
  isAuthenticated,
  isAuthorized("HOST"),
  checkSchema(createPropertyValidationSchema),
  createProperty
);

module.exports = router;
