import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "./src/models/productModel.js";

// Load environment variables
dotenv.config();

const updateProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to MongoDB");

    // Update all products without descriptions
    const result = await productModel.updateMany(
      { description: { $exists: false } },
      {
        $set: {
          description:
            "High quality product with excellent features and performance.",
          salesCount: 0,
        },
      }
    );

    console.log(
      `Updated ${result.modifiedCount} products with missing descriptions`
    );

    // Also set salesCount to 0 for all products that don't have it
    const salesResult = await productModel.updateMany(
      { salesCount: { $exists: false } },
      { $set: { salesCount: 0 } }
    );

    console.log(
      `Updated ${salesResult.modifiedCount} products with missing salesCount`
    );

    // Now simulate some sales
    const products = await productModel.find();
    console.log(`Found ${products.length} products. Adding random sales...`);

    for (const product of products) {
      const randomSales = Math.floor(Math.random() * 15) + 1;
      product.salesCount = randomSales;
      await product.save();

      console.log(`${product.title}: Set to ${randomSales} sales`);
    }

    console.log("Product updates and sales simulation completed!");
  } catch (error) {
    console.error("Error updating products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

updateProducts();
