const isAuthorized = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("Error during role authorization:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { isAuthorized };
