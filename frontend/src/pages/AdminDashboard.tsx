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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  AdminPanelSettings,
  Inventory,
  TrendingUp,
  BarChart,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../api/baseUrl";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  salesCount?: number;
}

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

const fetchAllProducts = async (token: string): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/product`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
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

const updateProduct = async (id: string, data: ProductFormData, token: string) => {
  const response = await fetch(`${BASE_URL}/product/admin/product/${id}`, {
    method: "PUT",
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
    throw new Error(errorData.error || "Failed to update product");
  }

  return response.json();
};

const deleteProduct = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/product/admin/product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete product");
  }

  return response.json();
};

const AdminDashboard = () => {
  const [success, setSuccess] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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

  // React Query - Fetch all products
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => fetchAllProducts(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // React Query - Add product mutation
  const addProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => addProduct(data, token!),
    onSuccess: (newProduct) => {
      setSuccess(`Product "${newProduct.title}" added successfully!`);
      reset(); // Reset form
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    },
    onError: (error: Error) => {
      console.error("Error adding product:", error.message);
    },
  });

  // React Query - Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) => updateProduct(id, data, token!),
    onSuccess: (updatedProduct) => {
      setSuccess(`Product "${updatedProduct.title}" updated successfully!`);
      setEditingProduct(null);
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    },
    onError: (error: Error) => {
      console.error("Error updating product:", error.message);
    },
  });

  // React Query - Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id, token!),
    onSuccess: (result) => {
      setSuccess(`Product "${result.product.title}" deleted successfully!`);
      setDeleteConfirmId(null);
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    },
    onError: (error: Error) => {
      console.error("Error deleting product:", error.message);
    },
  });

  // Form submit handler
  const onSubmit = (data: ProductFormData) => {
    setSuccess(""); // Clear previous success message
    addProductMutation.mutate(data);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    console.log("Edit button clicked for product:", product);
    setEditingProduct(product);
    // Populate form with existing product data
    reset({
      name: product.title,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      stock: product.stock.toString(),
    });
    
    // Scroll to form
    const formElement = document.getElementById('product-form');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
    console.log("Edit mode activated, form should show now");
  };

  // Handle update product
  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      setSuccess(""); // Clear previous success message
      updateProductMutation.mutate({
        id: editingProduct._id,
        data,
      });
    }
  };

  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    setDeleteConfirmId(id);
  };

  // Confirm delete product
  const confirmDeleteProduct = () => {
    if (deleteConfirmId) {
      deleteProductMutation.mutate(deleteConfirmId);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingProduct(null);
    reset({
      name: "",
      description: "",
      price: "",
      image: "",
      stock: "",
    });
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

            {/* Products Management Section */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Manage Products
                </Typography>
                
                {productsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : productsError ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {productsError.message || "Failed to load products"}
                  </Alert>
                ) : products && products.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Price (LYD)</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Sales</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <Avatar
                                src={product.image}
                                alt={product.title}
                                variant="rounded"
                                sx={{ width: 60, height: 60 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {product.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  maxWidth: 200, 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {product.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {product.price.toFixed(2)} LYD
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`${product.stock} units`}
                                color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {product.salesCount || 0} sales
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleEditProduct(product)}
                                  sx={{ 
                                    '&:hover': { 
                                      backgroundColor: 'rgba(25, 118, 210, 0.1)' 
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteProduct(product._id)}
                                  sx={{ 
                                    '&:hover': { 
                                      backgroundColor: 'rgba(244, 67, 54, 0.1)' 
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No products found. Add your first product below!
                  </Alert>
                )}
              </CardContent>
            </Card>

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
                background: editingProduct 
                  ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"  // Orange gradient for edit mode
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Blue gradient for add mode
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
                {editingProduct ? "Edit Product" : "Add New Product"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                }}
              >
                {editingProduct 
                  ? `Update "${editingProduct.title}" details`
                  : "Add products to your store inventory"
                }
              </Typography>
            </Paper>

            <CardContent sx={{ p: 4 }}>
              <Box
                id="product-form"
                component="form"
                onSubmit={handleSubmit(editingProduct ? handleUpdateProduct : onSubmit)}
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

                {/* Error Alert for operations */}
                {(addProductMutation.error || updateProductMutation.error || deleteProductMutation.error) && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="error"
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                      }}
                    >
                      {addProductMutation.error?.message || 
                       updateProductMutation.error?.message || 
                       deleteProductMutation.error?.message}
                    </Alert>
                  </Fade>
                )}

                {/* Submit Buttons */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  {editingProduct && (
                    <Button
                      type="button"
                      variant="outlined"
                      size="large"
                      onClick={cancelEdit}
                      startIcon={<CloseIcon />}
                      sx={{
                        py: 1.8,
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        borderRadius: 3,
                        borderColor: "#667eea",
                        color: "#667eea",
                        "&:hover": {
                          borderColor: "#5a6fd8",
                          backgroundColor: "rgba(102,126,234,0.1)",
                        },
                        transition: "all 0.3s ease-in-out",
                        flex: 1,
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={addProductMutation.isPending || updateProductMutation.isPending}
                    startIcon={
                      (addProductMutation.isPending || updateProductMutation.isPending) ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : editingProduct ? (
                        <EditIcon />
                      ) : (
                        <AddIcon />
                      )
                    }
                    sx={{
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
                      flex: editingProduct ? 1 : 'auto',
                      width: editingProduct ? 'auto' : '100%',
                    }}
                  >
                    {addProductMutation.isPending
                      ? "Adding Product..."
                      : updateProductMutation.isPending
                      ? "Updating Product..."
                      : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete Product
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDeleteConfirmId(null)}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeleteProduct}
              color="error"
              variant="contained"
              disabled={deleteProductMutation.isPending}
              startIcon={
                deleteProductMutation.isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
            >
              {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
