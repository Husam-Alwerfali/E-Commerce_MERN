import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handelHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
            </div>

            {/* Success Title */}
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Order Placed Successfully!
            </h1>

            {/* Success Message */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Thank you for your purchase! Your order has been confirmed and is
              being processed.
            </p>

            {/* Order Details Box */}
            <Alert className="mb-8 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-left">
                <div className="font-semibold text-green-800 mb-2">
                  What happens next?
                </div>
                <div className="space-y-1 text-green-700">
                  <div>
                    • You will receive an order confirmation email shortly
                  </div>
                  <div>• We'll prepare your items for shipment</div>
                  <div>• Track your order status in your account</div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Action Button */}
            <Button
              onClick={handelHome}
              size="lg"
              className="inline-flex items-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Button>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about your order, please contact our
            customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
