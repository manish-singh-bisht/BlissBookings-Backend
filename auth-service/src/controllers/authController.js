const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");
const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  USER_SERVICE_URL,
} = require("../config");
const { validationResult, matchedData } = require("express-validator");

exports.register = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { email, password, role } = matchedData(req);

  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existedUser) {
      return res.status(409).json({ error: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password_hash: hashedPassword, role },
    });

    const { password_hash: _, ...userWithoutPassword } = user;

    try {
      await axios.post(`${USER_SERVICE_URL}/register`, {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
      });

      // If user service call is successful
      return res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (userServiceError) {
      // If user service call fails, roll back the Auth Service user creation
      await prisma.user.delete({
        where: { email: email },
      });

      return res.status(500).json({ error: "User registration failed" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { email, password } = matchedData(req);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Update the user's refresh token in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });

    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    //options for cookie
    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: "Bad request" });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }, // sets refreshToken to null
  });

  const options = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out" });
};

exports.refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decodedToken?.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ error: "Refresh token is expired or used" });
    }

    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    const accessToken = generateAccessToken(user.id, user.role);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", incomingRefreshToken, options)
      .json({
        accessToken,
        refreshToken: incomingRefreshToken,
        message: "Access token refreshed",
      });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

exports.verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized, user not found" });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};
