import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  error: string;
  addToCart: (productId: string) => void;
  updateItemINCart: (productId: string, quantity: number) => void;
  deleteItemFromCart?: (productId: string) => void;
  clearCart?: () => Promise<void>;
}
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalPrice: 0,
  error: "",
  addToCart: () => {},
  updateItemINCart: () => {},
  deleteItemFromCart: () => {},
  clearCart: async () => {},
});

export const useCart = () => {
  return useContext(CartContext);
};
