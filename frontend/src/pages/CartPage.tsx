import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  IconButton, 
  Grid,
  Fade,
  TextField
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  ShoppingCart, 
  ClearAll, 
  Add, 
  Remove, 
  ShoppingBag, 
  LocalShipping, 
  Payment,
  RemoveShoppingCart
} from "@mui/icons-material";
import { useCart } from "../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CartPage = () => {
  const { cartItems, totalPrice, updateItemInCart, deleteItemFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [quantityValues, setQuantityValues] = useState<{[key: string]: string}>({});

  // Initialize quantity values when cart items change
  useEffect(() => {
    const newQuantityValues: {[key: string]: string} = {};
    cartItems.forEach(item => {
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
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setQuantityValues(prev => ({
        ...prev,
        [productId]: value
      }));
    }
  };

  const handleQuantitySubmit = (productId: string, maxStock: number) => {
    const value = quantityValues[productId] || '1';
    let quantity = parseInt(value);
    
    // Validate quantity
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (quantity > maxStock) {
      quantity = maxStock;
    }
    
    // Update the input value to the validated quantity
    setQuantityValues(prev => ({
      ...prev,
      [productId]: quantity.toString()
    }));
    
    // Update the cart
    updateItemInCart(productId, quantity);
  };

  const handleQuantityBlur = (productId: string, maxStock: number) => {
    const value = quantityValues[productId];
    if (value === '' || value === undefined || parseInt(value) === 0) {
      // Reset to current cart quantity if empty or 0
      const currentItem = cartItems.find(item => item.productId === productId);
      const resetValue = currentItem ? currentItem.quantity.toString() : '1';
      setQuantityValues(prev => ({
        ...prev,
        [productId]: resetValue
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
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {/* Cart Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShoppingBag sx={{ fontSize: 32 }} />
                  <Typography variant="h5" fontWeight={600}>
                    Shopping Cart ({cartItems.length} items)
                  </Typography>
                </Box>
                <Button
                  onClick={handelClearCart}
                  startIcon={<ClearAll />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  variant="outlined"
                >
                  Clear All
                </Button>
              </Box>

              {/* Cart Items */}
              <Box sx={{ p: 2 }}>
                {cartItems.map((item, index) => (
                  <Fade key={item.productId} in timeout={500 + index * 100}>
                    <Card 
                      sx={{ 
                        mb: 2,
                        border: '1px solid #f0f0f0',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                          {/* Product Image */}
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <Box
                              sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                maxWidth: '120px',
                                mx: { xs: 'auto', sm: 0 }
                              }}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          </Grid>

                          {/* Product Info */}
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Price: ${item.price} LYD each
                            </Typography>
                            <Chip 
                              label={`${item.stock} in stock`}
                              size="small"
                              color={item.stock > 5 ? 'success' : 'warning'}
                              sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                onClick={() => handelDeleteItem(item.productId)}
                                color="error"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>

                          {/* Quantity Controls */}
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                  onClick={() => handelQuantity(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  variant="outlined"
                                  size="small"
                                  sx={{ 
                                    minWidth: '36px', 
                                    width: '36px', 
                                    height: '36px',
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    '&:hover': {
                                      borderColor: '#5a6fd8',
                                      backgroundColor: 'rgba(102,126,234,0.1)'
                                    }
                                  }}
                                >
                                  <Remove />
                                </Button>
                                
                                <TextField
                                  value={quantityValues[item.productId] !== undefined ? quantityValues[item.productId] : item.quantity.toString()}
                                  onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                                  onBlur={() => handleQuantityBlur(item.productId, item.stock)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleQuantitySubmit(item.productId, item.stock);
                                    }
                                  }}
                                  size="small"
                                  type="number"
                                  sx={{
                                    width: '80px',
                                    '& .MuiOutlinedInput-root': {
                                      textAlign: 'center',
                                      '& input': {
                                        textAlign: 'center',
                                        fontWeight: 600
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                      },
                                    },
                                  }}
                                  inputProps={{
                                    min: 1,
                                    max: item.stock,
                                    step: 1,
                                    style: { textAlign: 'center' }
                                  }}
                                  error={Boolean(quantityValues[item.productId] && 
                                    (parseInt(quantityValues[item.productId]) < 1 || 
                                     parseInt(quantityValues[item.productId]) > item.stock))}
                                />
                                
                                <Button
                                  onClick={() => handelQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  variant="outlined"
                                  size="small"
                                  sx={{ 
                                    minWidth: '36px', 
                                    width: '36px', 
                                    height: '36px',
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    '&:hover': {
                                      borderColor: '#5a6fd8',
                                      backgroundColor: 'rgba(102,126,234,0.1)'
                                    }
                                  }}
                                >
                                  <Add />
                                </Button>
                              </Box>
                              
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ fontSize: '0.8rem' }}
                              >
                                Max: {item.stock}
                              </Typography>
                              
                              <Typography variant="h6" sx={{ fontWeight: 700, color: '#27ae60' }}>
                                ${(item.price * item.quantity).toFixed(2)} LYD
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({cartItems.length} items)</Typography>
                  <Typography>${totalPrice.toFixed(2)} LYD</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography color="success.main">Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#27ae60' }}>
                    ${totalPrice.toFixed(2)} LYD
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Payment />}
                onClick={handelCheckout}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(102,126,234,0.4)',
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Proceed to Checkout
              </Button>

              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Free shipping on all orders
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 4 }}>
      <Container maxWidth="xl">
        {cartItems.length ? (
          renderCartItems()
        ) : (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <RemoveShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                Your cart is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={() => navigate('/')}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(102,126,234,0.4)',
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
