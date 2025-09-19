import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Store,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Clear previous errors
    setError("");

    // Validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // Redirect to home after successful login
      navigate("/");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-50 duration-800">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          {/* Header Section */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg pb-8">
            <div className="text-center space-y-2">
              <Store className="w-16 h-16 mx-auto opacity-90" />
              <CardTitle className="text-3xl font-bold text-shadow-sm">
                Welcome Back
              </CardTitle>
              <p className="text-blue-100 text-lg">
                Sign in to your TopShop account
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Login Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-blue-200 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
                  <Input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-blue-200 focus:border-blue-600 focus:ring-blue-600"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-blue-600 hover:text-blue-800"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert
                  variant="destructive"
                  className="animate-in slide-in-from-top-2 duration-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                onClick={onSubmit}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">or</span>
              </div>
            </div>

            {/* Register Section */}
            <div className="text-center space-y-3">
              <p className="text-gray-600">Don't have an account yet?</p>
              <Button
                onClick={handleRegisterRedirect}
                variant="outline"
                className="w-full h-11 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200 hover:-translate-y-0.5"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
