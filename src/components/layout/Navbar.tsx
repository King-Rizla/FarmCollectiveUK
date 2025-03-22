import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  ShoppingBasket,
  User,
  Coins,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
  avatarUrl?: string;
}

const Navbar = ({
  isLoggedIn = true, // Changed to true for demo purposes
  username = "Sarah Johnson",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Simulated cart count
  const cartCount = 3;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        {/* Logo (Left Side) */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">
                  FC
                </span>
              </div>
              <span className="font-serif text-xl font-bold text-green-800">
                Farm Collective
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation (Center) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={cn(
              "font-medium transition-colors",
              isActive("/")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className={cn(
              "font-medium transition-colors",
              isActive("/marketplace")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Marketplace
          </Link>
          <Link
            to="/social"
            className={cn(
              "font-medium transition-colors",
              isActive("/social")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Social Feed
          </Link>
          <Link
            to="/about"
            className={cn(
              "font-medium transition-colors",
              isActive("/about")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            About
          </Link>
          <Link
            to="/grower"
            className={cn(
              "font-medium transition-colors",
              isActive("/grower")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Join as Grower
          </Link>

          <Link
            to="/faq"
            className={cn(
              "font-medium transition-colors",
              isActive("/faq")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={cn(
              "font-medium transition-colors",
              isActive("/contact")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Contact
          </Link>
        </div>

        {/* User Menu / Cart (Right Side) */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBasket className="h-5 w-5 text-green-800" />
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Avatar>
                      <AvatarImage src={avatarUrl} alt={username} />
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to="/profile/consumer"
                      className="w-full flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" /> View Consumer Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/profile/producer"
                      className="w-full flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" /> View Producer Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/favorites" className="w-full flex items-center">
                      <Heart className="mr-2 h-4 w-4" /> Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full flex items-center">
                      <ShoppingBasket className="mr-2 h-4 w-4" /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/rewards" className="w-full flex items-center">
                      <Coins className="mr-2 h-4 w-4" /> Tokens (520)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/" className="w-full flex items-center">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBasket className="h-5 w-5 text-green-800" />
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  variant="ghost"
                  className="text-green-800 hover:text-amber-600 hover:bg-amber-50"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <Link to="/cart" className="mr-2">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBasket className="h-5 w-5 text-green-800" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6 text-green-800" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-white border-t border-amber-100 transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-screen" : "max-h-0",
        )}
      >
        <div className="container px-4 py-4 mx-auto space-y-4">
          <Link
            to="/"
            className={cn(
              "block py-2 font-medium",
              isActive("/")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className={cn(
              "block py-2 font-medium",
              isActive("/marketplace")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Marketplace
          </Link>
          <Link
            to="/social"
            className={cn(
              "block py-2 font-medium",
              isActive("/social")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Social Feed
          </Link>
          <Link
            to="/about"
            className={cn(
              "block py-2 font-medium",
              isActive("/about")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            About
          </Link>
          <Link
            to="/grower"
            className={cn(
              "block py-2 font-medium",
              isActive("/grower")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Join as Grower
          </Link>

          <Link
            to="/faq"
            className={cn(
              "block py-2 font-medium",
              isActive("/faq")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={cn(
              "block py-2 font-medium",
              isActive("/contact")
                ? "text-amber-600"
                : "text-green-800 hover:text-amber-600",
            )}
          >
            Contact
          </Link>

          {isLoggedIn ? (
            <div className="pt-4 border-t border-amber-100 space-y-3">
              <Link
                to="/profile/consumer"
                className="block py-2 text-green-800 hover:text-amber-600"
              >
                Consumer Profile
              </Link>
              <Link
                to="/profile/producer"
                className="block py-2 text-green-800 hover:text-amber-600"
              >
                Producer Profile
              </Link>
              <Link
                to="/orders"
                className="block py-2 text-green-800 hover:text-amber-600"
              >
                Orders
              </Link>
              <Link
                to="/settings"
                className="block py-2 text-green-800 hover:text-amber-600"
              >
                Settings
              </Link>
              <Link
                to="/"
                className="block py-2 text-green-800 hover:text-amber-600"
              >
                Logout
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-amber-100 space-y-3">
              <Link to="/signin" className="block">
                <Button
                  variant="outline"
                  className="w-full text-green-800 border-amber-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="block">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
