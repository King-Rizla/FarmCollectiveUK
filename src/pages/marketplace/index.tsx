/**
 * Marketplace Page
 * Browse and purchase products from local producers
 */

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Filter, ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getAllProducts, getGrowingProducts } from "@/services/products";
import { calculatePurchaseTokens } from "@/services/tokens";
import { Product, PRODUCT_CATEGORIES, ProductCategory } from "@/types/database";
import { GrowingCard } from "@/components/marketplace/growing-card";

// Categories with "all" option
const categories = [
  { value: "all", label: "All Products" },
  ...PRODUCT_CATEGORIES,
];

// --- HOOK (Business Logic) ---
const useMarketplaceLogic = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [growingProducts, setGrowingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showTokenDeals, setShowTokenDeals] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"shop" | "growing">("shop");
  const [sortBy, setSortBy] = useState<"distance" | "price-low" | "price-high" | "rating">("distance");

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedProducts, fetchedGrowing] = await Promise.all([
          getAllProducts(),
          getGrowingProducts(),
        ]);

        // Filter out growing products from main list and add mock distance
        const availableProducts = fetchedProducts
          .filter((p) => p.productType !== "growing")
          .map((p) => ({
            ...p,
            distance: Math.random() * 15 + 1, // Random 1-16 km for demo
          }));

        const growingWithDistance = fetchedGrowing.map((p) => ({
          ...p,
          distance: Math.random() * 15 + 1,
        }));

        setProducts(availableProducts);
        setGrowingProducts(growingWithDistance);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesDistance = (product.distance || 0) <= maxDistance;
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.producerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistance && matchesCategory && matchesSearch;
    });

    // Sort based on sortBy selection
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.producerRating || 0) - (a.producerRating || 0);
        default:
          return 0;
      }
    });
  }, [products, maxDistance, selectedCategory, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const resetFilters = () => {
    setMaxDistance(50);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return {
    products,
    growingProducts,
    loading,
    error,
    maxDistance,
    selectedCategory,
    showTokenDeals,
    selectedProduct,
    isModalOpen,
    searchQuery,
    filteredProducts,
    activeTab,
    sortBy,
    setActiveTab,
    setSortBy,
    setMaxDistance,
    setSelectedCategory,
    setShowTokenDeals,
    setSearchQuery,
    handleProductClick,
    handleCloseModal,
    resetFilters,
  };
};

// --- UI COMPONENTS ---
const ProductCardSkeleton = () => (
  <Card className="h-full overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card className="h-full overflow-hidden border border-green-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden bg-green-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {product.distance && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-sm font-medium text-green-800">
            <MapPin className="h-3.5 w-3.5 mr-1 text-green-600" />
            <span>{product.distance.toFixed(1)} km</span>
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-medium text-lg text-green-900">
            {product.name}
          </h3>
          {product.producerRating && (
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium">
                {product.producerRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-green-800 font-medium">
            {product.price.toFixed(2)}{" "}
            <span className="text-sm text-green-600">/ {product.unit}</span>
          </p>
          <div className="flex items-center text-sm text-green-700">
            <span className="truncate max-w-[100px]">
              {product.producerName}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onClick}
          className="w-full bg-green-700 hover:bg-green-800 text-white"
          disabled={!product.isAvailable}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {product.isAvailable ? "View Product" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { session } = useAuth();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
      onClose();
    } finally {
      setAdding(false);
    }
  };

  // Reset quantity when modal opens for a new product
  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  const tokensEarned = calculatePurchaseTokens(product.price * quantity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-green-800">
            {product.name}
          </DialogTitle>
          <DialogDescription className="flex items-center text-green-700">
            {product.producerRating && (
              <span className="flex items-center mr-4">
                <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                {product.producerRating.toFixed(1)}
              </span>
            )}
            {product.distance && (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 text-green-600 mr-1" />
                {product.distance.toFixed(1)} km away
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square overflow-hidden rounded-md bg-green-50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <p className="text-2xl font-medium text-green-800 mb-2">
                {product.price.toFixed(2)}{" "}
                <span className="text-sm text-green-600">
                  / {product.unit}
                </span>
              </p>

              <div className="flex items-center mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="border-green-200 text-green-800"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 mx-2 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="border-green-200 text-green-800"
                >
                  +
                </Button>
                <span className="ml-2 text-green-700">{product.unit}</span>
              </div>

              <div className="flex items-center mb-4">
                {product.producerAvatar && (
                  <img
                    src={product.producerAvatar}
                    alt={product.producerName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span className="text-green-800">
                  From {product.producerName}
                </span>
              </div>

              <p className="text-sm text-green-600 mb-2">
                {product.stockQuantity} in stock
              </p>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-green-50">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-green-800">{product.description}</p>
                <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">$FCUK Token Rewards:</span>{" "}
                    Earn {tokensEarned} tokens with this purchase!
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div className="p-3 border border-green-100 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-amber-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium text-green-800">
                        Sarah J.
                      </span>
                      <span className="text-sm text-green-600 ml-2">
                        2 weeks ago
                      </span>
                    </div>
                    <p className="text-green-800">
                      Absolutely delicious! So fresh and flavorful, you can
                      really taste the difference compared to supermarket
                      produce.
                    </p>
                  </div>

                  <div className="p-3 border border-green-100 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-amber-500 mr-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <Star className="h-4 w-4 fill-current opacity-30" />
                      </div>
                      <span className="font-medium text-green-800">
                        Mark T.
                      </span>
                      <span className="text-sm text-green-600 ml-2">
                        1 month ago
                      </span>
                    </div>
                    <p className="text-green-800">
                      Great quality as always. Quick delivery and excellent
                      customer service from the producer.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-auto pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-6"
                size="lg"
                disabled={adding || !session}
              >
                {adding ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingBag className="h-5 w-5 mr-2" />
                )}
                {session
                  ? `Add to Cart - ${(product.price * quantity).toFixed(2)}`
                  : "Sign in to Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN COMPONENT (View Layer) ---
const Marketplace = () => {
  const {
    loading,
    error,
    maxDistance,
    selectedCategory,
    showTokenDeals,
    selectedProduct,
    isModalOpen,
    searchQuery,
    filteredProducts,
    growingProducts,
    activeTab,
    sortBy,
    setActiveTab,
    setSortBy,
    setMaxDistance,
    setSelectedCategory,
    setShowTokenDeals,
    setSearchQuery,
    handleProductClick,
    handleCloseModal,
    resetFilters,
  } = useMarketplaceLogic();

  const { itemCount, addToCart } = useCart();
  const { session } = useAuth();

  const handleReserveShare = (product: Product) => {
    if (!session) {
      // Could redirect to signin
      return;
    }
    // Add to cart as a reservation
    addToCart({
      ...product,
      unit: "share",
    }, 1);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-green-800 mb-4">
            Local Marketplace
          </h1>
          <p className="text-green-700 max-w-3xl mb-6">
            Browse fresh, seasonal produce from local growers within your area.
            Support sustainable farming and enjoy the best quality food.
          </p>

          {/* Shop/Growing Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "shop" ? "default" : "outline"}
              onClick={() => setActiveTab("shop")}
              className={cn(
                activeTab === "shop"
                  ? "bg-green-700 hover:bg-green-800"
                  : "border-green-200 text-green-700 hover:bg-green-50"
              )}
            >
              Shop Now ({filteredProducts.length})
            </Button>
            <Button
              variant={activeTab === "growing" ? "default" : "outline"}
              onClick={() => setActiveTab("growing")}
              className={cn(
                activeTab === "growing"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-amber-200 text-amber-700 hover:bg-amber-50"
              )}
            >
              Coming Soon ({growingProducts.length})
            </Button>
          </div>
        </div>

        {/* Filters Section - Only show for Shop tab */}
        {activeTab === "shop" && (
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Search Products or Producers
                </label>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-green-200"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-9 rounded-md border border-green-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Maximum Distance: {maxDistance} km
                </label>
                <Slider
                  value={[maxDistance]}
                  min={5}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  className="py-2"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTokenDeals}
                    onChange={() => setShowTokenDeals(!showTokenDeals)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium text-green-800">
                    Token Holder Deals
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Growing Tab Description */}
        {activeTab === "growing" && (
          <div className="bg-amber-50 rounded-xl p-6 mb-8 border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">Pre-Order Your Share</h2>
            <p className="text-amber-700">
              Reserve shares of upcoming harvests! Pay upfront to secure your produce and
              help local farmers plan their growing season. You'll be notified when your
              order is ready for pickup or delivery.
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className={activeTab === "shop" ? "text-green-700" : "text-amber-700"}>
            {loading ? (
              "Loading products..."
            ) : activeTab === "shop" ? (
              <>
                Showing{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                products within <span className="font-medium">{maxDistance}km</span>
                {searchQuery && (
                  <>
                    {" "}
                    matching <span className="font-medium">"{searchQuery}"</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span className="font-medium">{growingProducts.length}</span>{" "}
                upcoming harvests available for pre-order
              </>
            )}
          </p>

          <div className="flex items-center gap-4">
            {itemCount > 0 && (
              <Link to="/cart">
                <Button variant="outline" className="border-green-200">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart ({itemCount})
                </Button>
              </Link>
            )}
            {activeTab === "shop" && (
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-green-700 mr-2" />
                <span className="text-green-700">Sort by: </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "distance" | "price-low" | "price-high" | "rating")}
                  className="ml-2 bg-transparent text-green-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="distance">Distance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Shop Products Grid */}
        {!loading && !error && activeTab === "shop" && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}

        {/* Growing Products Grid */}
        {!loading && !error && activeTab === "growing" && growingProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {growingProducts.map((product) => (
              <GrowingCard
                key={product.id}
                product={product}
                onReserve={handleReserveShare}
              />
            ))}
          </div>
        )}

        {/* Empty State - Shop Tab */}
        {!loading && !error && activeTab === "shop" && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-green-800 mb-4">
              No products found matching your criteria
              {searchQuery && (
                <>
                  {" "}
                  for <span className="font-medium">"{searchQuery}"</span>
                </>
              )}
            </p>
            <Button
              onClick={resetFilters}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Empty State - Growing Tab */}
        {!loading && !error && activeTab === "growing" && growingProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-lg text-amber-800 mb-2">No upcoming harvests yet</p>
            <p className="text-amber-600 mb-4">
              Check back soon! Local producers are always planning new crops.
            </p>
            <Button
              onClick={() => setActiveTab("shop")}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Browse Available Products
            </Button>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export default Marketplace;
