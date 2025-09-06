import express from "express";
import {
  addItemToCart,
  getActiveCartForUser,
} from "../../services/cartService.js";
import validateJWT from "../../middlewares/ValidatwJWT.js";
import type { ExtendRequest } from "../../types/extendedRequest.js";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  //TO do get the user id from the token
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.StatusCode).send(response.data);
});

export default router;
