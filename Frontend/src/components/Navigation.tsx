import { Link, useLocation } from "react-router-dom";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { UserCircle } from "lucide-react";

const Navigation = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };
  const location = useLocation();

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
            className="flex items-center max-w-md w-full bg-muted rounded-full border border-border px-4 py-2 shadow-sm"
          >
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button type="submit" className="ml-2 text-secondary hover:text-secondary/80">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/home"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/home') ? 'text-primary' : 'text-foreground'
                }`}
            >
              Home
            </Link>
            <Link
              to="/sell"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/marketplace') ? 'text-primary' : 'text-foreground'
                }`}
            >
              Sell an item
            </Link>
            <div className="md:flex items-center gap-4">
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                <UserCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
