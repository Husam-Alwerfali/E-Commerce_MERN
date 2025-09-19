import productModel from "./src/models/productModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testStockLimits() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL || "");
    console.log("Connected to MongoDB");

    // Find a product with low stock
    let product = await productModel.findOne({ stock: { $gt: 0, $lt: 10 } });

    if (!product) {
      // Create a test product with low stock
      product = new productModel({
        title: "Test Low Stock Item",
        description: "Testing stock limits",
        image: "https://via.placeholder.com/300",
        price: 99.99,
        stock: 2, // Very low stock
        salesCount: 0,
      });
      await product.save();
      console.log("Created test product with low stock");
    }

    console.log("\n=== TESTING STOCK LIMITS ===");
    console.log(`Product: ${product.title}`);
    console.log(`Current Stock: ${product.stock} units`);
    console.log(`Current Sales: ${product.salesCount} sold`);

    // Test 1: Try to buy exact amount available
    console.log(`\n--- Test 1: Buying exactly ${product.stock} units ---`);
    const requestedQty1 = product.stock;
    if (product.stock >= requestedQty1) {
      product.stock -= requestedQty1;
      product.salesCount += requestedQty1;
      await product.save();
      console.log(
        `✅ Success! Stock now: ${product.stock}, Sales: ${product.salesCount}`
      );
    } else {
      console.log(
        `❌ Failed! Not enough stock. Available: ${product.stock}, Requested: ${requestedQty1}`
      );
    }

    // Test 2: Try to buy more than available (should fail)
    console.log(`\n--- Test 2: Trying to buy 5 more units (should fail) ---`);
    const requestedQty2 = 5;
    if (product.stock >= requestedQty2) {
      console.log(`✅ Sufficient stock available`);
    } else {
      console.log(
        `❌ Insufficient stock! Available: ${product.stock}, Requested: ${requestedQty2}`
      );
      console.log(`This would trigger an error in the cart service`);
    }

    // Show final status
    console.log(`\n=== FINAL STATUS ===`);
    console.log(`Product: ${product.title}`);
    console.log(`Stock: ${product.stock} units`);
    console.log(`Sales: ${product.salesCount} sold`);
    console.log(
      `Status: ${product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testStockLimits();
