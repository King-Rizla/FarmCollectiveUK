/**
 * Producer Profile Page
 * Manage products, view analytics, and handle orders
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  ShoppingBag,
  Search,
  Loader2,
  Package,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  getProductsByProducer,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/products";
import { getProducerOrders } from "@/services/orders";
import { getUserTokenInfo } from "@/services/tokens";
import {
  Product,
  ProductFormData,
  PRODUCT_CATEGORIES,
  ProductCategory,
  Order,
  TokenTier,
} from "@/types/database";

// Product form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Mock data for initial display
const mockProducerData = {
  name: "Your Farm Name",
  username: "yourfarm",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Producer",
  coverImage:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  location: "Your Location, UK",
  bio: "Tell customers about your farm and what makes your produce special.",
  joinDate: "January 2024",
  monthlySales: 0,
  monthlySavings: 0,
  rating: 0,
  reviewCount: 0,
};

const ProductCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardContent className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

const ProducerProfile = () => {
  const navigate = useNavigate();
  const { session, profile, loading: authLoading, updateProfile, isProducer } = useAuth();
  const { toast } = useToast();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{ balance: number; tier: TokenTier }>({
    balance: 0,
    tier: "Bronze",
  });
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Producer data (merge profile with defaults)
  const producerData = {
    ...mockProducerData,
    name: profile?.name || profile?.full_name || mockProducerData.name,
    avatar: profile?.avatar || profile?.avatar_url || mockProducerData.avatar,
    coverImage: profile?.coverImage || mockProducerData.coverImage,
    location: profile?.location || mockProducerData.location,
    bio: profile?.bio || mockProducerData.bio,
    tokenBalance: tokenInfo.balance,
    tokenTier: tokenInfo.tier,
  };

  // Product form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      unit: "",
      category: "",
      imageUrl: "",
      stockQuantity: 0,
    },
  });

  const selectedCategory = watch("category");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.uid) return;

      setLoading(true);
      try {
        const [productsData, ordersData, tokenData] = await Promise.all([
          getProductsByProducer(session.uid),
          getProducerOrders(session.uid),
          getUserTokenInfo(session.uid),
        ]);

        setProducts(productsData);
        setOrders(ordersData);
        setTokenInfo(tokenData);
      } catch (error) {
        console.error("Error fetching producer data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please refresh.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && session) {
      fetchData();
    }
  }, [session?.uid, authLoading, toast]);

  // Redirect non-producers
  if (!authLoading && session && !isProducer) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto py-24 px-4">
          <Card className="max-w-lg mx-auto text-center p-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Become a Producer
              </h2>
              <p className="text-gray-600 mb-6">
                Activate your producer profile to start selling your products.
              </p>
              <Link to="/grower">
                <Button className="bg-green-700 hover:bg-green-800">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      searchValue === "" ||
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => {
    const producerItems = order.items.filter(
      (item) => item.producerId === session?.uid
    );
    return (
      sum +
      producerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    );
  }, 0);

  // Handle product form submission
  const onProductSubmit = async (data: ProductFormValues) => {
    if (!session?.uid) return;

    setSaving(true);
    try {
      const productData: ProductFormData = {
        name: data.name,
        description: data.description,
        price: data.price,
        unit: data.unit,
        category: data.category as ProductCategory,
        imageUrl: data.imageUrl,
        stockQuantity: data.stockQuantity,
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, ...productData, updatedAt: new Date() }
              : p
          )
        );
        toast({
          title: "Product updated",
          description: `${data.name} has been updated.`,
        });
      } else {
        // Create new product
        const newProduct = await createProduct(
          session.uid,
          producerData.name,
          producerData.avatar,
          producerData.rating || 4.5,
          productData
        );
        setProducts((prev) => [newProduct, ...prev]);
        toast({
          title: "Product created",
          description: `${data.name} is now listed on the marketplace.`,
        });
      }

      setIsProductDialogOpen(false);
      setEditingProduct(null);
      reset();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
    });
    setIsProductDialogOpen(true);
  };

  // Handle product delete
  const handleDeleteProduct = async (productId: string) => {
    setDeleting(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Product removed",
        description: "The product has been removed from the marketplace.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  // Handle new product
  const handleNewProduct = () => {
    setEditingProduct(null);
    reset({
      name: "",
      description: "",
      price: 0,
      unit: "",
      category: "",
      imageUrl: "",
      stockQuantity: 0,
    });
    setIsProductDialogOpen(true);
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: producerData.name,
        location: producerData.location,
        bio: producerData.bio,
        avatar: producerData.avatar,
        coverImage: producerData.coverImage,
      });
      setIsSheetOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-24">
        {/* Cover Image & Profile Header */}
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
              onClick={() => setIsSheetOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
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
                    {producerData.rating > 0 && (
                      <>
                        <span className="mx-2">*</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                          <span>{producerData.rating.toFixed(1)}</span>
                          <span className="ml-1">
                            ({producerData.reviewCount} reviews)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  className="bg-green-700 hover:bg-green-800 text-white"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </div>

              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <p className="text-green-800">{producerData.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-green-50">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {/* Quick Stats */}
                <Card className="mb-8">
                  <CardContent className="py-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-green-800">
                          {products.length}
                        </p>
                        <p className="text-sm text-gray-600">Products</p>
                      </div>
                      <div className="text-center border-x">
                        <p className="text-2xl font-semibold text-green-800">
                          {totalSales.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total Sales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-amber-600">
                          {tokenInfo.balance}
                        </p>
                        <p className="text-sm text-gray-600">$FCUK Tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Listings */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-serif text-green-800">
                        My Products
                      </CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 w-[200px] bg-white border-green-200"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <ProductCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          {searchValue
                            ? `No products matching "${searchValue}"`
                            : "No products yet"}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {searchValue
                            ? "Try a different search term"
                            : "Add your first product to start selling"}
                        </p>
                        {!searchValue && (
                          <Button
                            onClick={handleNewProduct}
                            className="bg-green-700 hover:bg-green-800"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Your First
                            Product
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                          <Card
                            key={product.id}
                            className="overflow-hidden border-green-100 hover:border-green-200 transition-all"
                          >
                            <div className="relative aspect-video overflow-hidden bg-green-50">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4 text-green-700" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-600"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={deleting === product.id}
                                >
                                  {deleting === product.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-green-700" />
                                  )}
                                </Button>
                              </div>
                              {!product.isAvailable && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
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
                                  {product.price.toFixed(2)} / {product.unit}
                                </Badge>
                              </div>
                              <p className="text-sm text-green-600 mb-1">
                                Stock: {product.stockQuantity} {product.unit}s
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
                    <Button
                      onClick={handleNewProduct}
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Product
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Token Card */}
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-800">
                      <Coins className="h-5 w-5 mr-2" />
                      $FCUK Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-amber-700 mb-2">
                      {tokenInfo.balance}
                    </p>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-800">{tokenInfo.tier} Tier</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-800">Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-gray-600">
                      * Add high-quality photos to attract more buyers
                    </p>
                    <p className="text-gray-600">
                      * Keep your stock quantities updated
                    </p>
                    <p className="text-gray-600">
                      * Write detailed descriptions about your produce
                    </p>
                    <p className="text-gray-600">
                      * Respond quickly to customer questions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Recent Orders</CardTitle>
                <CardDescription>
                  Orders containing your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500">
                      Orders will appear here when customers purchase your products.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 10).map((order) => {
                      const myItems = order.items.filter(
                        (item) => item.producerId === session?.uid
                      );
                      const myTotal = myItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      );

                      return (
                        <Card key={order.id} className="border-green-100">
                          <CardContent className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-green-800">
                                  Order #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.customerName} -{" "}
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <div className="mt-2 space-y-1">
                                  {myItems.map((item, idx) => (
                                    <p key={idx} className="text-sm text-gray-600">
                                      {item.quantity}x {item.name}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={cn(
                                    order.status === "paid" &&
                                      "bg-yellow-100 text-yellow-800",
                                    order.status === "shipped" &&
                                      "bg-blue-100 text-blue-800",
                                    order.status === "delivered" &&
                                      "bg-green-100 text-green-800"
                                  )}
                                >
                                  {order.status}
                                </Badge>
                                <p className="mt-2 font-medium text-green-800">
                                  {myTotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-50">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-800">
                        {totalSales.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">Total Sales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Coins className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-800">
                        {tokenInfo.balance}
                      </p>
                      <p className="text-sm text-amber-600">Tokens Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Package className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-800">
                        {orders.length}
                      </p>
                      <p className="text-sm text-blue-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Detailed Analytics Coming Soon
                </h3>
                <p className="text-gray-500">
                  Charts and insights will be available as you make more sales.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Update your farm profile information.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleProfileUpdate} className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name</Label>
                <Input
                  id="name"
                  defaultValue={producerData.name}
                  onChange={(e) =>
                    updateProfile({ name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue={producerData.location}
                  onChange={(e) =>
                    updateProfile({ location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={producerData.bio}
                  onChange={(e) =>
                    updateProfile({ bio: e.target.value })
                  }
                />
              </div>
              <SheetFooter>
                <Button type="submit" className="bg-green-700 hover:bg-green-800">
                  Save Changes
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update your product details"
                  : "Fill in the details to list a new product"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onProductSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Organic Carrots"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger
                      className={errors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ()</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="2.99"
                    {...register("price")}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="kg, bunch, dozen..."
                    {...register("unit")}
                    className={errors.unit ? "border-red-500" : ""}
                  />
                  {errors.unit && (
                    <p className="text-sm text-red-500">{errors.unit.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    placeholder="10"
                    {...register("stockQuantity")}
                    className={errors.stockQuantity ? "border-red-500" : ""}
                  />
                  {errors.stockQuantity && (
                    <p className="text-sm text-red-500">
                      {errors.stockQuantity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  {...register("imageUrl")}
                  className={errors.imageUrl ? "border-red-500" : ""}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500">
                    {errors.imageUrl.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Tip: Use Unsplash for free images (e.g.,
                  https://images.unsplash.com/photo-xxx)
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default ProducerProfile;
