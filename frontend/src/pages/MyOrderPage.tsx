import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  MapPin,
  Package,
  Calendar,
  Store,
  Receipt,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../context/Auth/AuthContext";

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
      <div className="container max-w-4xl mx-auto mt-16 flex justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            Loading your orders...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto mt-8">
        <Alert variant="destructive" className="rounded-2xl shadow-lg">
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container max-w-3xl mx-auto pt-8 pb-12 px-4">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-zinc-800 dark:to-zinc-700 mb-6 shadow-2xl shadow-blue-500/30 dark:shadow-none">
            <Receipt className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent mb-4">
            My Orders
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Track and manage your purchase history
          </p>
          {myOrders && myOrders.length > 0 && (
            <Badge
              variant="secondary"
              className="mt-4 px-4 py-2 text-base font-semibold bg-blue-100 text-blue-700 border-2 border-blue-200"
            >
              {myOrders.length} Total Orders
            </Badge>
          )}
        </div>

        {/* Orders Content */}
        {!myOrders || myOrders.length === 0 ? (
          <Card className="rounded-3xl shadow-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mb-8">
                <Store className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                No Orders Yet
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Your order history is empty. Start exploring our products and
                place your first order!
              </p>
              <Button
                onClick={handelHome}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {myOrders.map((order: Order) => (
              <Card
                key={order._id}
                className="rounded-3xl overflow-hidden bg-white dark:bg-white/5 shadow-xl border border-gray-100 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Premium Order Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-zinc-900 dark:to-zinc-800 text-white p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20"></div>
                  <div className="flex justify-between items-center flex-wrap gap-6 relative z-10">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg font-medium opacity-95">
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
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white/25 text-white font-bold text-sm mb-4 px-4 py-2 hover:bg-white/25">
                        <Truck className="w-4 h-4 mr-1" />✓ Delivered
                      </Badge>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-4xl font-bold">
                          {order.totalPrice}
                        </span>
                        <span className="text-xl font-semibold opacity-90">
                          LYD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  {/* Enhanced Order Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 border-blue-100 dark:border-white/10 rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12 bg-blue-500">
                            <AvatarFallback>
                              <MapPin className="w-6 h-6 " />
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="text-lg font-bold text-blue-700">
                            Delivery Address
                          </h4>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                          {order.address}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-800 border-purple-100 dark:border-white/10 rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12 bg-purple-500">
                            <AvatarFallback>
                              <Package className="w-6 h-6 " />
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="text-lg font-bold text-purple-700">
                            Order Summary
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">
                            Items: {order.orderItems.length}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">
                            Payment: Completed 💳
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-8" />

                  {/* Modern Items Section */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                      Order Items ({order.orderItems.length})
                    </h4>

                    <div className="space-y-4">
                      {order.orderItems.map(
                        (item: OrderItem, itemIndex: number) => (
                          <Card
                            key={itemIndex}
                            className="bg-white dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-lg hover:-translate-y-1"
                          >
                            <CardContent className="p-6">
                              <div className="flex gap-6">
                                <img
                                  src={item.image}
                                  alt={item.productTitle}
                                  className="w-20 h-20 object-cover rounded-xl shadow-md flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                                    {item.productTitle}
                                  </h5>
                                  <div className="flex gap-4 items-center mb-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-100 text-blue-700 font-semibold"
                                    >
                                      Qty: {item.quantity}
                                    </Badge>
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                      {item.unitPrice} LYD each
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600 dark:text-gray-300 font-bold">
                                      Subtotal:
                                    </span>
                                    <span className="font-bold text-gray-800 dark:text-gray-100">
                                      {item.unitPrice * item.quantity} LYD
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
