import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Store,
  PersonAdd,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../api/baseUrl";
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
      // Make API call to login the user
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password. Please try again!");
        return;
      }

      const token = await response.json();
      if (!token) {
        setError("Authentication failed. Please try again!");
        return;
      }

      login(email, token);
      navigate("/");
    } catch {
      setError("Network error. Please check your connection and try again!");
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                p: 4,
                textAlign: "center",
                borderRadius: 0,
              }}
            >
              <Store sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                }}
              >
                Sign in to your TopShop account
              </Typography>
            </Paper>

            <CardContent sx={{ p: 4 }}>
              {/* Login Form */}
              <Box component="form" sx={{ mt: 2 }}>
                {/* Email Field */}
                <TextField
                  inputRef={emailRef}
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { color: "#667eea" },
                  }}
                  sx={{
                    mb: 3,
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

                {/* Password Field */}
                <TextField
                  inputRef={passwordRef}
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: "#667eea" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { color: "#667eea" },
                  }}
                  sx={{
                    mb: 3,
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

                {/* Error Alert */}
                {error && (
                  <Fade in timeout={300}>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          color: "#ff6b6b",
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Login Button */}
                <Button
                  onClick={onSubmit}
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <LoginIcon />
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
                    mb: 3,
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
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Divider */}
                <Divider sx={{ mb: 3 }}>
                  <Chip
                    label="or"
                    sx={{
                      bgcolor: "transparent",
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  />
                </Divider>

                {/* Register Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Don't have an account yet?
                  </Typography>
                  <Button
                    onClick={handleRegisterRedirect}
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 1.5,
                      borderColor: "#667eea",
                      color: "#667eea",
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: "#667eea",
                        backgroundColor: "rgba(102,126,234,0.1)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Create New Account
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
