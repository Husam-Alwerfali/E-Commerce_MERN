import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { CheckCircle, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handelHome = () => {
    navigate("/");
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: "success.main",
              mb: 2,
            }}
          />
        </Box>

        {/* Success Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "success.main",
            mb: 2,
          }}
        >
          Order Placed Successfully!
        </Typography>

        {/* Success Message */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}
        >
          Thank you for your purchase! Your order has been confirmed and is
          being processed.
        </Typography>

        {/* Order Details Box */}
        <Alert
          severity="success"
          sx={{
            mb: 4,
            fontSize: "1.1rem",
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>What happens next?</strong>
          </Typography>
          <Typography variant="body2" component="div">
            • You will receive an order confirmation email shortly
            <br />
            • We'll prepare your items for shipment
            <br />
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ShoppingBag />}
            onClick={handelHome}
            size="large"
            sx={{ minWidth: 160 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>

      {/* Additional Information */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If you have any questions about your order, please contact our
          customer support.
        </Typography>
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;
