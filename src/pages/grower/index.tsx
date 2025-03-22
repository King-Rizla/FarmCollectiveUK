import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  TrendingUp,
  BarChart,
  Users,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const JoinAsGrower = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-green-800 mb-6">
            Join The Farm Collective UK
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Connect directly with local consumers, set your own prices, and
            build a sustainable business with our innovative platform.
          </p>
          <div className="mt-8">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg"
              size="lg"
            >
              Apply to Join
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-10 text-center">
            Why Join Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Higher Profits
                  </h3>
                  <p className="text-green-700">
                    Keep up to 90% of your sale price compared to just 30%
                    through traditional retail channels. Set your own prices and
                    control your business.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Direct Relationships
                  </h3>
                  <p className="text-green-700">
                    Build meaningful connections with your customers. Receive
                    direct feedback, understand their needs, and create loyal
                    supporters of your business.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-3">
                    Sustainable Growth
                  </h3>
                  <p className="text-green-700">
                    Focus on what you do best - growing quality food. We handle
                    the technology, payments, and logistics so you can scale
                    your business sustainably.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-20 bg-green-50 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-10 text-center">
            Platform Features for Growers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Producer Dashboard
                </h3>
                <p className="text-green-700">
                  Track sales, inventory, and customer feedback in real-time.
                  Make data-driven decisions to optimize your offerings and
                  maximize revenue.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Verified Producer Profile
                </h3>
                <p className="text-green-700">
                  Build trust with a verified profile showcasing your story,
                  growing practices, and product range. Add photos and videos to
                  bring your farm to life.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Flexible Delivery Options
                </h3>
                <p className="text-green-700">
                  Choose how you want to fulfill orders - through our delivery
                  network, your own delivery service, or customer collection.
                  You're in control.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-800 mb-2">
                  Marketing Support
                </h3>
                <p className="text-green-700">
                  Get featured in our producer spotlights, seasonal promotions,
                  and local marketing campaigns. We help you reach new customers
                  and grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-10 text-center">
            What Our Growers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                  alt="James Wilson"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium text-green-800">
                    James Wilson
                  </h4>
                  <p className="text-green-600">Oak Lane Organic Farm</p>
                </div>
              </div>
              <p className="text-green-700 italic">
                "Since joining The Farm Collective, my profits have increased by
                40%. I'm now able to focus on quality rather than quantity, and
                my customers appreciate the direct connection. The platform is
                intuitive and the support team is always helpful."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
                  alt="Sarah Johnson"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium text-green-800">
                    Sarah Johnson
                  </h4>
                  <p className="text-green-600">Meadow Honey Apiaries</p>
                </div>
              </div>
              <p className="text-green-700 italic">
                "As a small-scale honey producer, I struggled to find reliable
                retail outlets. The Farm Collective has changed everything. I
                now have a direct line to customers who value my sustainable
                practices and are willing to pay for quality."
              </p>
            </div>
          </div>
        </div>

        {/* How to Join */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-green-800 mb-10 text-center">
            How to Join
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-green-200 ml-0.5"></div>

              {/* Steps */}
              <div className="space-y-12">
                <div className="relative flex items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-xl font-bold z-10 flex-shrink-0">
                    1
                  </div>
                  <div className="ml-8 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">
                      Apply Online
                    </h3>
                    <p className="text-green-700">
                      Fill out our simple application form telling us about your
                      farm, products, and growing practices. We'll review your
                      application within 3 business days.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-xl font-bold z-10 flex-shrink-0">
                    2
                  </div>
                  <div className="ml-8 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">
                      Verification Process
                    </h3>
                    <p className="text-green-700">
                      We'll arrange a video call or farm visit to verify your
                      operation. This helps us maintain quality standards and
                      build trust with consumers.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-xl font-bold z-10 flex-shrink-0">
                    3
                  </div>
                  <div className="ml-8 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">
                      Set Up Your Profile
                    </h3>
                    <p className="text-green-700">
                      Create your producer profile, add your products, set
                      prices, and define your delivery options. Our team will
                      help you optimize your listings.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white text-xl font-bold z-10 flex-shrink-0">
                    4
                  </div>
                  <div className="ml-8 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="text-xl font-medium text-green-800 mb-2">
                      Start Selling
                    </h3>
                    <p className="text-green-700">
                      Launch your store and start receiving orders. Payments are
                      processed securely and transferred to your account weekly,
                      minus our small platform fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-3">
            Ready to Transform Your Farm Business?
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            Join hundreds of successful local producers already thriving on our
            platform. Applications are currently open for the summer growing
            season.
          </p>
          <Button
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg"
            size="lg"
          >
            Apply to Join Today
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsGrower;
