import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import {
  Button,
  Container,
  Badge,
  Chip,
  Divider,
  ListItemIcon,
  Fade,
} from "@mui/material";
import {
  Store,
  AccountCircle,
  Logout,
  ShoppingBag,
  Login,
} from "@mui/icons-material";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

function Navbar() {
  const { username, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handelLogin = () => {
    navigate("/login");
  };

  const handelMyOrders = () => {
    navigate("/my-orders");
    handleCloseUserMenu();
  };

  const handelLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/");
  };

  const handelCart = () => {
    navigate("/cart");
  };

  // Extract name before @ symbol for display
  const displayName = username?.split("@")[0] || username;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 70 },
            py: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Logo Section */}
            <Button
              variant="text"
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.2s ease-in-out",
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Store
                  sx={{
                    fontSize: { xs: 28, sm: 32 },
                    color: "white",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
                <Typography
                  variant="h5"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    fontFamily: '"Poppins", "Roboto", sans-serif',
                    fontWeight: 700,
                    fontSize: { sm: "1.5rem", md: "1.7rem" },
                    background:
                      "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    letterSpacing: "0.5px",
                  }}
                >
                  TopShop
                </Typography>
              </Box>
            </Button>

            {/* Right Section */}
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* Cart Icon */}
              <Tooltip title="View Cart" arrow>
                <IconButton
                  onClick={handelCart}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                    p: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Badge
                    badgeContent={cartItems.length}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.75rem",
                        minWidth: "18px",
                        height: "18px",
                        background:
                          "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                        boxShadow: "0 2px 8px rgba(255,107,107,0.4)",
                      },
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: { xs: 22, sm: 24 } }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Section */}
              {isAuthenticated ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {/* Welcome Chip - Hidden on mobile */}
                  <Chip
                    label={`Welcome, ${displayName}`}
                    avatar={<AccountCircle />}
                    sx={{
                      display: { xs: "none", md: "flex" },
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      "& .MuiChip-avatar": {
                        color: "white",
                      },
                    }}
                  />

                  <Tooltip title="Account Settings" arrow>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0.5,
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <Avatar
                        alt={displayName || ""}
                        sx={{
                          width: { xs: 35, sm: 40 },
                          height: { xs: 35, sm: 40 },
                          background:
                            "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                          border: "2px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        {displayName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    sx={{
                      mt: "50px",
                      "& .MuiPaper-root": {
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        borderRadius: 3,
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        minWidth: 180,
                      },
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    TransitionComponent={Fade}
                  >
                    <MenuItem
                      onClick={handelMyOrders}
                      sx={{
                        gap: 1.5,
                        py: 1.5,
                        px: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <ShoppingBag sx={{ color: "#667eea" }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 500 }}>
                        My Orders
                      </Typography>
                    </MenuItem>

                    <Divider sx={{ mx: 1, opacity: 0.3 }} />

                    <MenuItem
                      onClick={handelLogout}
                      sx={{
                        gap: 1.5,
                        py: 1.5,
                        px: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(238,90,82,0.1) 100%)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Logout sx={{ color: "#ff6b6b" }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 500 }}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={handelLogin}
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
