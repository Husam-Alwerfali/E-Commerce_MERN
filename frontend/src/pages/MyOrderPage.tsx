import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "../context/Auth/AuthContext";

const MyOrderPage = () => {
  const { getMyOrders, myOrders } = useAuth();

  useEffect(() => {
    if (getMyOrders) {
      getMyOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      fixed
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {myOrders?.map(({ _id, address, orderItems, totalPrice }) => (
        <Box key={_id}>
          <Typography>Address: {address}</Typography>
          <Typography>Items : {orderItems.length}</Typography>
          <Typography>Total: {totalPrice} LYD</Typography>
        </Box>
      ))}
    </Container>
  );
};
export default MyOrderPage;
