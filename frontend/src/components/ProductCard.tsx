import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

interface Props {
  _id: string;
  title: string;
  image: string;
  price: string;
  stock: number;
}

export default function ProductCard({
  _id,
  title,
  image,
  price,
  stock,
}: Props) {
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
    <div className="animate-in fade-in-50 duration-800">
      <Card
        className="h-full flex flex-col transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-xl rounded-lg overflow-hidden group"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-72 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>

        <CardContent className="flex-grow p-6">
          <h3
            className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-primary transition-colors"
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">${price}</span>

            <Badge
              variant={
                stock > 0
                  ? stock > 10
                    ? "default"
                    : "secondary"
                  : "destructive"
              }
              className="text-xs font-medium"
            >
              {stock > 0
                ? stock > 10
                  ? "In Stock"
                  : `Only ${stock} left`
                : "Out of Stock"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            variant={stock > 0 ? "default" : "secondary"}
            size="lg"
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full py-3 text-base font-semibold transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
