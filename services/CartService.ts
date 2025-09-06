import { cartModel } from "../src/models/CartModel.js";
import productModel from "../src/models/productModel.js";

interface createCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: createCartForUser) => {
  const cart = await cartModel.create({ userId, totalPrice:0 });
  await cart.save();
  return cart;
};

interface getActiveCartForUser {
  userId: string;
}
export const getActiveCartForUser = async ({
  userId,
}: getActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

interface addItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: addItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Dose the product already exist in the cart ??
  const existsInCart = cart.items.find((p) => p.product.toString() === productId);

  if (existsInCart) {
    return { data: "Product already in the cart", StatusCode: 400 };
  }
  // Fetch the product

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "Product not found", StatusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "low stock for item", StatusCode: 400 };
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  //Update the total price
  cart.totalPrice += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, StatusCode: 200 };
};
