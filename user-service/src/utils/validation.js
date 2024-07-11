// Validation schema for id parameter
const userIdValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "User ID is required",
    },
    isUUID: {
      errorMessage: "Invalid user ID",
    },
  },
};
const updateUserValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "User ID is required",
    },
    isUUID: {
      errorMessage: "Invalid user ID",
    },
  },
  name: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  role: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Role is required",
    },
    isIn: {
      options: [["USER", "HOST"]],
      errorMessage: "Role must be either 'USER' or 'HOST'",
    },
  },
  hosting_since: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Hosting since date is required",
    },
    optional: true,
    isISO8601: {
      errorMessage: "Invalid date format",
    },
  },
  text: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Text is required",
    },
    isString: {
      errorMessage: "Text must be a string",
    },
  },
  languages: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Languages are required",
    },
    isArray: {
      errorMessage: "Languages must be an array",
    },
  },
  "languages.*": {
    in: ["body"],
    notEmpty: {
      errorMessage: "Each language is required",
    },
    isString: {
      errorMessage: "Each language must be a string",
    },
  },
  locationId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Location ID is required",
    },
    isUUID: {
      errorMessage: "Location ID must be a valid UUID",
    },
  },
  pets: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Pets is required",
    },
    isBoolean: {
      errorMessage: "Pets must be a boolean",
    },
  },
  job_title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Job title is required",
    },
    isString: {
      errorMessage: "Job title must be a string",
    },
  },
};
const registerValidationSchema = {
  id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "User ID is required",
    },
    isUUID: {
      errorMessage: "Invalid user ID",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Invalid email",
    },
    trim: true,
  },
  role: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Role is required",
    },
    trim: true,
  },
};
module.exports = {
  updateUserValidationSchema,
  userIdValidationSchema,
  registerValidationSchema,
};
