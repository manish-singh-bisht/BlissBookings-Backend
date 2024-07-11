// Validation schema for property creation
const createPropertyValidationSchema = {
  name: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  per_night_price: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Per night price is required",
    },
    isDecimal: {
      errorMessage: "Per night price must be a decimal number",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Description is required",
    },
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  hostId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Host ID is required",
    },
    isUUID: {
      errorMessage: "Host ID must be a valid UUID",
    },
  },
  guests_num: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Number of guests is required",
    },
    isInt: {
      errorMessage: "Number of guests must be an integer",
    },
  },
  bed_num: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Number of beds is required",
    },
    isInt: {
      errorMessage: "Number of beds must be an integer",
    },
  },
  bedroom_num: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Number of bedrooms is required",
    },
    isInt: {
      errorMessage: "Number of bedrooms must be an integer",
    },
  },
  bathroom_num: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Number of bathrooms is required",
    },
    isInt: {
      errorMessage: "Number of bathrooms must be an integer",
    },
  },
  address_line_1: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Address line 1 is required",
    },
    isString: {
      errorMessage: "Address line 1 must be a string",
    },
  },
  address_line_2: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Address line 2 must be a string",
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
  propertyTypeId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Property type ID is required",
    },
    isUUID: {
      errorMessage: "Property type ID must be a valid UUID",
    },
  },
};

// Validation schema for updating property
const updatePropertyValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Property ID is required",
    },
    isUUID: {
      errorMessage: "Invalid property ID",
    },
  },
  name: {
    in: ["body"],
    optional: true,
    trim: true,
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  per_night_price: {
    in: ["body"],
    optional: true,
    isDecimal: {
      errorMessage: "Per night price must be a decimal number",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  hostId: {
    in: ["body"],
    optional: true,
    isUUID: {
      errorMessage: "Host ID must be a valid UUID",
    },
  },
  guests_num: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "Number of guests must be an integer",
    },
  },
  bed_num: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "Number of beds must be an integer",
    },
  },
  bedroom_num: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "Number of bedrooms must be an integer",
    },
  },
  bathroom_num: {
    in: ["body"],
    optional: true,
    isInt: {
      errorMessage: "Number of bathrooms must be an integer",
    },
  },
  address_line_1: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Address line 1 must be a string",
    },
  },
  address_line_2: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Address line 2 must be a string",
    },
  },
  locationId: {
    in: ["body"],
    optional: true,
    isUUID: {
      errorMessage: "Location ID must be a valid UUID",
    },
  },
  propertyTypeId: {
    in: ["body"],
    optional: true,
    isUUID: {
      errorMessage: "Property type ID must be a valid UUID",
    },
  },
};

// Validation schema for property ID parameter
const propertyIdValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Property ID is required",
    },
    isUUID: {
      errorMessage: "Invalid property ID",
    },
  },
};

module.exports = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
  propertyIdValidationSchema,
};
