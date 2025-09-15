import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useCart } from "../context/Cart/CartContext";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../api/baseUrl";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    PhoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckout = async () => {
    if (!token) {
      setError("Please login to complete checkout");
      return;
    }

    if (
      !address.street ||
      !address.city ||
      !address.PhoneNumber
    ) {
      setError("Please fill in all address fields");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format address as a string for the backend
      const addressString = `${address.street}, ${address.city}, ${address.PhoneNumber}`;
      
      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: addressString }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Checkout failed: ${errorText}`);
      }

      navigate("/order-success");
      setSuccess("Order placed successfully!");

      // Clear cart and redirect after successful checkout
      if (clearCart) {
        clearCart();
      }

    //   setTimeout(() => {
    //     navigate("/");
    //   }, 4000);
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Your cart is empty.{" "}
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Order Summary */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>

          {cartItems.map((item) => (
            <Box key={item.productId} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 80,height: 70,  objectFit: "cover" }}
                />
                <Box flex={1}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} × {item.price} LYD
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  {(item.quantity * item.price).toFixed(2)} LYD
                </Typography>
              </Box>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Total: {totalPrice.toFixed(2)} LYD
            </Typography>
          </Box>
        </Paper>

        {/* Shipping Address */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Address
          </Typography>

          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Street Address"
              value={address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              margin="normal"
              required
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                label="City"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={address.PhoneNumber}
                onChange={(e) => handleAddressChange("PhoneNumber", e.target.value)}
                required
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCheckout}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading
              ? "Processing..."
              : `Place Order - ${totalPrice.toFixed(2)} LYD`}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
