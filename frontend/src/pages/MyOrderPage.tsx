import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import {
  ShoppingBag,
  LocalShipping,
  LocationOn,
  Inventory,
  CalendarToday,
  Storefront,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  productTitle: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

interface Order {
  _id: string;
  address: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt?: string;
}

const MyOrderPage = () => {
  const navigate = useNavigate();
  const { getMyOrders, myOrders } = useAuth();

  const handelHome = () => {
    navigate("/");
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (getMyOrders) {
          await getMyOrders();
        }
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 8, display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <CircularProgress size={70} thickness={4} />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Loading your orders...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            "& .MuiAlert-icon": { fontSize: 28 },
          }}
        >
          <Typography variant="h6">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        {/* Modern Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mb: 3,
              boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Receipt sx={{ fontSize: 60, color: "white" }} />
          </Box>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 2,
            }}
          >
            My Orders
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ fontWeight: 400, opacity: 0.8 }}
          >
            Track and manage your purchase history
          </Typography>
          {myOrders && myOrders.length > 0 && (
            <Chip
              label={`${myOrders.length} Total Orders`}
              sx={{
                mt: 2,
                px: 2,
                py: 1,
                fontSize: "1rem",
                fontWeight: 600,
                background: "rgba(102, 126, 234, 0.1)",
                color: "#667eea",
                border: "2px solid rgba(102, 126, 234, 0.2)",
              }}
            />
          )}
        </Box>

        {/* Orders Content */}
        {!myOrders || myOrders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              background: "white",
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                mb: 4,
              }}
            >
              <Storefront sx={{ fontSize: 80, color: "#ff6b6b" }} />
            </Box>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, color: "#2c3e50" }}
            >
              No Orders Yet
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
            >
              Your order history is empty. Start exploring our products and
              place your first order!
            </Typography>
            <Button onClick={(handelHome)}
              variant="contained"
              size="large"
              startIcon={<ShoppingBag />}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {myOrders.map((order: Order) => (
              <Card
                key={order._id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "white",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Premium Order Header */}
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    p: 4,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 3,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Order #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <CalendarToday sx={{ fontSize: 20 }} />
                        <Typography
                          variant="h6"
                          sx={{ opacity: 0.95, fontWeight: 500 }}
                        >
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Recent Order"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Chip
                        label="✓ Delivered"
                        icon={<LocalShipping />}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          mb: 2,
                          px: 2,
                          py: 1,
                          borderRadius: 3,
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {order.totalPrice}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, opacity: 0.9 }}
                        >
                          LYD
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  {/* Enhanced Order Info Grid */}
                  <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)",
                          borderRadius: 3,
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}
                          >
                            <LocationOn sx={{ fontSize: 24 }} />
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#1976d2" }}
                          >
                            Delivery Address
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            lineHeight: 1.6,
                            color: "#424242",
                          }}
                        >
                          {order.address}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)",
                          borderRadius: 3,
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{ bgcolor: "#9c27b0", width: 48, height: 48 }}
                          >
                            <Inventory sx={{ fontSize: 24 }} />
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#9c27b0" }}
                          >
                            Order Summary
                          </Typography>
                        </Box>
                        <Stack spacing={1}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#424242" }}
                          >
                            Items: {order.orderItems.length}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: "#424242" }}
                          >
                            Payment: Completed 💳
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4, borderColor: "rgba(0,0,0,0.08)" }} />

                  {/* Modern Items Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 3, color: "#2c3e50" }}
                    >
                      Order Items ({order.orderItems.length})
                    </Typography>

                    <Stack spacing={2}>
                      {order.orderItems.map(
                        (item: OrderItem, itemIndex: number) => (
                          <Paper
                            key={itemIndex}
                            elevation={1}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              background: "white",
                              border: "1px solid #f0f0f0",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: "#667eea",
                                boxShadow:
                                  "0 8px 24px rgba(102, 126, 234, 0.12)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 3 }}>
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.productTitle}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 2,
                                  flexShrink: 0,
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: "#2c3e50",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {item.productTitle}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                    mb: 2,
                                  }}
                                >
                                  <Chip
                                    label={`Qty: ${item.quantity}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#e3f2fd",
                                      color: "#1976d2",
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#666",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item.unitPrice} LYD each
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",

                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#666",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Subtotal:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#666",
                                    }}
                                  >
                                    {item.unitPrice * item.quantity} LYD
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        )
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default MyOrderPage;
