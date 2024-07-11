const { validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma");

exports.createReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { propertyId, userId, comment, rating } = matchedData(req);

  try {
    const review = await prisma.review.create({
      data: { propertyId, userId, comment, rating },
    });

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Review creation failed" });
  }
};

exports.getReviewByReviewId = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id } = matchedData(req);

  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ error: "Error fetching review" });
  }
};

exports.getAllReviewsByPropertyId = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id: propertyId } = matchedData(req);

  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: propertyId },
    });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this property" });
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

exports.updateReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id, propertyId, userId, comment, rating } = matchedData(req);

  try {
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { propertyId, userId, comment, rating },
    });

    return res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Review update failed" });
  }
};

exports.deleteReview = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { id } = matchedData(req);

  try {
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({
      where: { id },
    });

    return res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Review deletion failed" });
  }
};
