import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Recycle, ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-eco.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-muted">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzBEOTQ4OCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>

        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
                  <Leaf className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">Sustainable Shopping</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Buy, Sell, and{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Save the Planet
                </span>
              </h1>

              <p className="text-xl text-muted-foreground">
                EcoWave is a marketplace for used and eco-friendly items, promoting reuse and reducing waste.
                Join thousands making a difference, one purchase at a time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 group w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/home">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Recycle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">10k+</p>
                  <p className="text-sm text-muted-foreground">Items Reused</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary">5k+</p>
                  <p className="text-sm text-muted-foreground">Happy Users</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-accent p-3 rounded-full">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">25k kg</p>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3"></div>
              <img
                src={heroImage}
                alt="Eco-friendly marketplace"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
