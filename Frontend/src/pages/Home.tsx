import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import productBottle from "@/assets/product-bottle.jpg";
import productBag from "@/assets/product-bag.jpg";
import productSolar from "@/assets/product-solar.jpg";
import productNotebook from "@/assets/product-notebook.jpg";

const Home = () => {
  const products = [
    {
      id: 1,
      image: productBottle,
      title: "Bamboo Water Bottle",
      price: 500,
      badge: "Eco-Friendly"
    },
    {
      id: 2,
      image: productBag,
      title: "Organic Cotton Tote",
      price: 150,
      badge: "Reusable"
    },
    {
      id: 3,
      image: productSolar,
      title: "Solar Power Bank",
      price: 800,
      badge: "Solar Powered"
    },
    {
      id: 4,
      image: productNotebook,
      title: "Recycled Notebook Set",
      price: 80,
      badge: "100% Recycled"
    }
  ];

  const handleBuyNow = (title) => {
    toast.success(`Added ${title} to cart!`, {
      description: "Continue shopping or proceed to checkout"
    });
  };

  const handleSearch = (query) => {
    console.log(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onSearch={handleSearch}/>
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-accent via-background to-muted py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EcoWave
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover sustainable products and make a positive impact on our planet
              </p>
              
              <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 shadow-sm">
                <Leaf className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
                  <p className="text-2xl font-bold text-primary">25,847 kg</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Top Eco-Friendly Items</h2>
                <p className="text-muted-foreground">Featured sustainable products from our marketplace</p>
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary text-lg px-4 py-2">
                New Arrivals
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  badge={product.badge}
                  onBuyNow={() => handleBuyNow(product.title)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every purchase on EcoWave contributes to a healthier planet
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <p className="text-4xl font-bold text-primary mb-2">95%</p>
                  <p className="text-muted-foreground">Less Waste Generated</p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <p className="text-4xl font-bold text-secondary mb-2">10k+</p>
                  <p className="text-muted-foreground">Products Reused</p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <p className="text-4xl font-bold text-primary mb-2">25k kg</p>
                  <p className="text-muted-foreground">CO₂ Emissions Saved</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
