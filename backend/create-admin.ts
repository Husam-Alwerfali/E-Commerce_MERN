import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "./src/models/userModel.js";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await userModel.findOne({ email: "admin@shop.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@shop.com");
      console.log("Password: admin2024");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin2024", 10);

    const adminUser = new userModel({
      firstName: "Shop",
      lastName: "Admin",
      email: "admin@shop.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@shop.com");
    console.log("Password: admin2024");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdminUser();
