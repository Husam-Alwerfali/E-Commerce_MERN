import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, totalPrice, updateItemINCart, deleteItemFromCart , clearCart } = useCart();

  const navigate = useNavigate();

  const handelQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateItemINCart(productId, quantity);
  };

  const handelDeleteItem = (productId: string) => {
    if (deleteItemFromCart) {
      deleteItemFromCart(productId);
    }
  }

  const handelClearCart = () => {
    if (clearCart) {
      clearCart();
    }
  }

  const handelCheckout = () => {
   navigate("/checkout")
  }

  const renderCartItems = () => {
    return <Box display="flex" flexDirection="column">
     {cartItems.map((item) => (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ border: "3px solid #f5f5f5", p: 2, borderRadius: 3, mt: 2 }}
        >
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <img src={item.image} width="90" />
            <Box>
              <Typography variant="h6">{item.title}</Typography>
              <Typography>
                {item.quantity} x {item.price} LYD
              </Typography>
              <Button onClick={()=> handelDeleteItem(item.productId)} variant="contained">
                <DeleteIcon />
              </Button>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button
                onClick={() =>
                  handelQuantity(item.productId, item.quantity - 1)
                }
              >
                -
              </Button>
              <Button
                onClick={() =>
                  handelQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </Button>
            </ButtonGroup>
            <Typography
              variant="caption"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              Stock: {item.stock}
            </Typography>
          </Box>
        </Box>
      ))}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        <Typography margin={1} variant="h4">
          Total : {totalPrice} LYD
        </Typography>
        <Button variant="contained" onClick={handelCheckout}>CHECKOUT</Button>
      </Box> 
      </Box>
  }

  return (
    <Container fixed maxWidth={false} sx={{ mt: 2 }}>
      <Box mb={2} display="flex" flexDirection="row" justifyContent="space-between" >
        <Typography variant="h4">My Cart</Typography>
        <Button onClick={()=> handelClearCart()} >Empty Cart</Button>
      </Box>

  { cartItems.length ? ( 
     renderCartItems()  ) : ( <Typography>Cart is Empty</Typography> )}
    </Container>
  );
};

export default CartPage;
