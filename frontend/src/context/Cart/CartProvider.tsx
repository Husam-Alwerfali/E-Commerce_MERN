import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../../types/CartItem";
import { CartContext } from "./CartContext";
import { BASE_URL } from "../../api/baseUrl";
import { useAuth } from "../Auth/AuthContext";

interface CartItemResponse {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
    stock: number;
  };
  quantity: number;
}

interface CartResponse {
  items: CartItemResponse[];
  totalPrice: number;
}

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState("");

  // Helper function to map cart items
  const mapCartItems = (cartData: CartResponse): CartItem[] => {
    return cartData.items.map(({ product, quantity }) => ({
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity,
      stock: product.stock,
    }));
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          credentials: "include",
        });

        if (!response.ok) {
          setError("Failed to fetch cart");
          return;
        }

        const cart = await response.json();
        const cartItemsMapped = mapCartItems(cart);
        setCartItems(cartItemsMapped);
        setTotalPrice(cart.totalPrice);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setError("Failed to fetch cart");
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        setError("Failed to add item to cart. Please try again!");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setError("Failed to add item to cart. Please try again!");
    }
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        setError("Failed to update item in cart. Please try again!");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
    } catch (error) {
      console.error("Failed to update cart:", error);
      setError("Failed to update item in cart. Please try again!");
    }
  };

  const deleteItemFromCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to delete item from cart. Please try again!");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
    } catch (error) {
      console.error("Failed to delete from cart:", error);
      setError("Failed to delete item from cart. Please try again!");
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        setError("Failed to empty cart. Please try again!");
        return;
      }

      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Failed to empty cart:", error);
      setError("Failed to empty cart. Please try again!");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        error,
        addToCart,
        updateItemInCart,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
