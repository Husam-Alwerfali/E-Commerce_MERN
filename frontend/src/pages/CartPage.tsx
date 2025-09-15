import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";

const CartPage = () => {
  const { cartItems, totalPrice } = useCart();

  return (
    <Container fixed maxWidth={false} sx={{ mt: 2 }}>
      <Typography variant="h4">Cart Page</Typography>
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
              <Button variant="contained">
                <DeleteIcon />
              </Button>
            </Box>
          </Box>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button>-</Button>
            <Button>+</Button>
          </ButtonGroup>
        </Box>
      ))}
      <Box>
        <Typography margin={1}
          variant="h4">
          Total : {totalPrice} LYD
        </Typography>
      </Box>
    </Container>
  );
};

export default CartPage;
