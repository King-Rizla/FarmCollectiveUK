import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Star,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Award,
  Coins,
  MessageCircle,
  Settings,
  Image as ImageIcon,
  ChevronRight,
  ShoppingBag,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data
const producerData = {
  name: "Willow Grove Market Garden",
  username: "willowgrove",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
  coverImage:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  location: "Kent, UK",
  bio: "Family-run organic market garden specializing in heritage vegetables, herbs, and edible flowers. Practicing regenerative agriculture since 2015.",
  joinDate: "January 2022",
  tokenBalance: 780,
  tokenTier: "Gold",
  monthlySales: 342.5,
  monthlySavings: 17.13,
  rating: 4.8,
  reviewCount: 32,
};

const products = [
  {
    id: "1",
    name: "Heritage Tomato Mix",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80",
    price: 4.25,
    unit: "500g",
    quantity: 15,
    description:
      "A colorful mix of heritage tomato varieties bursting with flavor. Grown using traditional methods and harvested at peak ripeness.",
  },
  {
    id: "2",
    name: "Fresh Herb Bundle",
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4b11f158?w=400&q=80",
    price: 3.5,
    unit: "bundle",
    quantity: 8,
    description:
      "Fresh-cut culinary herbs including rosemary, thyme, sage, and parsley. Grown using organic methods to ensure the best flavor for your cooking.",
  },
  {
    id: "3",
    name: "Edible Flower Mix",
    image:
      "https://images.unsplash.com/photo-1515545255053-fded3e3b5b00?w=400&q=80",
    price: 5.99,
    unit: "punnet",
    quantity: 5,
    description:
      "Beautiful and delicious edible flowers to garnish salads, desserts, and cocktails. Includes nasturtiums, violas, and calendula.",
  },
  {
    id: "4",
    name: "Seasonal Salad Greens",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    price: 3.75,
    unit: "200g",
    quantity: 20,
    description:
      "A mix of seasonal salad greens including baby lettuce, arugula, and spinach. Harvested fresh each morning.",
  },
];

const reviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    product: "Heritage Tomato Mix",
    content:
      "These tomatoes are incredible! So much flavor compared to supermarket varieties. Will definitely order again.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: "2",
    author: "Mark Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
    product: "Fresh Herb Bundle",
    content:
      "The herbs were very fresh and aromatic. They really elevated my cooking. The packaging was also eco-friendly which I appreciate.",
    rating: 4,
    date: "1 month ago",
  },
  {
    id: "3",
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    product: "Edible Flower Mix",
    content:
      "Beautiful flowers that made my salad look and taste amazing! My dinner guests were so impressed.",
    rating: 5,
    date: "1 month ago",
  },
];

const socialPosts = [
  {
    id: "1",
    content:
      "Just harvested our first batch of heritage tomatoes for the season! They're looking absolutely beautiful and will be available at the marketplace tomorrow. 🍅",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80",
    likes: 24,
    comments: 5,
    date: "2 days ago",
  },
  {
    id: "2",
    content:
      "We're hosting a herb growing workshop next Saturday! Learn how to grow your own culinary herbs at home, plus take home a starter kit with 5 different herb seedlings. Limited spots available - book through our profile. #GrowYourOwn",
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4b11f158?w=400&q=80",
    likes: 18,
    comments: 7,
    date: "1 week ago",
  },
];

const ProducerProfile = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    quantity: "",
    description: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would add the product to the database
    console.log("New product:", newProduct);
    // Reset form
    setNewProduct({
      name: "",
      price: "",
      unit: "",
      quantity: "",
      description: "",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        isLoggedIn={true}
        username={producerData.name}
        avatarUrl={producerData.avatar}
      />

      <main className="container mx-auto px-4 py-8 md:py-24">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden h-48 mb-6 relative">
            <img
              src={producerData.coverImage}
              alt="Farm cover"
              className="w-full h-full object-cover"
            />
            <Button
              className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-green-800 hover:bg-white"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" /> Change Cover
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white -mt-12 md:mt-0 shadow-md">
              <AvatarImage src={producerData.avatar} alt={producerData.name} />
              <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl">
                {producerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-serif font-semibold text-green-800">
                    {producerData.name}
                  </h1>
                  <div className="flex items-center text-green-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{producerData.location}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                      <span>{producerData.rating}</span>
                      <span className="ml-1">
                        ({producerData.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                  <Settings className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </div>

              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <p className="text-green-800">{producerData.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-green-50">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="md:col-span-2">
                {/* Analytics Overview */}
                <Card className="mb-8">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-serif text-green-800">
                        Analytics Overview
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="h-5 w-5 text-green-700 mr-2" />
                          <h3 className="font-medium text-green-800">
                            Monthly Sales
                          </h3>
                        </div>
                        <p className="text-2xl font-semibold text-green-900">
                          £{producerData.monthlySales.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          +12% from last month
                        </p>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Coins className="h-5 w-5 text-amber-600 mr-2" />
                          <h3 className="font-medium text-amber-800">
                            Token Balance
                          </h3>
                        </div>
                        <p className="text-2xl font-semibold text-amber-900">
                          {producerData.tokenBalance}
                        </p>
                        <div className="flex items-center text-sm text-amber-600">
                          <Award className="h-4 w-4 mr-1" />
                          {producerData.tokenTier} Tier
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="font-medium text-blue-800">
                            Carbon Savings
                          </h3>
                        </div>
                        <p className="text-2xl font-semibold text-blue-900">
                          {producerData.monthlySavings} kg
                        </p>
                        <p className="text-sm text-blue-600">
                          CO₂ saved this month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Listings */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-serif text-green-800">
                        My Product Listings
                      </CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 w-[200px] bg-white border-green-200 focus-visible:ring-green-500"
                            value={searchValue}
                            onChange={handleSearchChange}
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="text-green-700 border-green-200 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Bulk Products
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No products found matching "{searchValue}"
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                          <Card
                            key={product.id}
                            className="overflow-hidden border-green-100 hover:border-green-200 transition-all duration-300"
                          >
                            <div className="relative aspect-video overflow-hidden bg-green-50">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                  <Edit className="h-4 w-4 text-green-700" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 text-green-700" />
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-green-800">
                                  {product.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  £{product.price.toFixed(2)} / {product.unit}
                                </Badge>
                              </div>
                              <p className="text-sm text-green-600 mb-3">
                                Stock: {product.quantity} {product.unit}s
                                available
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Add New Product
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Profile Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-green-800">
                      Profile Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-700">
                          Profile Completion
                        </span>
                        <span className="text-green-900 font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2 bg-green-100" />
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-green-800 mb-3">
                        Ratings
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4 fill-current",
                                i >= Math.floor(producerData.rating) &&
                                  "fill-none text-gray-300",
                              )}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-green-800">
                          {producerData.rating} ({producerData.reviewCount}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-green-800 mb-3">
                        Account Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Member Since</span>
                          <span className="text-green-800">
                            {producerData.joinDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Username</span>
                          <span className="text-green-800">
                            @{producerData.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-green-800">
                      Recent Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="pb-4 border-b border-green-100 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={review.avatar}
                                alt={review.author}
                              />
                              <AvatarFallback className="bg-amber-100 text-amber-800">
                                {review.author.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-green-800">
                                    {review.author}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {review.date}
                                  </p>
                                </div>
                                <div className="flex text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-3 w-3 fill-current",
                                        i >= review.rating &&
                                          "fill-none text-gray-300",
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm mt-1 text-gray-600">
                                <span className="text-green-700 font-medium">
                                  Product: {review.product}
                                </span>
                              </p>
                              <p className="text-sm mt-1">{review.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full text-green-700 border-green-200 hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" /> View All
                      Reviews
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="p-6 bg-white rounded-lg border border-green-100">
              <h3 className="text-xl font-serif text-green-800 mb-4">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">Detailed analytics coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-green-800">
                      Social Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {socialPosts.map((post) => (
                        <div
                          key={post.id}
                          className="pb-6 border-b border-green-100 last:border-0 last:pb-0"
                        >
                          <p className="text-sm mb-3">{post.content}</p>
                          {post.image && (
                            <div className="rounded-lg overflow-hidden mb-3">
                              <img
                                src={post.image}
                                alt="Post"
                                className="w-full h-auto"
                              />
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.likes} likes</span>
                            <span className="mx-2">•</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Create New Update
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-green-800">
                      Community Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">
                          Engagement Stats
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Posts</span>
                            <span className="text-green-800 font-medium">
                              12
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Likes</span>
                            <span className="text-green-800 font-medium">
                              248
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Comments
                            </span>
                            <span className="text-green-800 font-medium">
                              86
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProducerProfile;
