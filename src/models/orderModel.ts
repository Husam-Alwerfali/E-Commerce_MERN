import mongoose, { Document, Schema, type ObjectId } from "mongoose";

export interface IOrderItem  {
    productTitle: string;
    image: string;
    unitPrice: number;
    quantity: number;
}

export interface IOrder extends Document {
    orderItems: IOrderItem[];
    totalPrice: number;
    address: string;
    userId: ObjectId | string;
}

const orderItemSchema: Schema = new Schema<IOrderItem>({
    productTitle: { type: String, required: true },
    image: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const orderSchema: Schema = new Schema<IOrder>({
    orderItems: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const orderModel = mongoose.model<IOrder>("Order", orderSchema);