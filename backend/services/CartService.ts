import {
  cartModel,
  type ICart,
  type ICartItem,
} from "../src/models/CartModel.js";
import { orderModel, type IOrderItem } from "../src/models/orderModel.js";
import productModel from "../src/models/productModel.js";

interface CreateCartForUser {
  userId: string;
}

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

interface AddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

interface DeleteItemInCart {
  productId: any;
  userId: string;
}

interface ClearCart {
  userId: string;
}

interface CheckoutCart {
  userId: string;
  address: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalPrice: 0 });
  await cart.save();
  return cart;
};

const calculateCartTotal = ({ cartItems }: { cartItems: ICartItem[] }) => {
  return cartItems.reduce((sum, product) => {
    return sum + product.unitPrice * product.quantity;
  }, 0);
};

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Does the product already exist in the cart?
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
    return { data: "Low stock for item", StatusCode: 400 };
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  // Update the total price
  cart.totalPrice += product.price * quantity;

  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    StatusCode: 200,
  };
};

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
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
    return { data: "Low stock for item", StatusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = calculateCartTotal({ cartItems: otherCartItems });
  existsInCart.quantity = quantity;

  total += existsInCart.unitPrice * existsInCart.quantity;
  cart.totalPrice = total;

  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    StatusCode: 200,
  };
};

export const deleteItemInCart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Product not in the cart", StatusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = calculateCartTotal({ cartItems: otherCartItems });

  cart.items = otherCartItems;
  cart.totalPrice = total;

  await cart.save();
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    StatusCode: 200,
  };
};

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
  return { data: cart, StatusCode: 200 };
};

export const checkoutCart = async ({ userId, address }: CheckoutCart) => {
  if (!address) {
    return { data: "Address is required", StatusCode: 400 };
  }

  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];

  // Loop through cart items and create order items
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: "Product not found", StatusCode: 400 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      image: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };

    orderItems.push(orderItem);

    // Update salesCount for the product
    product.salesCount += item.quantity;
    await product.save();
  }

  const order = await orderModel.create({
    orderItems,
    totalPrice: cart.totalPrice,
    address,
    userId,
  });

  await order.save();

  // Update cart status to be completed
  cart.status = "completed";
  await cart.save();

  return { data: order, StatusCode: 200 };
};
