
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Filter, ShoppingBag } from "lucide-react";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// --- DATA (Moved outside component) ---
const products = [
  {
    id: "1",
    name: "Organic Carrots",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    price: 2.49,
    unit: "bunch",
    distance: 3.2,
    producer: {
      name: "Green Valley Farm",
      rating: 4.8,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley",
    },
    description:
      "Freshly harvested organic carrots grown without pesticides. Sweet and crunchy, perfect for salads or roasting.",
    category: "vegetables",
  },
  {
    id: "2",
    name: "Free-Range Eggs",
    image:
      "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
    price: 3.99,
    unit: "dozen",
    distance: 5.7,
    producer: {
      name: "Hillside Farm",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hillside",
    },
    description:
      "Free-range eggs from happy hens that roam freely on our pastures. Rich in flavor with vibrant orange yolks.",
    category: "dairy",
  },
  {
    id: "3",
    name: "Wildflower Honey",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80",
    price: 6.5,
    unit: "jar",
    distance: 2.9,
    producer: {
      name: "Meadow Honey",
      rating: 4.7,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meadow",
    },
    description:
      "Raw, unfiltered wildflower honey collected from our sustainable apiaries. Perfect for tea, baking, or straight from the jar.",
    category: "specialty",
  },
  {
    id: "4",
    name: "Heritage Tomatoes",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&q=80",
    price: 4.25,
    unit: "500g",
    distance: 4.1,
    producer: {
      name: "Riverside Organics",
      rating: 4.6,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riverside",
    },
    description:
      "A colorful mix of heritage tomato varieties bursting with flavor. Grown using traditional methods and harvested at peak ripeness.",
    category: "vegetables",
  },
  {
    id: "5",
    name: "Artisan Sourdough",
    image:
      "https://images.unsplash.com/photo-1585478259715-1c093a7b70d3?w=800&q=80",
    price: 4.99,
    unit: "loaf",
    distance: 6.3,
    producer: {
      name: "Village Bakery",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Village",
    },
    description:
      "Traditional sourdough bread made with our 10-year-old starter. Naturally leavened and baked in a wood-fired oven for perfect crust and texture.",
    category: "bakery",
  },
  {
    id: "6",
    name: "Fresh Goat Cheese",
    image:
      "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&q=80",
    price: 5.75,
    unit: "200g",
    distance: 7.8,
    producer: {
      name: "Hillside Dairy",
      rating: 4.8,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HillsideDairy",
    },
    description:
      "Creamy, tangy goat cheese made in small batches from our own herd of free-range goats. Perfect for salads or spreading on crackers.",
    category: "dairy",
  },
  {
    id: "7",
    name: "Seasonal Berry Mix",
    image:
      "https://images.unsplash.com/photo-1563746924237-f4471479790f?w=800&q=80",
    price: 5.99,
    unit: "punnet",
    distance: 3.5,
    producer: {
      name: "Berry Fields",
      rating: 4.7,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=BerryFields",
    },
    description:
      "A delicious mix of seasonal berries including strawberries, raspberries, and blackberries. Picked at peak ripeness for maximum flavor.",
    category: "fruit",
  },
  {
    id: "8",
    name: "Fresh Herb Bundle",
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4b11f158?w=800&q=80",
    price: 3.5,
    unit: "bundle",
    distance: 2.1,
    producer: {
      name: "Riverside Herbs",
      rating: 4.6,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiversideHerbs",
    },
    description:
      "Fresh-cut culinary herbs including rosemary, thyme, sage, and parsley. Grown using organic methods to ensure the best flavor for your cooking.",
    category: "herbs",
  },
  {
    id: "9",
    name: "Grass-Fed Beef Steaks",
    image:
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&q=80",
    price: 12.99,
    unit: "500g",
    distance: 8.4,
    producer: {
      name: "Meadow Farm",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MeadowFarm",
    },
    description:
      "Premium grass-fed beef steaks from our ethically raised cattle. Tender, flavorful, and perfect for a special meal.",
    category: "meat",
  },
  {
    id: "10",
    name: "Apple Cider Vinegar",
    image:
      "https://images.unsplash.com/photo-1598346762291-aee88549193f?w=800&q=80",
    price: 4.25,
    unit: "bottle",
    distance: 5.2,
    producer: {
      name: "Orchard Press",
      rating: 4.7,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=OrchardPress",
    },
    description:
      "Raw, unfiltered apple cider vinegar with the mother, made from our heritage apple varieties. Great for dressings, marinades, or as a daily tonic.",
    category: "specialty",
  },
  {
    id: "11",
    name: "Fresh Asparagus",
    image:
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&q=80",
    price: 4.5,
    unit: "bunch",
    distance: 4.7,
    producer: {
      name: "Green Fields",
      rating: 4.8,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenFields",
    },
    description:
      "Tender spring asparagus, hand-harvested at the perfect moment. Delicious grilled, roasted, or in salads.",
    category: "vegetables",
  },
  {
    id: "12",
    name: "Raw Milk",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
    price: 3.25,
    unit: "liter",
    distance: 6.9,
    producer: {
      name: "Oak Lane Dairy",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=OakLane",
    },
    description:
      "Fresh, unpasteurized milk from our grass-fed Jersey cows. Rich, creamy, and full of natural goodness.",
    category: "dairy",
  },
];
const categories = [
  { value: "all", label: "All Products" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruit", label: "Fruit" },
  { value: "dairy", label: "Dairy & Eggs" },
  { value: "meat", label: "Meat" },
  { value: "bakery", label: "Bakery" },
  { value: "herbs", label: "Herbs" },
  { value: "specialty", label: "Specialty" },
];

// --- HOOK (Business Logic) ---
const useMarketplaceLogic = () => {
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTokenDeals, setShowTokenDeals] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesDistance = product.distance <= maxDistance;
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.producer.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistance && matchesCategory && matchesSearch;
    });
  }, [maxDistance, selectedCategory, searchQuery]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, quantity) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity }]);
    }

    setIsModalOpen(false);
    // You could add a toast notification here
  };
  
  const resetFilters = () => {
    setMaxDistance(50);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return {
    // State
    maxDistance,
    selectedCategory,
    showTokenDeals,
    selectedProduct,
    isModalOpen,
    searchQuery,
    filteredProducts,
    
    // State Setters
    setMaxDistance,
    setSelectedCategory,
    setShowTokenDeals,
    setSearchQuery,
    
    // Handlers
    handleProductClick,
    handleCloseModal,
    handleAddToCart,
    resetFilters,
  };
};

// --- UI COMPONENTS ---
const ProductCard = ({ product, onClick }) => {
  return (
    <Card className="h-full overflow-hidden border border-green-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden bg-green-50">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-sm font-medium text-green-800">
          <MapPin className="h-3.5 w-3.5 mr-1 text-green-600" />
          <span>{product.distance} km</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-medium text-lg text-green-900">
            {product.name}
          </h3>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {product.producer.rating}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-green-800 font-medium">
            £{product.price.toFixed(2)}{" "}
            <span className="text-sm text-green-600">/ {product.unit}</span>
          </p>
          <div className="flex items-center text-sm text-green-700">
            <span className="truncate max-w-[100px]">
              {product.producer.name}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onClick}
          className="w-full bg-green-700 hover:bg-green-800 text-white"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          View Product
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  // Reset quantity when modal opens for a new product
  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-green-800">
            {product.name}
          </DialogTitle>
          <DialogDescription className="flex items-center text-green-700">
            <span className="flex items-center mr-4">
              <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
              {product.producer.rating}
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 text-green-600 mr-1" />
              {product.distance} km away
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square overflow-hidden rounded-md bg-green-50">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <p className="text-2xl font-medium text-green-800 mb-2">
                £{product.price.toFixed(2)}{" "}
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
                <img
                  src={product.producer.image}
                  alt={product.producer.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-green-800">
                  From {product.producer.name}
                </span>
              </div>
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
                    Earn 5 tokens with this purchase!
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
                onClick={() => onAddToCart(product, quantity)}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-6"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart - £{(product.price * quantity).toFixed(2)}
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
    maxDistance,
    selectedCategory,
    showTokenDeals,
    selectedProduct,
    isModalOpen,
    searchQuery,
    filteredProducts,
    setMaxDistance,
    setSelectedCategory,
    setShowTokenDeals,
    setSearchQuery,
    handleProductClick,
    handleCloseModal,
    handleAddToCart,
    resetFilters,
  } = useMarketplaceLogic();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-green-800 mb-4">
            Local Marketplace
          </h1>
          <p className="text-green-700 max-w-3xl">
            Browse fresh, seasonal produce from local growers within your area.
            Support sustainable farming and enjoy the best quality food.
          </p>
        </div>

        {/* Filters Section */}
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
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-green-800">
                  Token Holder Deals
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-green-700">
            Showing{" "}
            <span className="font-medium">{filteredProducts.length}</span>{" "}
            products within <span className="font-medium">{maxDistance}km</span>
            {searchQuery && (
              <>
                {" "}
                matching <span className="font-medium">"{searchQuery}"</span>
              </>
            )}
          </p>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-green-700 mr-2" />
            <span className="text-green-700">Sort by: </span>
            <select className="ml-2 bg-transparent text-green-800 font-medium focus:outline-none">
              <option>Distance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
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
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  );
};

export default Marketplace;
