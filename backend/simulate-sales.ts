import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "./src/models/productModel.js";

// Load environment variables
dotenv.config();

const simulateSales = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    // Find all products
    const products = await productModel.find();

    if (products.length === 0) {
      console.log("No products found! Please add some products first.");
      return;
    }

    console.log(`Found ${products.length} products. Simulating sales...`);

    // Simulate sales for each product
    for (const product of products) {
      // Add random sales between 1 and 20
      const randomSales = Math.floor(Math.random() * 20) + 1;
      product.salesCount = randomSales;
      await product.save();

      console.log(`${product.title}: Added ${randomSales} sales`);
    }

    console.log("Sales simulation completed!");
  } catch (error) {
    console.error("Error simulating sales:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

simulateSales();
