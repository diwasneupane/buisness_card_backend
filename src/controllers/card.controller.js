import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BusinessCard } from "../models/card.model.js";

export const createBusinessCards = asyncHandler(async (req, res) => {
  const { count } = req.body;

  if (!count || count <= 0) {
    throw new ApiError(400, "Invalid count provided");
  }

  const cards = Array(count)
    .fill()
    .map(() => ({
      assignedTo: req.user._id,
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
  console.log(req.params);

  const card = await BusinessCard.findOne({
    $or: [{ urlCode }, { customUrlCode: urlCode }],
    isActive: true,
  }).populate("assignedTo", "username email");

  if (!card) {
    throw new ApiError(404, "Business card not found or inactive");
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

export const updateBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;
  const { details } = req.body;

  const card = await BusinessCard.findOneAndUpdate(
    {
      $or: [{ urlCode }, { customUrlCode: urlCode }],
      assignedTo: req.user._id,
    },
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

export const deactivateBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;

  const card = await BusinessCard.findOneAndUpdate(
    {
      $or: [{ urlCode }, { customUrlCode: urlCode }],
      assignedTo: req.user._id,
      isActive: true,
    },
    { isActive: false },
    { new: true }
  );

  if (!card) {
    throw new ApiError(
      404,
      "Business card not found, inactive, or you don't have permission to deactivate"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Business card deactivated successfully", card));
});

export const reAssignBusinessCard = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;
  const { newUserId } = req.body;

  const card = await BusinessCard.findOneAndUpdate(
    { $or: [{ urlCode }, { customUrlCode: urlCode }] },
    {
      assignedTo: newUserId,
      details: {},
      customUrlCode: undefined,
      isActive: true,
      startDate: Date.now(),
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

export const setCustomUrlCode = asyncHandler(async (req, res) => {
  const { urlCode } = req.params;
  const { customUrlCode } = req.body;

  if (!customUrlCode) {
    throw new ApiError(400, "Custom URL code is required");
  }

  const existingCard = await BusinessCard.findOne({ customUrlCode });
  if (existingCard) {
    throw new ApiError(409, "Custom URL code already in use");
  }

  const card = await BusinessCard.findOneAndUpdate(
    {
      $or: [{ urlCode }, { customUrlCode: urlCode }],
      assignedTo: req.user._id,
    },
    { customUrlCode },
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
    .json(new ApiResponse(200, "Custom URL code set successfully", card));
});
