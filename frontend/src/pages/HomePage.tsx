import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  Divider,
} from "@mui/material";
import { ShoppingBag, TrendingUp, Star } from "@mui/icons-material";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { BASE_URL } from "../api/baseUrl";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/product`);
        const data = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <ShoppingBag sx={{ fontSize: 60, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          Something went wrong, Please try again!
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading amazing products...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* Hero Section */}
      <Paper
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mb: 4,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <ShoppingBag sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Welcome to Our Store
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.9,
                  fontWeight: 300,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                Discover amazing products at unbeatable prices
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Paper>

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Star sx={{ fontSize: 32, color: "#ff6b6b", mr: 1 }} />
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "#2c3e50",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Featured Products
            </Typography>
            <Star sx={{ fontSize: 32, color: "#ff6b6b", ml: 1 }} />
          </Box>

          <Divider
            sx={{
              width: 100,
              height: 4,
              bgcolor: "#ff6b6b",
              mx: "auto",
              mb: 2,
              borderRadius: 2,
            }}
          />

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
          >
            Carefully curated collection of premium products just for you
          </Typography>
        </Box>

        <Fade in timeout={1500}>
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Fade in timeout={1500 + index * 200}>
                  <Box>
                    <ProductCard {...product} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Fade>

        {products.length === 0 && !loading && !error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <TrendingUp sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products available yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for amazing deals!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
