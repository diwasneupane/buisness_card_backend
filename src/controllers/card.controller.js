import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BusinessCard } from "../models/card.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.modal.js";

export const createBusinessCards = asyncHandler(async (req, res) => {
  const { count } = req.body;

  if (!count || count <= 0) {
    throw new ApiError(400, "Invalid count provided");
  }

  const cards = Array(count)
    .fill()
    .map(() => ({
      assignedTo: req.user._id,
      isActive: false,
    }));

  const createdCards = await BusinessCard.create(cards);

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Business cards created successfully", createdCards)
    );
});

export const getBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;

  const card = await BusinessCard.findOne({ urlCode }).populate(
    "assignedTo",
    "username email"
  );

  if (!card) {
    throw new ApiError(404, "Business card not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card fetched successfully", card));
});

export const getUserBusinessCards = asyncHandler(async (req, res) => {
  const cards = await BusinessCard.find({ assignedTo: req.user._id });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User's business cards fetched successfully", cards)
    );
});

export const getAllBusinessCards = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "You don't have permission to access all cards");
  }

  const cards = await BusinessCard.find().populate(
    "assignedTo",
    "username email role"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "All business cards fetched successfully", cards)
    );
});

export const updateBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;
  const { details } = req.body;

  let query = { urlCode };
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id;
  }

  const card = await BusinessCard.findOneAndUpdate(
    query,
    { $set: { details } },
    { new: true }
  );

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found or you don't have permission to update"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card updated successfully", card));
});

export const activateBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;

  let query = { urlCode, isActive: false };
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id;
  }

  const card = await BusinessCard.findOneAndUpdate(
    query,
    { isActive: true, startDate: Date.now() },
    { new: true }
  );

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found, already active, or you don't have permission to activate"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card activated successfully", card));
});

export const deactivateBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;

  let query = { urlCode, isActive: true };
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id;
  }

  const card = await BusinessCard.findOneAndUpdate(
    query,
    { isActive: false },
    { new: true }
  );

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found, already inactive, or you don't have permission to deactivate"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card deactivated successfully", card));
});

export const reAssignBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;
  const { newUserId } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can reassign cards");
  }

  const newUser = await User.findById(newUserId);
  if (!newUser) {
    throw new ApiError(404, "New user not found");
  }

  const card = await BusinessCard.findOneAndUpdate(
    { urlCode },
    {
      assignedTo: newUserId,
      details: {},
      isActive: false,
      startDate: null,
    },
    { new: true }
  );

  if (!card) {
    throw new ApiError(404, "Business card not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card reassigned successfully", card));
});

export const setUrlCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newUrlCode } = req.body;

  if (!newUrlCode) {
    throw new ApiError(400, "New URL code is required");
  }

  const existingCard = await BusinessCard.findOne({ urlCode: newUrlCode });

  if (existingCard) {
    throw new ApiError(409, "This URL code is already in use");
  }

  const card = await BusinessCard.findOneAndUpdate(
    { _id: id, assignedTo: req.user._id },
    { urlCode: newUrlCode },
    { new: true }
  );

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found or you don't have permission to update"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "URL code updated successfully", card));
});

export const getNonAdminUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can fetch user list");
  }

  const users = await User.find({ role: { $ne: "admin" } }).select(
    "_id username email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Non-admin users fetched successfully", users));
});

export const deleteBusinessCard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid card ID");
  }

  let query = { _id: id };
  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id;
  }

  const card = await BusinessCard.findOneAndDelete(query);

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found or you don't have permission to delete"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card deleted successfully", null));
});
