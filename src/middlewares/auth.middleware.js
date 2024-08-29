// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, token failed");
  }
});

export const authenticateAdmin = asyncHandler(async (req, res, next) => {
  await authenticateUser(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      throw new ApiError(403, "Not authorized as an admin");
    }
  });
});

export const validateCardOwnership = asyncHandler(async (req, res, next) => {
  const { cardId } = req.params;
  const card = await Card.findById(cardId);

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  if (card.assignedTo.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to access this card");
  }

  req.card = card;
  next();
});

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin role required.");
  }
  next();
});
