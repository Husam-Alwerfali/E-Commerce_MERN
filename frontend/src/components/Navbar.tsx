import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ShoppingCart,
  Store,
  User,
  LogOut,
  ShoppingBag,
  LogIn,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

function Navbar() {
  const { username, isAuthenticated, userRole, isLoadingAuth, logout } =
    useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleMyOrders = () => {
    navigate("/my-orders");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  // Extract name before @ symbol for display
  const displayName = username?.split("@")[0] || username;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo Section */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 rounded-lg px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <Store className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-sm" />
              <span className="hidden sm:block text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent tracking-wide">
                TopShop
              </span>
            </div>
          </Button>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCart}
              className="text-white hover:bg-white/15 hover:scale-110 transition-all duration-200 relative p-2 md:p-3"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartItems.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-500 shadow-lg"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </div>
            </Button>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Welcome Message - Hidden on mobile */}
                <div className="hidden md:flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <User className="w-4 h-4 text-white mr-2" />
                  <span className="text-white font-medium text-sm">
                    Welcome, {displayName}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:scale-105 transition-all duration-200 p-1"
                    >
                      <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-white/30 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold">
                          {displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-48 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-lg"
                    align="end"
                  >
                    {!isLoadingAuth && userRole === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin")}
                          className="gap-3 py-3 px-4 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Admin Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200" />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={handleMyOrders}
                      className="gap-3 py-3 px-4 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">My Orders</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-200" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-3 py-3 px-4 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 md:px-6 py-2 rounded-lg border border-white/20 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
