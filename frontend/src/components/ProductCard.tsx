import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Chip, Zoom } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useCart } from "../context/Cart/CartContext";
import { useState } from "react";

interface Props {
  _id: string;
  title: string;
  image: string;
  price: string;
}
export default function ProductCard({ _id, title, image, price }: Props) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

          {/* Sale Badge */}
          <Chip
            label="NEW"
            size="small"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "#ff6b6b",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              boxShadow: "0 2px 8px rgba(255,107,107,0.3)",
            }}
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
            }}
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
              label="In Stock"
              size="small"
              sx={{
                bgcolor: "#e8f5e8",
                color: "#27ae60",
                fontWeight: 500,
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<AddShoppingCart />}
            onClick={() => addToCart(_id)}
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
              },
            }}
          >
            {isHovered ? "Add to Cart" : "Add to Cart"}
          </Button>
        </CardActions>
      </Card>
    </Zoom>
  );
}
