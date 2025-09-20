import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingCart,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CreditCard,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const {
    cartItems,
    totalPrice,
    updateItemInCart,
    deleteItemFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [quantityValues, setQuantityValues] = useState<{
    [key: string]: string;
  }>({});

  // Initialize quantity values when cart items change
  useEffect(() => {
    const newQuantityValues: { [key: string]: string } = {};
    cartItems.forEach((item) => {
      newQuantityValues[item.productId] = item.quantity.toString();
    });
    setQuantityValues(newQuantityValues);
  }, [cartItems]);

  const handelQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateItemInCart(productId, quantity);
  };

  const handleQuantityInputChange = (productId: string, value: string) => {
    // Allow empty string for better UX or valid positive numbers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setQuantityValues((prev) => ({
        ...prev,
        [productId]: value,
      }));
    }
  };

  const handleQuantitySubmit = (productId: string, maxStock: number) => {
    const value = quantityValues[productId] || "1";
    let quantity = parseInt(value);

    // Validate quantity
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (quantity > maxStock) {
      quantity = maxStock;
    }

    // Update the input value to the validated quantity
    setQuantityValues((prev) => ({
      ...prev,
      [productId]: quantity.toString(),
    }));

    // Update the cart
    updateItemInCart(productId, quantity);
  };

  const handleQuantityBlur = (productId: string, maxStock: number) => {
    const value = quantityValues[productId];
    if (value === "" || value === undefined || parseInt(value) === 0) {
      // Reset to current cart quantity if empty or 0
      const currentItem = cartItems.find(
        (item) => item.productId === productId
      );
      const resetValue = currentItem ? currentItem.quantity.toString() : "1";
      setQuantityValues((prev) => ({
        ...prev,
        [productId]: resetValue,
      }));
    } else {
      handleQuantitySubmit(productId, maxStock);
    }
  };

  const handelDeleteItem = (productId: string) => {
    if (deleteItemFromCart) {
      deleteItemFromCart(productId);
    }
  };

  const handelClearCart = () => {
    if (clearCart) {
      clearCart();
    }
  };

  const handelCheckout = () => {
    navigate("/checkout");
  };

  const renderCartItems = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="mb-6">
            <CardContent className="p-0">
              {/* Cart Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-zinc-900 dark:to-zinc-800 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ShoppingBag className="w-8 h-8" />
                  <h2 className="text-2xl font-semibold">
                    Shopping Cart ({cartItems.length} items)
                  </h2>
                </div>
                <Button
                  onClick={handelClearCart}
                  variant="outline"
                  className="text-purple-500 dark:text-purple-300 border-purple-300 dark:border-white/20 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 bg-white/90 dark:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Cart Items */}
              <div className="p-4">
                {cartItems.map((item) => (
                  <Card
                    key={item.productId}
                    className="mb-4 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        {/* Product Image */}
                        <div className="sm:col-span-3 flex justify-center">
                          <div className="relative rounded-xl overflow-hidden w-28 h-28 mx-auto">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="sm:col-span-5 space-y-3">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Price: ${item.price} LYD each
                          </p>
                          <Badge
                            variant={
                              item.stock > 5 ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.stock} in stock
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handelDeleteItem(item.productId)}
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="sm:col-span-4 flex flex-col items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                handelQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              variant="outline"
                              size="sm"
                              className="w-9 h-9 p-0 border-blue-500 text-blue-500 hover:bg-blue-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <Input
                              value={
                                quantityValues[item.productId] !== undefined
                                  ? quantityValues[item.productId]
                                  : item.quantity.toString()
                              }
                              onChange={(e) =>
                                handleQuantityInputChange(
                                  item.productId,
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleQuantityBlur(item.productId, item.stock)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleQuantitySubmit(
                                    item.productId,
                                    item.stock
                                  );
                                }
                              }}
                              type="number"
                              min="1"
                              max={item.stock}
                              className="w-20 text-center font-semibold focus:border-blue-500"
                            />

                            <Button
                              onClick={() =>
                                handelQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= item.stock}
                              variant="outline"
                              size="sm"
                              className="w-9 h-9 p-0 border-blue-500 text-blue-500 hover:bg-blue-50"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Max: {item.stock}
                          </p>

                          <p className="text-xl font-bold text-green-600">
                            ${(item.price * item.quantity).toFixed(2)} LYD
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-5">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-medium">
                    ${totalPrice.toFixed(2)} LYD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-green-600">
                    ${totalPrice.toFixed(2)} LYD
                  </span>
                </div>
              </div>

              <Button
                onClick={handelCheckout}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              <div className="mt-6 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Truck className="w-5 h-5" />
                <span className="text-sm">Free shipping on all orders</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {cartItems.length ? (
          renderCartItems()
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-20 h-20 text-gray-400 dark:text-gray-500 mb-6 mx-auto" />
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartPage;
