import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../api/baseUrl";

const CartPage = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCart(data);
      } catch {
        setError(true);
      }
    };

    fetchCart();
  }, [token]);
  if (error) {
    return <Box>Something went wrong , Please try again!</Box>;
  }
  
  console.log(cart);

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Typography variant="h4">Cart Page</Typography>
    </Container>
  );
};

export default CartPage;
