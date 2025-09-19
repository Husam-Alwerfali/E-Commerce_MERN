import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { BASE_URL } from "../api/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { redirectBasedOnRole } from "../utils/roleUtils";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnRole(navigate);
    }
  }, [isAuthenticated, navigate]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async () => {
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // Clear previous errors
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Make API call to register the user
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError("An account with this email already exists");
        } else {
          setError("Unable to create account. Please try again!");
        }
        return;
      }

      const token = await response.json();
      if (!token) {
        setError("Registration failed. Please try again!");
        return;
      }

      login(email, token);

      // Redirect based on user role
      redirectBasedOnRole(navigate, token);
    } catch {
      setError("Network error. Please check your connection and try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="rounded-2xl shadow-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-white/20">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 text-center">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-2 text-shadow">
              Create Account
            </h1>
            <p className="text-lg opacity-90">
              Join TopShop and start shopping today
            </p>
          </div>

          <CardContent className="p-8">
            {/* Registration Form */}
            <div className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="firstName"
                      ref={firstNameRef}
                      placeholder="Enter your first name"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="lastName"
                      ref={lastNameRef}
                      placeholder="Enter your last name"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="password"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={handleClickShowPassword}
                    className="absolute right-3 top-3 text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Register Button */}
              <Button
                onClick={onSubmit}
                disabled={loading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex justify-center">
                  <span className="bg-white px-3 text-sm text-gray-500 font-medium">
                    or
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">Already have an account?</p>
                <Button
                  onClick={handleLoginRedirect}
                  variant="outline"
                  className="w-full py-4 text-base font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Existing Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
