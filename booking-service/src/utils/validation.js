const createBookingValidationSchema = {
  propertyId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Property ID is required",
    },
    isUUID: {
      errorMessage: "Invalid Property ID",
    },
  },
  startDate: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Start date is required",
    },
    isISO8601: {
      errorMessage: "Invalid date format",
    },
  },
  endDate: {
    in: ["body"],
    notEmpty: {
      errorMessage: "End date is required",
    },
    isISO8601: {
      errorMessage: "Invalid date format",
    },
  },
  customerId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Customer ID is required",
    },
    isUUID: {
      errorMessage: "Invalid Customer ID",
    },
  },
  hostId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Host ID is required",
    },
    isUUID: {
      errorMessage: "Invalid Host ID",
    },
  },
  per_night_price: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Per night price is required",
    },
    isDecimal: {
      errorMessage: "Per night price must be a decimal value",
    },
  },
  total_guests: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Total guests is required",
    },
    isInt: {
      errorMessage: "Total guests must be an integer",
    },
  },
  total_price: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Total price is required",
    },
    isDecimal: {
      errorMessage: "Total price must be a decimal value",
    },
  },
};
const idValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Booking ID is required",
    },
    isUUID: {
      errorMessage: "Invalid booking ID",
    },
  },
};

module.exports = {
  createBookingValidationSchema,
  idValidationSchema,
};
