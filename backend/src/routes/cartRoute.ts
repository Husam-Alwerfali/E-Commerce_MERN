import express from "express";
import {
  addItemToCart,
  checkoutCart,
  clearCart,
  deleteItemInCart,
  getActiveCartForUser,
  updateItemInCart,
} from "../../services/CartService.js";
import validateJWT from "../../middlewares/ValidatwJWT.js";
import type { ExtendRequest } from "../../types/extendedRequest.js";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId, populateProduct: true });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.StatusCode).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.StatusCode).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete(
  "/items/:productId",
  validateJWT,
  async (req: ExtendRequest, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const response = await deleteItemInCart({ userId, productId });
      res.status(response.StatusCode).json(response.data);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const response = await clearCart({ userId });
    res.status(response.StatusCode).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const response = await checkoutCart({ userId, address });
    res.status(response.StatusCode).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
