import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingBasket,
  User,
  Coins,
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
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getUserTokenInfo } from "@/services/tokens";
import { TokenTier } from "@/types/database";

// Define the props for the Navbar component
interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
  avatarUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn: isLoggedInProp,
  username: usernameProp,
  avatarUrl: avatarUrlProp
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenTier, setTokenTier] = useState<TokenTier>("Bronze");
  const location = useLocation();
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch token balance when user is logged in
  useEffect(() => {
    const fetchTokens = async () => {
      if (session?.uid) {
        try {
          const tokenInfo = await getUserTokenInfo(session.uid);
          setTokenBalance(tokenInfo.balance);
          setTokenTier(tokenInfo.tier);
        } catch (error) {
          console.error("Error fetching token info:", error);
        }
      }
    };
    fetchTokens();
  }, [session?.uid]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const { itemCount: cartCount } = useCart();
  
  // Use props if provided, otherwise fall back to context
  const isLoggedIn = isLoggedInProp !== undefined ? isLoggedInProp : session !== null;
  const username = usernameProp !== undefined ? usernameProp : profile?.full_name || "User";
  const avatarUrl = avatarUrlProp !== undefined ? avatarUrlProp : profile?.avatar_url || "";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">FC</span>
            </div>
            <span className="font-serif text-xl font-bold text-green-800">Farm Collective</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cn("font-medium transition-colors", isActive("/") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Home</Link>
          <Link to="/marketplace" className={cn("font-medium transition-colors", isActive("/marketplace") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Marketplace</Link>
          <Link to="/about" className={cn("font-medium transition-colors", isActive("/about") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>About</Link>
          <Link to="/grower" className={cn("font-medium transition-colors", isActive("/grower") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Join the Collective</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBasket className="h-5 w-5 text-green-800" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full">
                    <Avatar>
                      <AvatarImage src={avatarUrl} alt={username} />
                      <AvatarFallback className="bg-amber-100 text-amber-800">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/profile/consumer" className="w-full flex items-center"><User className="mr-2 h-4 w-4" /> View Consumer Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/profile/producer" className="w-full flex items-center"><User className="mr-2 h-4 w-4" /> View Producer Profile</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/orders" className="w-full flex items-center"><ShoppingBasket className="mr-2 h-4 w-4" /> Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/rewards" className="w-full flex items-center"><Coins className="mr-2 h-4 w-4 text-amber-500" /> {tokenBalance} $FCUK</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/settings" className="w-full flex items-center"><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative"><ShoppingBasket className="h-5 w-5 text-green-800" /></Button>
              </Link>
              <Link to="/signin"><Button variant="ghost" className="text-green-800 hover:text-amber-600 hover:bg-amber-50">Sign In</Button></Link>
              <Link to="/signup"><Button className="bg-amber-600 hover:bg-amber-700 text-white">Sign Up</Button></Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 md:hidden">
          <Link to="/cart" className="mr-2"><Button variant="ghost" size="icon" className="relative"><ShoppingBasket className="h-5 w-5 text-green-800" />{cartCount > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}</Button></Link>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}><Menu className="h-6 w-6 text-green-800" /></Button>
        </div>
      </div>

      <div className={cn("md:hidden bg-white border-t border-amber-100 transition-all duration-300 ease-in-out overflow-hidden", isMobileMenuOpen ? "max-h-screen" : "max-h-0")}>
        <div className="container px-4 py-4 mx-auto space-y-4">
          <Link to="/" className={cn("block py-2 font-medium", isActive("/") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Home</Link>
          <Link to="/marketplace" className={cn("block py-2 font-medium", isActive("/marketplace") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Marketplace</Link>
          <Link to="/about" className={cn("block py-2 font-medium", isActive("/about") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>About</Link>
          <Link to="/grower" className={cn("block py-2 font-medium", isActive("/grower") ? "text-amber-600" : "text-green-800 hover:text-amber-600")}>Join the Collective</Link>
          {isLoggedIn ? (
            <div className="pt-4 border-t border-amber-100 space-y-3">
              <Link to="/profile/consumer" className="block py-2 text-green-800 hover:text-amber-600">Consumer Profile</Link>
              <Link to="/profile/producer" className="block py-2 text-green-800 hover:text-amber-600">Producer Profile</Link>
              <Link to="/orders" className="block py-2 text-green-800 hover:text-amber-600">Orders</Link>
              <Link to="/settings" className="block py-2 text-green-800 hover:text-amber-600">Settings</Link>
              <div onClick={handleSignOut} className="block py-2 text-green-800 hover:text-amber-600 cursor-pointer">Logout</div>
            </div>
          ) : (
            <div className="pt-4 border-t border-amber-100 space-y-3">
              <Link to="/signin" className="block"><Button variant="outline" className="w-full text-green-800 border-amber-600">Sign In</Button></Link>
              <Link to="/signup" className="block"><Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Sign Up</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
