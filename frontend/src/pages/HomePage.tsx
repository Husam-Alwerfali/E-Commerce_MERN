import { Separator } from "../components/ui/separator";
import { ShoppingBag, TrendingUp, Star, Loader2 } from "lucide-react";
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
      <div className="flex justify-center items-center min-h-[60vh] flex-col gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <h2 className="text-xl font-medium text-gray-600">
          Something went wrong, Please try again!
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col gap-4">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <h2 className="text-xl font-medium text-gray-600">
          Loading amazing products...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center animate-in fade-in-50 duration-1000">
            <ShoppingBag className="w-20 h-20 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light">
              Discover amazing products at unbeatable prices
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-red-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
              Featured Products
            </h2>
            <Star className="w-8 h-8 text-red-500 ml-2" />
          </div>

          <Separator className="w-24 h-1 bg-red-500 mx-auto mb-4" />

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Carefully curated collection of premium products just for you
          </p>
        </div>

        <div className="animate-in fade-in-50 duration-1500">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <TrendingUp className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-medium text-gray-600 mb-2">
              No products available yet
            </h3>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
