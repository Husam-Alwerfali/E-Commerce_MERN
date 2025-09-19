import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CardMedia,
  Grid,
  Chip,
  Divider,
  Alert,
  Fade,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  Inventory,
  Star,
  LocalShipping,
  Security,
  Support,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useCart } from "../context/Cart/CartContext";
import { BASE_URL } from "../api/baseUrl";
import type { Product } from "../types/Product";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products: Product[] = await response.json();
        const foundProduct = products.find((p) => p._id === id);

        if (!foundProduct) {
          setError("Product not found");
        } else {
          setProduct(foundProduct);
        }
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    setSuccess("");
    setError("");

    try {
      await addToCart(product._id);
      setSuccess("Product added to cart successfully!");
    } catch {
      setError("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBackToProducts = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#fafafa",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || "Product not found"}
        </Alert>
        <Button
          variant="contained"
          onClick={handleBackToProducts}
          startIcon={<ArrowBack />}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={handleBackToProducts}
            sx={{
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "#f5f5f5",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              },
              transition: "all 0.3s ease-in-out",
              mb: 2,
            }}
          >
            <ArrowBack sx={{ color: "#667eea" }} />
          </IconButton>
        </Box>

        <Fade in timeout={800}>
          <Paper
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Grid container>
              {/* Product Image */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{ position: "relative", height: { xs: 300, md: 500 } }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Stock Badge */}
                  <Chip
                    label={
                      product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"
                    }
                    color={product.stock > 0 ? "success" : "error"}
                    icon={<Inventory />}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                      bgcolor:
                        product.stock > 0
                          ? "rgba(76, 175, 80, 0.9)"
                          : "rgba(244, 67, 54, 0.9)",
                      color: "white",
                    }}
                  />
                </Box>
              </Grid>

              {/* Product Details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Product Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1.3,
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* Rating (placeholder) */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        sx={{ color: "#ffd700", fontSize: 20 }}
                      />
                    ))}
                    <Typography variant="body2" sx={{ ml: 1, color: "#666" }}>
                      (4.8) 127 reviews
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#667eea",
                      mb: 3,
                      textShadow: "0 2px 4px rgba(102,126,234,0.2)",
                    }}
                  >
                    {product.price} LYD
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666",
                      lineHeight: 1.8,
                      mb: 4,
                      fontSize: "1.1rem",
                    }}
                  >
                    {product.description}
                  </Typography>

                  {/* Success/Error Messages */}
                  {success && (
                    <Fade in timeout={300}>
                      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                        {success}
                      </Alert>
                    </Fade>
                  )}

                  {error && (
                    <Fade in timeout={300}>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {/* Add to Cart Button */}
                  <Box sx={{ mt: "auto" }}>
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addingToCart}
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={
                        addingToCart ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <ShoppingCart />
                        )
                      }
                      sx={{
                        py: 2,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        background:
                          product.stock > 0
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "rgba(0,0,0,0.12)",
                        color: "white",
                        borderRadius: 3,
                        textTransform: "none",
                        mb: 3,
                        "&:hover": {
                          background:
                            product.stock > 0
                              ? "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                              : "rgba(0,0,0,0.12)",
                          transform:
                            product.stock > 0 ? "translateY(-2px)" : "none",
                          boxShadow:
                            product.stock > 0
                              ? "0 8px 25px rgba(102,126,234,0.4)"
                              : "none",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {addingToCart
                        ? "Adding..."
                        : product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </Button>

                    {/* Features */}
                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        textAlign: "center",
                      }}
                    >
                      <Box>
                        <LocalShipping
                          sx={{ fontSize: 32, color: "#667eea", mb: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, display: "block" }}
                        >
                          Free Shipping
                        </Typography>
                      </Box>
                      <Box>
                        <Security
                          sx={{ fontSize: 32, color: "#667eea", mb: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, display: "block" }}
                        >
                          Secure Payment
                        </Typography>
                      </Box>
                      <Box>
                        <Support
                          sx={{ fontSize: 32, color: "#667eea", mb: 1 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, display: "block" }}
                        >
                          24/7 Support
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProductDetailsPage;
