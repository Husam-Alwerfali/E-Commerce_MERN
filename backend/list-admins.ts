import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./src/models/userModel.js";

// Load environment variables
dotenv.config();

const listAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    // Find all admin users
    const adminUsers = await userModel
      .find({ role: "admin" })
      .select("firstName lastName email role");

    if (adminUsers.length === 0) {
      console.log("No admin users found!");
    } else {
      console.log(`Found ${adminUsers.length} admin user(s):`);
      console.log("=====================================");
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log("---");
      });
    }
  } catch (error) {
    console.error("Error listing admin users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

listAdminUsers();
