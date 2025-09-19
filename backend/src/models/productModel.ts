import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  salesCount: number;
}

const productSchema: Schema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  salesCount: { type: Number, required: true, default: 0, min: 0 },
});

// Pre-save middleware to ensure stock doesn't go below 0
productSchema.pre('save', function(next) {
  if ((this as any).stock < 0) {
    (this as any).stock = 0;
  }
  next();
});

const productModel = mongoose.model<IProduct>("Product", productSchema);
export default productModel;
