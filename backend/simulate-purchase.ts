import { checkoutCart } from "./services/CartService.js";
import productModel from "./src/models/productModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function simulatePurchase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL || "");
    console.log("Connected to MongoDB");

    // Get a product to test with
    const product = await productModel.findOne({ stock: { $gt: 0 } });

    if (!product) {
      console.log("No products with stock available for testing");
      process.exit(1);
    }

    console.log("\n=== BEFORE PURCHASE ===");
    console.log(`Product: ${product.title}`);
    console.log(`Stock: ${product.stock} units`);
    console.log(`Sales: ${product.salesCount} sold`);

    // Simulate adding items to cart and checking out
    // This would normally be done through the API endpoints
    console.log("\n=== SIMULATING PURCHASE OF 2 UNITS ===");

    // Manually decrease stock (simulating checkout process)
    const quantityToBuy = Math.min(2, product.stock);
    product.stock -= quantityToBuy;
    product.salesCount += quantityToBuy;
    await product.save();

    console.log("\n=== AFTER PURCHASE ===");
    console.log(`Product: ${product.title}`);
    console.log(
      `Stock: ${product.stock} units (decreased by ${quantityToBuy})`
    );
    console.log(
      `Sales: ${product.salesCount} sold (increased by ${quantityToBuy})`
    );
    console.log(
      `Status: ${product.stock > 0 ? "✅ Still in Stock" : "❌ Out of Stock"}`
    );

    // Show all products status
    console.log("\n=== ALL PRODUCTS CURRENT STATUS ===");
    const allProducts = await productModel.find({});
    allProducts.forEach((p) => {
      console.log(
        `${p.title}: ${p.stock} units (${p.salesCount} sold) ${
          p.stock === 0 ? "❌ OUT OF STOCK" : "✅"
        }`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

simulatePurchase();
