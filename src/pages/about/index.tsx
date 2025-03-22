import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Users,
  TrendingUp,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-green-800 mb-6">
            About The Farm Collective UK
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            We're on a mission to reconnect communities with their food, reward
            ethical farming, and eliminate supermarket control.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-semibold text-green-800 mb-6">
                Our Story
              </h2>
              <p className="text-green-700 mb-4">
                The Farm Collective UK was born from a simple observation: the
                disconnect between local food producers and consumers was
                growing wider, while supermarket chains were gaining more
                control and taking larger profits.
              </p>
              <p className="text-green-700 mb-4">
                Founded in 2022 by a group of farmers, technologists, and food
                enthusiasts, we set out to create a platform that would bring
                the farm gate directly to consumers' doors while ensuring
                farmers receive fair compensation for their hard work.
              </p>
              <p className="text-green-700">
                Our innovative token reward system was designed to incentivize
                community participation and create a truly sustainable local
                food economy that benefits everyone involved.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
                alt="Farmers at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Why We Exist */}
        <div className="mb-20 bg-green-50 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-8 text-center">
            Why We Exist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <Truck className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Food Miles Crisis
                  </h3>
                  <p className="text-green-700">
                    The average food item travels over 1,000 miles before
                    reaching your plate, resulting in unnecessary carbon
                    emissions and reduced freshness.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Price Gouging
                  </h3>
                  <p className="text-green-700">
                    Supermarkets and middlemen take up to 70% of the retail
                    price, leaving farmers with minimal profits despite doing
                    the hardest work.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Community Disconnect
                  </h3>
                  <p className="text-green-700">
                    Most consumers have no relationship with the people who grow
                    their food, leading to a lack of understanding about
                    seasonal eating and sustainable practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-8 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Sustainability
                </h3>
                <p className="text-green-700">
                  We prioritize environmentally responsible farming practices
                  and minimal packaging. Our platform reduces food miles by
                  connecting you with the closest producers.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Transparency
                </h3>
                <p className="text-green-700">
                  We believe you should know exactly where your food comes from
                  and how it was grown. Every producer profile includes detailed
                  information about their practices.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Community
                </h3>
                <p className="text-green-700">
                  Food brings people together. Our platform fosters connections
                  between producers and consumers, creating a community that
                  supports local agriculture.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Fair Compensation
                </h3>
                <p className="text-green-700">
                  We ensure farmers receive fair payment for their hard work by
                  eliminating unnecessary middlemen and keeping our platform
                  fees minimal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-8 text-center">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                  alt="James Wilson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-1">
                James Wilson
              </h3>
              <p className="text-green-600 mb-3">Co-Founder & CEO</p>
              <p className="text-green-700 text-sm">
                Former organic farmer with 15 years of experience in sustainable
                agriculture and a passion for technology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-1">
                Sarah Johnson
              </h3>
              <p className="text-green-600 mb-3">Co-Founder & CTO</p>
              <p className="text-green-700 text-sm">
                Blockchain specialist with a background in developing
                decentralized applications for social impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                  alt="Michael Thompson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-1">
                Michael Thompson
              </h3>
              <p className="text-green-600 mb-3">Head of Producer Relations</p>
              <p className="text-green-700 text-sm">
                Agricultural economist with extensive experience in helping
                small-scale farmers build sustainable businesses.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-3">
            Join Our Mission
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            Whether you're a consumer looking for fresh, local food or a
            producer wanting to reach more customers, we invite you to be part
            of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-green-700 hover:bg-green-800 text-white">
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
            <Button
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-50"
            >
              <Link to="/grower">Join as a Grower</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
