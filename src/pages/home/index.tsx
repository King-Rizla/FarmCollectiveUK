
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useHomePage } from "@/hooks/useHomePage";

const HomePage: React.FC = () => {
  const { featuredProducers, featuredProducts } = useHomePage();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <div className="bg-white text-green-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-green-50/50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-green-900 mb-4">
            Fresh from the Farm, Delivered to You
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-green-700 mb-8">
            Discover and support local producers. Enjoy fresh, seasonal, and
            sustainably sourced food while strengthening your community.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for producers, products, or locations..."
              className="w-full pl-12 pr-32 py-4 rounded-full border border-green-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-2 bg-green-700 hover:bg-green-800 text-white"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-green-800">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-green-100 rounded-full">
                <Search className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Local</h3>
              <p className="text-green-700">
                Find local farmers, bakers, and artisans in your area. Read
                their stories and see what's fresh.
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-green-100 rounded-full">
                <ShoppingCart className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop Online</h3>
              <p className="text-green-700">
                Easily browse and purchase products through our online marketplace.
                Pay securely and conveniently.
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4 inline-block p-4 bg-green-100 rounded-full">
                <Avatar className="h-8 w-8 bg-green-700 text-white">
                  <AvatarFallback>🤝</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Collect</h3>
              <p className="text-green-700">
                Arrange for local pickup or delivery. Connect directly with the
                people who grow and make your food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Producers Section */}
      <section className="py-16 bg-green-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-green-800">
              Featured Producers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducers.map((producer) => (
              <Card key={producer.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <img
                  src={producer.image}
                  alt={producer.name}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-white shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${producer.name.split(' ')[0]}`} />
                      <AvatarFallback>{producer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {producer.name}
                      </h3>
                      <p className="text-sm text-green-600">
                        {producer.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {producer.description}
                  </p>
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold mb-2">Top Products</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {producer.products.map((product) => (
                        <li key={product.name} className="flex justify-between">
                          <span>{product.name}</span>
                          <span className="font-medium">£{product.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-green-800">
              Popular This Week
            </h2>
            <Link to="/marketplace">
              <Button
                variant="ghost"
                className="text-green-700 hover:text-green-900"
              >
                Go to Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 w-full overflow-hidden bg-green-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-green-600 mb-2">
                    {product.producer}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-800">
                      £{product.price.toFixed(2)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <Link to="/marketplace">
                    <Button className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white">
                      View in Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-serif font-semibold mb-4">
            Join the Farmily Community
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-green-100 mb-8">
            Are you a local producer? Or a conscious consumer? Be part of a
            movement that's changing how we eat, one community at a time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-green-800 hover:bg-green-100"
              >
                I'm a Producer
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-green-800"
              >
                I'm a Consumer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
