import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  Grid,
  Fade,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  AdminPanelSettings,
  Inventory,
  TrendingUp,
  BarChart,
} from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../api/baseUrl";

interface AdminStats {
  totalProducts: number;
  totalSales: number;
  salesByProduct: Array<{
    name: string;
    sales: number;
  }>;
}

// Zod validation schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid positive number",
    }),
  image: z
    .string()
    .min(1, "Image URL is required")
    .url("Please enter a valid URL"),
  stock: z
    .string()
    .min(1, "Stock quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stock must be a valid non-negative number",
    }),
});

type ProductFormData = z.infer<typeof productSchema>;

// API functions
const fetchAdminStats = async (token: string): Promise<AdminStats> => {
  const response = await fetch(`${BASE_URL}/product/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
};

const addProduct = async (data: ProductFormData, token: string) => {
  const response = await fetch(`${BASE_URL}/product/admin/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      image: data.image.trim(),
      stock: Number(data.stock),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add product");
  }

  return response.json();
};

const AdminDashboard = () => {
  const [success, setSuccess] = useState("");
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      stock: "",
    },
  });

  // React Query - Fetch admin stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => fetchAdminStats(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // React Query - Add product mutation
  const addProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => addProduct(data, token!),
    onSuccess: (newProduct) => {
      setSuccess(`Product "${newProduct.title}" added successfully!`);
      reset(); // Reset form
      // Invalidate and refetch stats
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    },
    onError: (error: Error) => {
      console.error("Error adding product:", error.message);
    },
  });

  // Form submit handler
  const onSubmit = (data: ProductFormData) => {
    setSuccess(""); // Clear previous success message
    addProductMutation.mutate(data);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: 4 }}>
      <Container maxWidth="lg">
        {/* Statistics Section */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Admin Dashboard
            </Typography>

            {statsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={60} sx={{ color: "#667eea" }} />
              </Box>
            ) : statsError ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {statsError.message || "Failed to load statistics"}
              </Alert>
            ) : stats ? (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Total Products Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      borderRadius: 3,
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <Inventory sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Total Products
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Total Sales Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                      color: "white",
                      borderRadius: 3,
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <TrendingUp sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stats.totalSales}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Total Sales
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Product Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
                      color: "white",
                      borderRadius: 3,
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 3 }}>
                      <BarChart sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stats.salesByProduct.length > 0
                          ? stats.salesByProduct[0].sales
                          : 0}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Best Product Sales
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : null}

            {/* Sales by Product Table */}
            {stats && stats.salesByProduct.length > 0 && (
              <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Sales by Product
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Product Name
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Sales Count
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.salesByProduct.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell align="right">{product.sales}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ my: 4 }} />
          </Box>
        </Fade>

        {/* Add Product Form */}
        <Fade in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              overflow: "hidden",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Header Section */}
            <Paper
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                p: 4,
                textAlign: "center",
                borderRadius: 0,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Add New Product
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                }}
              >
                Add products to your store inventory
              </Typography>
            </Paper>

            <CardContent sx={{ p: 4 }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 2 }}
              >
                <Grid container spacing={3}>
                  {/* Product Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Product Name"
                          variant="outlined"
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "rgba(102, 126, 234, 0.3)",
                              },
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Stock */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="stock"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Stock Quantity"
                          type="number"
                          variant="outlined"
                          fullWidth
                          error={!!errors.stock}
                          helperText={errors.stock?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "rgba(102, 126, 234, 0.3)",
                              },
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Product Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "rgba(102, 126, 234, 0.3)",
                              },
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Price */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Price (LYD)"
                          type="number"
                          variant="outlined"
                          fullWidth
                          inputProps={{ step: "0.01", min: "0" }}
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "rgba(102, 126, 234, 0.3)",
                              },
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Image URL */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Image URL"
                          type="url"
                          variant="outlined"
                          fullWidth
                          error={!!errors.image}
                          helperText={errors.image?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "rgba(102, 126, 234, 0.3)",
                              },
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Success Alert */}
                {success && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="success"
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                      }}
                    >
                      {success}
                    </Alert>
                  </Fade>
                )}

                {/* Error Alert for Add Product */}
                {addProductMutation.error && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="error"
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                      }}
                    >
                      {addProductMutation.error.message}
                    </Alert>
                  </Fade>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={addProductMutation.isPending}
                  startIcon={
                    addProductMutation.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AddIcon />
                    )
                  }
                  sx={{
                    mt: 4,
                    py: 1.8,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    borderRadius: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(102,126,234,0.6)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {addProductMutation.isPending
                    ? "Adding Product..."
                    : "Add Product"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
