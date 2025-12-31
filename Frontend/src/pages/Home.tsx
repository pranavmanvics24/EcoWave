import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Leaf, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import ContactSellerDialog from "@/components/ContactSellerDialog";

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', currentCategory, currentSearch],
    queryFn: () => productApi.getAll({ category: currentCategory, search: currentSearch }),
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleContactSeller = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(false);
    setIsContactDialogOpen(true);
  };

  const handleSearch = (query) => {
    if (query) {
      searchParams.set("search", query);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (category) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const categories = [
    { id: "all", label: "All Items" },
    { id: "clothing", label: "Clothing" },
    { id: "home", label: "Home" },
    { id: "electronics", label: "Electronics" },
    { id: "books", label: "Books" },
    { id: "accessories", label: "Accessories" },
    { id: "other", label: "Other" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation onSearch={handleSearch} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation onSearch={handleSearch} />
        <main className="flex-1 flex items-center justify-center text-red-500">
          Error loading products: {error.message}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onSearch={handleSearch} />

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

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={currentCategory === cat.id ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {currentSearch && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <p className="text-muted-foreground">
                    Results for "<span className="font-semibold text-foreground">{currentSearch}</span>"
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch("")}
                    className="h-6 w-6 p-0 rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

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
                <h2 className="text-3xl font-bold mb-2">
                  {currentCategory !== 'all'
                    ? `${categories.find(c => c.id === currentCategory)?.label} Items`
                    : "Top Eco-Friendly Items"}
                </h2>
                <p className="text-muted-foreground">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-secondary/10 text-secondary text-lg px-4 py-2 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => {
                  handleCategoryChange("all");
                  handleSearch("");
                }}
              >
                New Arrivals
              </Badge>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found holding your criteria.</p>
                <Button variant="link" onClick={() => {
                  handleCategoryChange("all");
                  handleSearch("");
                }}>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image || "/placeholder.jpg"}
                    title={product.title}
                    price={product.price}
                    badge={product.badge}
                    onClick={() => handleProductClick(product)}
                    onBuyNow={() => handleContactSeller(product)}
                  />
                ))}
              </div>
            )}
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

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProduct.title}</DialogTitle>
                <DialogDescription>
                  <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                    {selectedProduct.badge}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 mt-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedProduct.image || "/placeholder.jpg"}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">₹{selectedProduct.price}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={() => handleContactSeller(selectedProduct)}
                    >
                      Contact Seller
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Seller Dialog */}
      {selectedProduct && (
        <ContactSellerDialog
          open={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Home;
