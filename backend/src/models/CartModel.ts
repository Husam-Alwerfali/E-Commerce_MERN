import mongoose, { Document, Schema, type ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";

export interface ICartItem {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: ObjectId | string;
  items: ICartItem[];
  totalPrice: number;
  status: "active" | "completed";
}

const cartItemSchema: Schema = new Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema: Schema = new Schema<ICart>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export const cartModel = mongoose.model<ICart>("Cart", cartSchema);
