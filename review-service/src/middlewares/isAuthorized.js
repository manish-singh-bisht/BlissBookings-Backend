const prisma = require("../lib/prisma");

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

const canPerformActionOnReview = async (req, res, next) => {
  try {
    const user = req.user;
    const reviewId = req.params.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (error) {
    console.error("Error during review deletion authorization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { isAuthorized, canPerformActionOnReview };
