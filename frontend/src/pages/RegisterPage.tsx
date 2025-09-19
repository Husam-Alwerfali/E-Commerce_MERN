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
  Grid,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import { BASE_URL } from "../api/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
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
              <PersonAdd sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                }}
              >
                Join TopShop and start shopping today
              </Typography>
            </Paper>

            <CardContent sx={{ p: 4 }}>
              {/* Registration Form */}
              <Box component="form" sx={{ mt: 2 }}>
                {/* Name Fields Row */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      inputRef={firstNameRef}
                      label="First Name"
                      name="firstName"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        sx: { color: "#667eea" },
                      }}
                      sx={{
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
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      inputRef={lastNameRef}
                      label="Last Name"
                      name="lastName"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        sx: { color: "#667eea" },
                      }}
                      sx={{
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
                  </Grid>
                </Grid>

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

                {/* Register Button */}
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
                      <PersonAdd />
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
                  {loading ? "Creating Account..." : "Create Account"}
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

                {/* Login Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Already have an account?
                  </Typography>
                  <Button
                    onClick={handleLoginRedirect}
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<LoginIcon />}
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
                    Sign In to Existing Account
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

export default RegisterPage;
