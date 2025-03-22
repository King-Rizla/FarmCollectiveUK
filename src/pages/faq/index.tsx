import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "ordering",
    question: "How do I place an order?",
    answer:
      "Browse our marketplace, add items to your cart, and proceed to checkout. You'll need to create an account if you don't already have one. Select your delivery preferences and payment method to complete your order.",
    category: "Ordering",
  },
  {
    id: "delivery",
    question: "What are your delivery areas?",
    answer:
      "We currently deliver to postcodes within a 50-mile radius of our participating producers. You can check if delivery is available to your area by entering your postcode on the marketplace page or during checkout.",
    category: "Delivery",
  },
  {
    id: "delivery-time",
    question: "How long will my delivery take?",
    answer:
      "Most orders are delivered within 24-48 hours. For fresh produce, we harvest to order, so your items will be picked the morning of your delivery day. You'll receive a specific time slot on your chosen delivery day.",
    category: "Delivery",
  },
  {
    id: "tokens",
    question: "What are $FCUK tokens and how do I earn them?",
    answer:
      "$FCUK tokens are our reward points that you earn with every purchase and interaction on the platform. You earn 1 token for every £1 spent, plus bonus tokens for reviews, referrals, and participating in the community. Tokens can be used for discounts and exclusive benefits.",
    category: "Tokens & Rewards",
  },
  {
    id: "token-tiers",
    question: "What are the different token reward tiers?",
    answer:
      "We have three reward tiers: Bronze (100 tokens) gives you 1% discount on all purchases and early access to seasonal products. Silver (500 tokens) gives you 3% discount, free delivery on orders over £25, and exclusive producer workshops. Gold (1000 tokens) gives you 5% discount, priority access to limited products, monthly bonus tokens, and exclusive farm visits.",
    category: "Tokens & Rewards",
  },
  {
    id: "token-expiry",
    question: "Do tokens expire?",
    answer:
      "No, your $FCUK tokens never expire. Once earned, they remain in your account until you use them. Your tier benefits are applied automatically as long as you maintain the required token balance.",
    category: "Tokens & Rewards",
  },
  {
    id: "producer-eligibility",
    question: "How can I become a producer on the platform?",
    answer:
      "We welcome applications from local food producers who follow sustainable and ethical practices. Visit our 'Join as a Grower' page to learn about our criteria and application process. We review all applications carefully to ensure quality standards.",
    category: "Producers",
  },
  {
    id: "producer-fees",
    question: "What fees do producers pay?",
    answer:
      "Producers pay a 10% commission on sales, which is significantly lower than traditional retail channels. This fee covers platform maintenance, payment processing, marketing, and customer service. There are no monthly fees or listing fees.",
    category: "Producers",
  },
  {
    id: "payment-methods",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, PayPal, and Apple Pay. For regular customers, we also offer a weekly subscription option with automatic payments.",
    category: "Payments",
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer:
      "If you're not satisfied with the quality of your products, please contact us within 24 hours of delivery with photos. We'll either arrange a replacement or refund. For non-perishable items, you have 14 days to return unused products.",
    category: "Orders & Returns",
  },
  {
    id: "organic",
    question: "Are all your products organic?",
    answer:
      "Not all products are certified organic, but all our producers follow sustainable farming practices. Each producer profile clearly indicates their growing methods and certifications. You can filter for certified organic products in the marketplace.",
    category: "Products",
  },
  {
    id: "packaging",
    question: "What kind of packaging do you use?",
    answer:
      "We're committed to minimizing environmental impact. We use compostable or recyclable packaging for all deliveries. Many items come in reusable containers that you can return for a small deposit credit on your next order.",
    category: "Sustainability",
  },
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === null || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-green-800 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Find answers to common questions about The Farm Collective UK, our
            marketplace, delivery, and token rewards system.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              className={cn(
                activeCategory === null
                  ? "bg-green-700 hover:bg-green-800 text-white"
                  : "text-green-700 border-green-200 hover:bg-green-50",
              )}
              onClick={() => setActiveCategory(null)}
            >
              All Categories
            </Button>

            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={cn(
                  activeCategory === category
                    ? "bg-green-700 hover:bg-green-800 text-white"
                    : "text-green-700 border-green-200 hover:bg-green-50",
                )}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-green-100 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-green-50 text-left font-medium text-green-800">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-green-700 bg-green-50">
                    <p>{faq.answer}</p>
                    <div className="mt-2 text-sm text-green-600">
                      Category: {faq.category}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                No questions found matching your search.
              </p>
              <p className="text-green-700 mt-2">
                Try a different search term or category.
              </p>
              <Button
                className="mt-4 bg-green-700 hover:bg-green-800 text-white"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-green-50 rounded-xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-semibold text-green-800 mb-3">
            Still Have Questions?
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            If you couldn't find the answer you were looking for, our team is
            here to help. Reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Us
            </Button>
            <Button
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-50"
              onClick={() =>
                (window.location.href = "mailto:hello@farmcollective.uk")
              }
            >
              Email Support
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
