import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Star,
  Truck,
  Shield,
  Headphones,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/product/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }

        const product: Product = await response.json();
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product details"
        );
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

    try {
      await addToCart(product._id);
      // Toast notification is handled in CartProvider
    } catch {
      // Error toast notification is handled in CartProvider
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBackToProducts = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container max-w-2xl mx-auto py-16 text-center px-4">
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error || "Product not found"}</AlertDescription>
        </Alert>
        <Button
          onClick={handleBackToProducts}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 px-8 py-4 rounded-xl text-white font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={handleBackToProducts}
            variant="ghost"
            size="lg"
            className="group bg-card hover:bg-accent border border-border hover:border-primary/30 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
              Back to Products
            </span>
          </Button>
        </div>

        <Card className="rounded-3xl overflow-hidden shadow-2xl bg-white/95 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 md:h-[500px] object-cover"
              />
            </div>

            {/* Product Details */}
            <CardContent className="p-8 flex flex-col h-full">
              {/* Product Title */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  (4.8) 127 reviews
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {product.price} LYD
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 flex-1">
                {product.description}
              </p>

              {/* Error Messages */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Add to Cart Button */}
              <div className="mt-auto space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  size="lg"
                  className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                    product.stock > 0
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-purple-500/30 text-white border-0"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed hover:transform-none hover:shadow-lg"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : product.stock > 0 ? (
                    <>
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Add to Cart
                    </>
                  ) : (
                    <>
                      <Package className="w-6 h-6 mr-3" />
                      Out of Stock
                    </>
                  )}
                </Button>

                {/* Stock Information */}
                {product.stock > 0 && (
                  <div className="text-center">
                    <Badge
                      variant={product.stock <= 5 ? "destructive" : "secondary"}
                      className="text-sm font-medium px-3 py-1"
                    >
                      {product.stock <= 5
                        ? `Only ${product.stock} left!`
                        : `${product.stock} in stock`}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Features */}
              <Separator className="my-6" />

              <div className="flex justify-around text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs font-semibold">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs font-semibold">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center">
                  <Headphones className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs font-semibold">24/7 Support</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
