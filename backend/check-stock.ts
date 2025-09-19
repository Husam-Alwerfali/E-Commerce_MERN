import productModel from "./src/models/productModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function checkProductStock() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL || "");
    console.log("Connected to MongoDB");

    // Get all products and their current stock
    const products = await productModel.find({});

    console.log("\n=== Current Product Stock Status ===");
    products.forEach((product) => {
      console.log(`Product: ${product.title}`);
      console.log(`  Stock: ${product.stock} units`);
      console.log(`  Sales: ${product.salesCount} sold`);
      console.log(`  Price: ${product.price} LYD`);
      console.log(
        `  Status: ${product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}`
      );
      console.log("---");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkProductStock();
