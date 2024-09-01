import mongoose from "mongoose";
import crypto from "crypto";

const businessCardSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
      unique: true,
      required: true,
      default: () => crypto.randomBytes(3).toString("hex"),
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
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
    },
  },
  { timestamps: true }
);

businessCardSchema.index({ urlCode: 1 }, { unique: true });

export const BusinessCard = mongoose.model("BusinessCard", businessCardSchema);
