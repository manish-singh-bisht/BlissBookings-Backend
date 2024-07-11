// Validation schema for creating a review
const createReviewValidationSchema = {
  propertyId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Property ID is required",
    },
    isUUID: {
      errorMessage: "Property ID must be a valid UUID",
    },
  },
  userId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "User ID is required",
    },
    isUUID: {
      errorMessage: "User ID must be a valid UUID",
    },
  },
  comment: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Comment is required",
    },
    isString: {
      errorMessage: "Comment must be a string",
    },
  },
  rating: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Rating is required",
    },
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rating must be an integer between 1 and 5",
    },
  },
};

// Validation schema for updating a review
const updateReviewValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Review ID is required",
    },
    isUUID: {
      errorMessage: "Invalid review ID",
    },
  },
  propertyId: {
    in: ["body"],
    optional: true,
    isUUID: {
      errorMessage: "Property ID must be a valid UUID",
    },
  },
  userId: {
    in: ["body"],
    optional: true,
    isUUID: {
      errorMessage: "User ID must be a valid UUID",
    },
  },
  comment: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Comment must be a string",
    },
  },
  rating: {
    in: ["body"],
    optional: true,
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rating must be an integer between 1 and 5",
    },
  },
};

// Validation schema for review ID parameter
const reviewIdValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: " ID is required",
    },
    isUUID: {
      errorMessage: "Invalid  ID",
    },
  },
};

module.exports = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
  reviewIdValidationSchema,
};
