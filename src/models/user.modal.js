import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Inside isPasswordCorrect method");
  console.log(`Stored hashed password: ${this.password}`);
  console.log(`Provided password: ${password}`);
  const isMatch = await bcrypt.compare(password, this.password);
  console.log("aaaaaaaaa", await bcrypt.compare(password, this.password));

  console.log(`Password match result: ${isMatch}`);
  return isMatch;
};

export const User = mongoose.model("User", userSchema);
