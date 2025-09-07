import {
  cartModel,
  type ICart,
  type ICartItem,
} from "../src/models/CartModel.js";
import productModel from "../src/models/productModel.js";

interface createCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: createCartForUser) => {
  const cart = await cartModel.create({ userId, totalPrice: 0 });
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
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

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

interface updateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: updateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Product not in the cart", StatusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", StatusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "low stock for item", StatusCode: 400 };
  }

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = calculateCartTotal({ cartItems: otherCartItem });
  existsInCart.quantity = quantity;

  total += existsInCart.unitPrice * existsInCart.quantity;
  cart.totalPrice = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, StatusCode: 200 };
};

interface deleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemInCart = async ({
  productId,
  userId,
}: deleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Product not in the cart", StatusCode: 400 };
  }

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = calculateCartTotal({ cartItems: otherCartItem });

  cart.items = otherCartItem;
  cart.totalPrice = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, StatusCode: 200 };
};

const calculateCartTotal = ({ cartItems }: { cartItems: ICartItem[] }) => {
  let total = cartItems.reduce((sum, product) => {
    sum += product.unitPrice * product.quantity;
    return sum;
  }, 0);

  return total;
};

interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalPrice = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, StatusCode: 200 };
};
