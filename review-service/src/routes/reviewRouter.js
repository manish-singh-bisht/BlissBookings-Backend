const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { checkSchema } = require("express-validator");
const {
  isAuthorized,
  canPerformActionOnReview,
} = require("../middlewares/isAuthorized");
const {
  createReview,
  getReviewByReviewId,
  updateReview,
  deleteReview,
  getAllReviewsByPropertyId,
} = require("../controllers/reviewController");
const {
  createReviewValidationSchema,
  reviewIdValidationSchema,
  updateReviewValidationSchema,
} = require("../utils/validation");

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(createReviewValidationSchema),
  createReview
);
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(reviewIdValidationSchema),
  getReviewByReviewId
);

router.get(
  "/property/:id", //id===propertyId
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  checkSchema(reviewIdValidationSchema),
  getAllReviewsByPropertyId
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  canPerformActionOnReview,
  checkSchema(reviewIdValidationSchema),
  checkSchema(updateReviewValidationSchema),
  updateReview
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("USER", "HOST"),
  canPerformActionOnReview,
  checkSchema(reviewIdValidationSchema),
  deleteReview
);

module.exports = router;
