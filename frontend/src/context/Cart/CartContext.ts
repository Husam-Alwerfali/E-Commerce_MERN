import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
    cartItems: CartItem[];
    totalPrice: number;
    addToCart: (productId: string) => void;

}
export const CartContext = createContext<CartContextType>({
    cartItems: [],
    totalPrice: 0,
    addToCart: () => { },
});

export const useCart = () => {
  return useContext(CartContext);
};
