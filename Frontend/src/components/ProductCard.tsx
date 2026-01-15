import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ image, title, price, badge, onClick, onBuyNow, onAddToCart }) => {
  return (
    <Card
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        {badge && (
          <Badge className="mb-2 bg-secondary/10 text-secondary hover:bg-secondary/20">
            {badge}
          </Badge>
        )}
        <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
        <p className="text-2xl font-bold text-primary">₹{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow();
          }}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
