// this is an API Gateway alongside an aggregator.

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const helmet = require("helmet");
const {
  PORT,
  AUTH_SERVICE_URL,
  USER_SERVICE_URL,
  PROPERTY_SERVICE_URL,
  REVIEW_SERVICE_URL,
  BOOKING_SERVICE_URL,
  PAYMENT_SERVICE_URL,
} = require("./config");

const app = express();

app.use(helmet());
app.disable("x-powered-by"); // Hide Express server information

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/auth": "",
    },
  })
);

app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/users": "",
    },
  })
);

app.use(
  "/api/v1/properties",
  createProxyMiddleware({
    target: PROPERTY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/properties": "",
    },
  })
);
app.use(
  "/api/v1/reviews",
  createProxyMiddleware({
    target: REVIEW_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/reviews": "",
    },
  })
);
app.use(
  "/api/v1/bookings",
  createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/bookings": "",
    },
  })
);
app.use(
  "/api/v1/payments",
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/v1/payments": "",
    },
  })
);

/*
app.get("test endpoint", async (req, res) => {
  const { id } = req.params;
  try {
    // Get data from one service,
    // Get it to get the data from other service,
    // Combine data from both the services.
    //send the data
  } catch (error) {
    //catch the errors and send the response
  }
});
*/

app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
