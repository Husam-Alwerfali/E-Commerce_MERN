import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../../types/CartItem";
import { CartContext } from "./CartContext";
import { BASE_URL } from "../../api/baseUrl";
import { useAuth } from "../Auth/AuthContext";
import { toast } from "sonner";

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
        const errorData = await response.json();
        toast.error(errorData.data || "Failed to add item to cart");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again!");
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
        const errorData = await response.json();
        toast.error(errorData.data || "Failed to update item in cart");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
      toast.success("Cart updated successfully!");
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update item in cart. Please try again!");
    }
  };

  const deleteItemFromCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.data || "Failed to delete item from cart");
        return;
      }

      const cart = await response.json();
      const cartItemsMapped = mapCartItems(cart);
      setCartItems(cartItemsMapped);
      setTotalPrice(cart.totalPrice);
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Failed to delete from cart:", error);
      toast.error("Failed to delete item from cart. Please try again!");
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to empty cart. Please try again!");
        return;
      }

      setCartItems([]);
      setTotalPrice(0);
      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error("Failed to empty cart:", error);
      toast.error("Failed to empty cart. Please try again!");
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
