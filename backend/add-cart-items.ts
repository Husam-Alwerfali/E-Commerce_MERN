import { addItemToCart } from "./services/CartService.js";
import productModel from "./src/models/productModel.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function addCartItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL || "");
    console.log("Connected to MongoDB");

    // Get some products to add to cart
    const products = await productModel.find({ stock: { $gt: 0 } }).limit(3);
    
    console.log("\n=== Available Products for Cart ===");
    products.forEach(product => {
      console.log(`${product.title}: ${product.stock} in stock, $${product.price}`);
    });

    // Use a test user ID
    const testUserId = "test-user-123";

    console.log(`\n=== Adding Items to Cart for Testing ===`);
    
    for (let i = 0; i < Math.min(2, products.length); i++) {
      const product = products[i];
      const quantityToAdd = Math.min(2, product.stock); // Add 2 or max available
      
      console.log(`\nAdding ${quantityToAdd} x ${product.title} to cart...`);
      
      const result = await addItemToCart({
        productId: (product._id as any).toString(),
        quantity: quantityToAdd,
        userId: testUserId
      });
      
      if (result.StatusCode === 200) {
        console.log(`✅ Successfully added to cart`);
      } else {
        console.log(`❌ Failed: ${result.data}`);
      }
    }

    console.log(`\n=== Cart test items added ===`);
    console.log(`You can now test the cart page at http://localhost:5174/cart`);
    console.log(`Note: You'll need to be logged in to see the cart items`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addCartItems();
