const paymentValidationSchema = {
  method: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Payment method must be a string",
    },
  },
  transactionId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Transaction ID is required",
    },
    isString: {
      errorMessage: "Transaction ID must be a string",
    },
  },
  gatewaySignature: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Gateway signature is required",
    },
    isString: {
      errorMessage: "Gateway signature must be a string",
    },
  },
  gatewayOrderId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Gateway order ID is required",
    },
    isString: {
      errorMessage: "Gateway order ID must be a string",
    },
  },
  payerEmail: {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Payer email must be a valid email address",
    },
  },
  payerName: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Payer name must be a string",
    },
  },
  payerId: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Payer ID must be a string",
    },
  },
};

module.exports = {
  paymentValidationSchema,
};
