// scripts/seedAdmin.js
import dotenv from "dotenv";
import { User } from "../models/user.modal.js";
import connectDB from "../db/index.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    const adminData = {
      username: "admin",
      email: "admin@example.com",
      password: "adminpassword123", // You should change this to a secure password
      role: "admin",
    };

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Existing admin details:", existingAdmin);
    } else {
      // Use the User.create method to ensure the pre-save hook is triggered
      const newAdmin = await User.create(adminData);
      console.log("Admin user created successfully");
      console.log("New admin details:", newAdmin);
    }

    // Verify the admin user
    const verifyAdmin = await User.findOne({ role: "admin" });
    if (verifyAdmin) {
      console.log("Admin user verified in database");
      console.log("Admin username:", verifyAdmin.username);
      console.log("Admin email:", verifyAdmin.email);
      console.log("Admin role:", verifyAdmin.role);
    } else {
      console.log("Failed to verify admin user in database");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    // Note: We're not disconnecting here as connectDB might be handling connection lifecycle
    console.log("Seed process completed");
    process.exit(0);
  }
};

seedAdmin();
