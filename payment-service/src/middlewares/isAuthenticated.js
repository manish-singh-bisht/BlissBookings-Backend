const axios = require("axios");
const { AUTH_SERVICE_URL } = require("../config");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/verify-token`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    req.user = response.data.user;
    next();
  } catch (error) {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.error === "Unauthorized, invalid token"
    ) {
      // Token expired, try refreshing the token
      try {
        const refreshToken = req.cookies.refreshToken;

        const refreshResponse = await axios.post(
          `${AUTH_SERVICE_URL}/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        req.headers.authorization = `Bearer ${newAccessToken}`;

        const retryResponse = await axios.post(
          `${AUTH_SERVICE_URL}/verify-token`,
          {},
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          }
        );

        req.user = retryResponse.data.user;
        next();
      } catch (refreshError) {
        if (
          refreshError.response &&
          refreshError.response.data.error ===
            "Refresh token is expired or used"
        ) {
          return res
            .status(401)
            .json({ message: "Refresh token is expired or used" });
        }
        return res.status(401).json({ message: "Failed to validate token" });
      }
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = isAuthenticated;
