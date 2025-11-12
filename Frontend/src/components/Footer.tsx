import { Waves, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Waves className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EcoWave
            </span>
          </div>
          
          <p className="text-muted-foreground max-w-md">
            Join the movement for a greener planet. Together, we can make a difference.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-secondary fill-secondary" />
            <span>for the planet</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © 2024 EcoWave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
