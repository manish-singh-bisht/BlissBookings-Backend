const registerValidationSchema = {
  email: {
    isEmail: {
      errorMessage: "Invalid email",
    },
    trim: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    trim: true,
  },
  role: {
    notEmpty: {
      errorMessage: "Role is required",
    },
    trim: true,
  },
};
const loginValidationSchema = {
  email: {
    isEmail: {
      errorMessage: "Invalid email",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    trim: true,
  },
};
module.exports = { registerValidationSchema, loginValidationSchema };
