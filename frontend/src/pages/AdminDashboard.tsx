import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Package,
  TrendingUp,
  BarChart3,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await fetch(`${BASE_URL}/product/admin/stats`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
};

const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/product`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

const addProduct = async (data: ProductFormData) => {
  const response = await fetch(`${BASE_URL}/product/admin/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

const updateProduct = async (id: string, data: ProductFormData) => {
  const response = await fetch(`${BASE_URL}/product/admin/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

const deleteProduct = async (id: string) => {
  const response = await fetch(`${BASE_URL}/product/admin/product/${id}`, {
    method: "DELETE",
    credentials: "include",
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
  const [dialogOpen, setDialogOpen] = useState(false);
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
    queryFn: () => fetchAdminStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // React Query - Fetch all products
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => fetchAllProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // React Query - Add product mutation
  const addProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => addProduct(data),
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
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      updateProduct(id, data),
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
    mutationFn: (id: string) => deleteProduct(id),
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
    const formElement = document.getElementById("product-form");
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
        </div>

        {/* Statistics Section */}
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          </div>
        ) : statsError ? (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              {statsError.message || "Failed to load statistics"}
            </AlertDescription>
          </Alert>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Products Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-4xl font-bold mb-2">
                  {stats.totalProducts}
                </div>
                <div className="text-lg opacity-90">Total Products</div>
              </CardContent>
            </Card>

            {/* Total Sales Card */}
            <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-4xl font-bold mb-2">
                  {stats.totalSales}
                </div>
                <div className="text-lg opacity-90">Total Sales</div>
              </CardContent>
            </Card>

            {/* Top Product Card */}
            <Card className="bg-gradient-to-br from-teal-500 to-green-500 text-white border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-4xl font-bold mb-2">
                  {stats.salesByProduct.length > 0
                    ? stats.salesByProduct[0].sales
                    : 0}
                </div>
                <div className="text-lg opacity-90">Best Product Sales</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Sales by Product Table */}
        {stats && stats.salesByProduct.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Sales by Product</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Sales Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.salesByProduct.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.sales}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Products Management Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Manage Products</h2>
              <Button
                variant="default"
                onClick={() => {
                  setEditingProduct(null);
                  reset({
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    stock: "",
                  });
                  setDialogOpen(true);
                }}
                className="flex gap-2"
              >
                <Plus className="w-5 h-5" /> Add Product
              </Button>
            </div>
            {productsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            ) : productsError ? (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {productsError.message || "Failed to load products"}
                </AlertDescription>
              </Alert>
            ) : products && products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price (LYD)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Avatar className="w-15 h-15">
                          <AvatarImage
                            src={product.image}
                            alt={product.title}
                          />
                          <AvatarFallback>
                            {product.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-500 max-w-[200px] truncate">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.price.toFixed(2)} LYD
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock > 10
                              ? "secondary"
                              : product.stock > 0
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {product.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell>{product.salesCount || 0} sales</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleEditProduct(product);
                              setDialogOpen(true);
                            }}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertDescription>
                  No products found. Add your first product above!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? `Update "${editingProduct.title}" details`
                  : "Add products to your store inventory"}
              </DialogDescription>
            </DialogHeader>
            <form
              id="product-form"
              onSubmit={handleSubmit(
                editingProduct
                  ? (data) => {
                      handleUpdateProduct(data);
                      setDialogOpen(false);
                    }
                  : (data) => {
                      onSubmit(data);
                      setDialogOpen(false);
                    }
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Enter product name"
                          className={errors.name ? "border-red-300" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="stock"
                          type="number"
                          placeholder="Enter stock quantity"
                          className={errors.stock ? "border-red-300" : ""}
                        />
                        {errors.stock && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.stock.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <textarea
                        {...field}
                        id="description"
                        rows={3}
                        placeholder="Enter product description"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          errors.description
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (LYD)</Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter price"
                          className={errors.price ? "border-red-300" : ""}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.price.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="image"
                          type="url"
                          placeholder="Enter image URL"
                          className={errors.image ? "border-red-300" : ""}
                        />
                        {errors.image && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              {/* Success Alert */}
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              {/* Error Alert */}
              {(addProductMutation.error ||
                updateProductMutation.error ||
                deleteProductMutation.error) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {addProductMutation.error?.message ||
                      updateProductMutation.error?.message ||
                      deleteProductMutation.error?.message}
                  </AlertDescription>
                </Alert>
              )}
              {/* Submit Buttons */}
              <div className="flex gap-4">
                {editingProduct && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      cancelEdit();
                      setDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={
                    addProductMutation.isPending ||
                    updateProductMutation.isPending
                  }
                  className={`${
                    editingProduct ? "flex-1" : "w-full"
                  } py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/30`}
                >
                  {addProductMutation.isPending ||
                  updateProductMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {addProductMutation.isPending
                        ? "Adding..."
                        : "Updating..."}
                    </>
                  ) : (
                    <>
                      {editingProduct ? (
                        <Edit className="w-5 h-5 mr-2" />
                      ) : (
                        <Plus className="w-5 h-5 mr-2" />
                      )}
                      {editingProduct ? "Update Product" : "Add Product"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteProduct}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
