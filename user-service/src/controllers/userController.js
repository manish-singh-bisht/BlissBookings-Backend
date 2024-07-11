const prisma = require("../lib/prisma");
const { validationResult, matchedData } = require("express-validator");
const { sendMessage } = require("../kafka/producer");

exports.getUser = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { id } = matchedData(req);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { description: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const {
    id,
    name,
    role,
    hosting_since,
    text,
    languages,
    locationId,
    pets,
    job_title,
  } = matchedData(req);

  try {
    // Validate if the locationId exists
    if (locationId) {
      const locationExists = await prisma.location.findUnique({
        where: { id: locationId },
      });

      if (!locationExists) {
        return res.status(400).json({ error: "Invalid location ID" });
      }
    }

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        hosting_since: hosting_since ? new Date(hosting_since) : null,
      },
    });

    // Update Description
    const updatedDescription = await prisma.description.upsert({
      where: { userId: id },
      update: {
        text,
        languages,
        locationId,
        pets,
        job_title,
      },
      create: {
        text,
        languages,
        locationId,
        pets,
        job_title,
        userId: id,
      },
    });

    return res
      .status(200)
      .json({ ...updatedUser, description: updatedDescription });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { id } = matchedData(req);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await prisma.user.delete({
      where: { id },
    });

    await sendMessage("user-topic", {
      event: "delete-user",
      userId: user.id,
    });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const { email, role, id } = matchedData(req);

  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        id: id,
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({ error: "User with email already exists" });
    }

    await prisma.user.create({
      data: { email, role, id, name: email },
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};
