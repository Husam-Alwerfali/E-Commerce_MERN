/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../../types/CartItem";
import { CartContext } from "./CartContext";
import { BASE_URL } from "../../api/baseUrl";
import { useAuth } from "../Auth/AuthContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cart = await response.json();
      const cartItemsMapped = cart.items.map(
        ({ product, quantity }: { product: any; quantity: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity,
          stock: product.stock,
        })
      );
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
    };

    fetchCart();
  }, [token]);

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) {
        setError("Failed to add item to cart, Please try again!");
      }
      const cart = await response.json();
      if (!cart) {
        setError("Failed to parse  cart data, Please try again!");
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity }: { product: any; quantity: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity,
          stock: product.stock,
        })
      );
      setCartItems([...cartItemsMapped]);
      setTotalPrice(cart.totalPrice);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const updateItemINCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        setError("Failed to update item in cart, Please try again!");
      }
      const cart = await response.json();
      if (!cart) {
        setError("Failed to parse  cart data, Please try again!");
      }

      const cartItemsMapped = cart.items.map(
        ({ product, quantity }: { product: any; quantity: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity,
          stock: product.stock,
        })
      );
      setCartItems([...cartItemsMapped]);
      setTotalPrice(cart.totalPrice);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };
  return (
    <CartContext.Provider
      value={{ cartItems, totalPrice, addToCart, updateItemINCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
