import mongoose from "mongoose";
import crypto from "crypto";

const businessCardSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(3).toString("hex"),
    },
    customUrlCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    purchaseId: {
      type: String,
      unique: true,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
    },
    details: {
      name: String,
      title: String,
      company: String,
      phone: String,
      email: String,
      website: String,
      address: String,
      // Add more fields as needed
    },
  },
  { timestamps: true }
);

export const BusinessCard = mongoose.model("BusinessCard", businessCardSchema);
