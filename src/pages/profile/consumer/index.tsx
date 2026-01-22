import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  Settings,
  Award,
  Coins,
  ChevronRight,
  Edit,
  Loader2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCustomerOrders } from "@/services/orders";
import { getUserTokenInfo, getNextTierProgress } from "@/services/tokens";
import { Order, TokenTier } from "@/types/database";

// Mock data
const defaultUserData = {
  name: "Sarah Johnson",
  username: "sarahj",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  location: "London, UK",
  joinDate: "March 2023",
  supportedGrowers: 12,
  tokenBalance: 520,
  tokenTier: "Silver",
  monthlySavings: 8.53,
  deliveryRadius: 25,
};

const recentPurchases = [
  {
    id: "1",
    name: "Organic Vegetable Box",
    producer: "Green Valley Farm",
    producerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
    price: 24.99,
    date: "2 days ago",
    rating: 5,
    hasReviewed: true,
  },
  {
    id: "2",
    name: "Wildflower Honey",
    producer: "Meadow Honey",
    producerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meadow",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
    price: 6.5,
    date: "1 week ago",
    rating: 4,
    hasReviewed: true,
  },
  {
    id: "3",
    name: "Artisan Sourdough",
    producer: "Village Bakery",
    producerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Village",
    image:
      "https://images.unsplash.com/photo-1585478259715-1c093a7b70d3?w=400&q=80",
    price: 4.99,
    date: "2 weeks ago",
    rating: 0,
    hasReviewed: false,
  },
];

const favoriteProducers = [
  {
    id: "1",
    name: "Green Valley Farm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
    distance: 3.2,
    bio: "Family-run organic farm specializing in seasonal vegetables and free-range eggs.",
    isFollowing: true,
  },
  {
    id: "2",
    name: "Meadow Honey",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meadow",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
    distance: 2.9,
    bio: "Sustainable beekeeping with wildflower and specialty seasonal honeys.",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Oak Lane Dairy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OakLane",
    image:
      "https://images.unsplash.com/photo-1594761051656-153faa4ea454?w=400&q=80",
    distance: 6.3,
    bio: "Small-scale dairy producing artisanal cheeses and yogurt from grass-fed cows.",
    isFollowing: true,
  },
];

const interactionHistory = [
  {
    id: "1",
    type: "review",
    content:
      "The carrots were incredibly fresh and sweet. Definitely the best I\'ve had in a long time!",
    target: "Organic Carrots",
    producer: "Green Valley Farm",
    date: "3 days ago",
    rating: 5,
  },
  {
    id: "2",
    type: "comment",
    content:
      "I\'d love to learn more about your beekeeping practices. Do you offer any workshops?",
    target: "Meadow Honey\'s post",
    producer: "Meadow Honey",
    date: "1 week ago",
  },
  {
    id: "3",
    type: "review",
    content:
      "This honey has such a unique flavor profile. I can really taste the wildflowers!",
    target: "Wildflower Honey",
    producer: "Meadow Honey",
    date: "2 weeks ago",
    rating: 4,
  },
];

const ConsumerProfile = () => {
  const [userData, setUserData] = useState(defaultUserData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{ balance: number; tier: TokenTier }>({
    balance: 0,
    tier: "Bronze",
  });
  const [tierProgress, setTierProgress] = useState<{
    nextTier: TokenTier | null;
    tokensNeeded: number;
    progress: number;
  }>({ nextTier: "Silver", tokensNeeded: 100, progress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const authName = user.displayName || user.email?.split("@")[0] || "User";

        // Fetch user doc and tokens first (critical)
        try {
          const [userDocSnap, tokenData] = await Promise.all([
            getDoc(doc(db, "users", user.uid)),
            getUserTokenInfo(user.uid),
          ]);

          if (userDocSnap.exists()) {
            const dbData = userDocSnap.data();
            const resolvedName = dbData.displayName || dbData.full_name || authName;
            const resolvedLocation = dbData.location || "";

            setUserData((prevData) => ({
              ...prevData,
              name: resolvedName,
              location: resolvedLocation,
              tokenBalance: tokenData.balance,
              tokenTier: tokenData.tier,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${resolvedName}`,
            }));
            setDisplayName(resolvedName);
            setLocation(resolvedLocation);
          } else {
            setUserData((prevData) => ({
              ...prevData,
              name: authName,
              location: "",
              tokenBalance: tokenData.balance,
              tokenTier: tokenData.tier,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authName}`,
            }));
            setDisplayName(authName);
            setLocation("");
          }

          setTokenInfo(tokenData);
          setTierProgress(getNextTierProgress(tokenData.balance));
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Still set basic data from auth
          setUserData((prevData) => ({
            ...prevData,
            name: authName,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authName}`,
          }));
          setDisplayName(authName);
        }

        // Fetch orders separately (non-blocking)
        try {
          const ordersData = await getCustomerOrders(user.uid);
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
          // Orders will remain empty - that's OK
        }

        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        location: location,
      });
      setUserData((prevData) => ({
        ...prevData,
        name: displayName,
        location: location,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
      }));
      setIsSheetOpen(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        isLoggedIn={true}
        username={userData.name}
        avatarUrl={userData.avatar}
      />

      <main className="container mx-auto px-4 py-24">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-amber-100">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-serif font-semibold text-green-800">
                    {userData.name}
                  </h1>
                  <div className="flex items-center text-green-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                    <span className="mx-2">•</span>
                    <span>Member since {userData.joinDate}</span>
                  </div>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-green-700 hover:bg-green-800 text-white">
                      <Settings className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when you\'re
                        done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Display Name
                        </Label>
                        <Input
                          id="name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit" onClick={handleSave}>
                          Save Changes
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Welcome back, {userData.name.split(" ")[0]}! You\'ve supported{" "}
                  {userData.supportedGrowers} local growers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Recent Purchases */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-serif text-green-800">
                    Recent Purchases
                  </CardTitle>
                  <Link to="/orders">
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-900"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-20 h-20 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No orders yet</p>
                    <Link to="/marketplace">
                      <Button className="mt-4 bg-green-700 hover:bg-green-800">
                        Browse Marketplace
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-green-50 flex-shrink-0 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-green-800">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <span className="font-medium text-green-800">
                              £{order.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-green-600">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </span>
                            <span className="mx-2 text-green-600">•</span>
                            <span className="text-sm text-green-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge
                              className={cn(
                                order.status === "paid" && "bg-yellow-100 text-yellow-800",
                                order.status === "shipped" && "bg-blue-100 text-blue-800",
                                order.status === "delivered" && "bg-green-100 text-green-800",
                                order.status === "cancelled" && "bg-red-100 text-red-800"
                              )}
                            >
                              {order.status}
                            </Badge>
                            <span className="text-sm text-amber-600">
                              +{order.tokensEarned} $FCUK
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Producers */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-serif text-green-800">
                    Favorite Producers
                  </CardTitle>
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-900"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favoriteProducers.map((producer) => (
                    <Card
                      key={producer.id}
                      className="border border-green-100 overflow-hidden h-full"
                    >
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={producer.image}
                          alt={producer.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs font-medium text-green-800">
                          <MapPin className="h-3 w-3 mr-1 text-green-600" />
                          <span>{producer.distance} km</span>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={producer.avatar} />
                            <AvatarFallback>{producer.name[0]}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-green-800 text-sm truncate">
                            {producer.name}
                          </h3>
                        </div>
                        <p className="text-green-600 text-xs line-clamp-2 mb-3">
                          {producer.bio}
                        </p>
                        <Button
                          variant={producer.isFollowing ? "outline" : "default"}
                          size="sm"
                          className={cn(
                            "w-full text-xs",
                            producer.isFollowing
                              ? "border-green-600 text-green-700 hover:bg-green-50"
                              : "bg-green-700 hover:bg-green-800 text-white",
                          )}
                        >
                          {producer.isFollowing ? (
                            <>
                              <Heart className="h-3 w-3 mr-1 fill-current" />{" "}
                              Following
                            </>
                          ) : (
                            <>
                              <Heart className="h-3 w-3 mr-1" /> Follow
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interaction History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-green-800">
                  Your Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactionHistory.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="border-b border-green-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          {interaction.type === "review" ? (
                            <Star className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                          ) : (
                            <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                          )}
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-green-800">
                                {interaction.type === "review"
                                  ? "Reviewed"
                                  : "Commented on"}
                              </span>
                              <span className="mx-1 text-green-700">•</span>
                              <span className="text-green-700">
                                {interaction.target}
                              </span>
                            </div>
                            <div className="text-sm text-green-600 mt-0.5">
                              {interaction.producer} • {interaction.date}
                            </div>
                          </div>
                        </div>
                        {interaction.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < interaction.rating
                                    ? "text-amber-500 fill-current"
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-green-700 pl-7">
                        {interaction.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Token Rewards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-green-800">
                  Token Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mr-4">
                    <Award className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Badge className={cn(
                        "font-medium",
                        tokenInfo.tier === "Bronze" && "bg-amber-600 text-white",
                        tokenInfo.tier === "Silver" && "bg-slate-400 text-white",
                        tokenInfo.tier === "Gold" && "bg-yellow-500 text-white",
                        tokenInfo.tier === "Platinum" && "bg-purple-600 text-white"
                      )}>
                        {tokenInfo.tier} Tier
                      </Badge>
                      <Link
                        to="/rewards"
                        className="ml-2 text-xs text-amber-600 hover:text-amber-700"
                      >
                        View Benefits
                      </Link>
                    </div>
                    <div className="flex items-center mt-1">
                      <Coins className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium text-green-800">
                        {tokenInfo.balance} $FCUK
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-green-700">
                        {tierProgress.nextTier
                          ? `Progress to ${tierProgress.nextTier} Tier`
                          : "Maximum Tier Achieved!"}
                      </span>
                      <span className="text-green-800 font-medium">
                        {tokenInfo.balance} $FCUK
                      </span>
                    </div>
                    <Progress
                      value={tierProgress.progress}
                      className="h-2 bg-amber-100"
                    />
                    <p className="text-xs text-green-600 mt-1">
                      {tierProgress.nextTier
                        ? `${tierProgress.tokensNeeded} more tokens to ${tierProgress.nextTier}`
                        : "You've reached the highest tier!"}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">
                        Monthly Savings
                      </span>
                      <span className="text-green-800 font-medium">
                        £{userData.monthlySavings.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      With your Silver Tier discount
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to="/rewards">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      <Coins className="h-4 w-4 mr-2" /> View Token Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-green-800">
                  Location Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-green-800 font-medium">
                        Delivery Radius
                      </span>
                      <span className="text-green-800">
                        {userData.deliveryRadius} km
                      </span>
                    </div>
                    <div className="h-24 bg-green-50 rounded-lg flex items-center justify-center mb-2">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm text-green-600">
                      You\'ll see producers and products within this distance
                      from your location.
                    </p>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Edit className="h-4 w-4 mr-2" /> Update Location
                    Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-green-800">
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/orders">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-green-700 hover:text-green-900 hover:bg-green-50"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" /> Order History
                    </Button>
                  </Link>
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-green-700 hover:text-green-900 hover:bg-green-50"
                    >
                      <Heart className="h-4 w-4 mr-2" /> Saved Producers &
                      Products
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-green-700 hover:text-green-900 hover:bg-green-50"
                    >
                      <Settings className="h-4 w-4 mr-2" /> Account Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsumerProfile;
