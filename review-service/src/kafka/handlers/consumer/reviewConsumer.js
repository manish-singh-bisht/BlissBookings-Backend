const prisma = require("../../../lib/prisma");

exports.deleteReviewsOfProperty = async (propertyId) => {
  try {
    await prisma.review.deleteMany({
      where: { propertyId },
    });
  } catch (error) {
    console.error("Error deleting reviews:", error);
  }
};
