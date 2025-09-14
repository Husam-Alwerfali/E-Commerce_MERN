import { Box, Container, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useCart } from "../context/Cart/CartContext";
import { BASE_URL } from "../api/baseUrl";

const CartPage = () => {
  const { token } = useAuth();
  const { cartItems, totalPrice } = useCart();
  const [error, setError] = useState(false);

  // useEffect(() => {
  //   if (!token) return;

  //   const fetchCart = async () => {

  //       const response = await fetch(`${BASE_URL}/cart`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setCart(data);

  //   };

  //   fetchCart();
  // }, [token]);

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Typography variant="h4">Cart Page</Typography>
      {cartItems.map((item) => (
        <Box>{item.title}</Box>
      ))}
    </Container>
  );
};

export default CartPage;
