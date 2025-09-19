import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Chip, Zoom, CardActions, Button } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

interface Props {
  _id: string;
  title: string;
  image: string;
  price: string;
  stock: number;
}
export default function ProductCard({ _id, title, image, price, stock }: Props) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    addToCart(_id);
  };

  return (
    <Zoom in timeout={800}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            sx={{
              height: 280,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            image={image}
            title={title}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              lineHeight: 1.3,
              color: "#2c3e50",
              mb: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: "2.6em", // Fixed height for 2 lines
            }}
            title={title} // Shows full title on hover
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#27ae60",
                fontWeight: 700,
                fontSize: "1.4rem",
              }}
            >
              ${price}
            </Typography>

            <Chip
              label={
                stock > 0 
                  ? stock > 10 
                    ? "In Stock" 
                    : `Only ${stock} left`
                  : "Out of Stock"
              }
              size="small"
              sx={{
                bgcolor: stock > 0 
                  ? stock > 10 
                    ? "#e8f5e8" 
                    : "#fff3e0"
                  : "#ffebee",
                color: stock > 0 
                  ? stock > 10 
                    ? "#27ae60" 
                    : "#f57c00"
                  : "#d32f2f",
                fontWeight: 500,
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            fullWidth
            disabled={stock === 0}
            sx={{
              py: 1.5,
              background: stock > 0 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #bdbdbd 0%, #757575 100%)",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
              transition: "all 0.3s ease-in-out",
              "&:hover": stock > 0 ? {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
              } : {},
              "&:disabled": {
                background: "linear-gradient(135deg, #bdbdbd 0%, #757575 100%)",
                color: "white",
              },
            }}
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardActions>
      </Card>
    </Zoom>
  );
}
