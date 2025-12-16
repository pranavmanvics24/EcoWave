import { Link, useLocation } from "react-router-dom";
import { Waves, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useAuthStore } from "@/lib/store";

const Navigation = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Waves className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EcoWave
            </span>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center max-w-md w-full bg-muted rounded-full border border-border px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-sm"
            />
            <button type="submit" className="ml-2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center gap-4">
            <Link
              to="/sell"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/sell') ? 'text-primary' : 'text-foreground'
                }`}
            >
              Sell an item
            </Link>

            <CartDrawer />

            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="group">
                  <User className="h-5 w-5 group-hover:text-primary transition-colors" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="ml-2">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
