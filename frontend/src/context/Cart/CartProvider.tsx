import { useState, type FC, type PropsWithChildren } from "react";
import type { CartItem } from "../../types/CartItem";
import { CartContext } from "./CartContext";


const CartProvider: FC<PropsWithChildren> = ({ children }) => {

const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [totalPrice, setTotalPrice] = useState<number>(0);

const addToCart = (productId: string) => {
    console.log("add to cart", productId);

}
  return (
    <CartContext.Provider  value={{ cartItems, totalPrice, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
