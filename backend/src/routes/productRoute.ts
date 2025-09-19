import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  getAdminStats,
} from "../../services/productService.js";
import validateJWT from "../../middlewares/ValidatwJWT.js";
import isAdmin from "../../middlewares/isAdmin.js";
import type { ExtendRequest } from "../../types/extendedRequest.js";

const router = express.Router();

// GET /products - Get all products (public route)
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /:id - Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /admin/product - Add product (admin only)
router.post(
  "/admin/product",
  validateJWT,
  isAdmin,
  async (req: ExtendRequest, res) => {
    try {
      const { name, description, price, image, stock } = req.body;

      // Validation
      if (!name || !description || !price || !image || stock === undefined) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (price <= 0 || stock < 0) {
        return res
          .status(400)
          .json({
            error: "Price must be positive and stock cannot be negative",
          });
      }

      const productData = {
        title: name, // Using 'title' to match existing schema
        description,
        price: Number(price),
        image,
        stock: Number(stock),
      };

      const product = await createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Failed to add product" });
    }
  }
);

// GET /admin/stats - Get admin dashboard statistics (admin only)
router.get(
  "/admin/stats",
  validateJWT,
  isAdmin,
  async (req: ExtendRequest, res) => {
    try {
      const stats = await getAdminStats();
      res.status(200).json(stats);
    } catch (err) {
      console.error("Error getting admin stats:", err);
      res.status(500).json({ error: "Failed to fetch admin statistics" });
    }
  }
);

export default router;
