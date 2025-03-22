import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps = {}) => {
  return (
    <footer className={cn("bg-green-50 border-t border-green-100", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-serif font-semibold text-green-800">
                The Farm Collective UK
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              Connecting local food growers directly with consumers. Supporting
              sustainable agriculture and building community through food.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-green-600 hover:text-green-800"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/FarmCollectiveUK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-green-600 hover:text-green-800"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/FarmCollectiveUK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-green-600 hover:text-green-800"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium text-green-800 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-green-700 text-sm">
                  123 Harvest Lane, Countryside, UK
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <a
                  href="mailto:hello@farmcollective.uk"
                  className="text-green-700 hover:text-green-900 text-sm"
                >
                  hello@farmcollective.uk
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-medium text-green-800 mb-4">
              Stay Updated
            </h4>
            <p className="text-green-700 text-sm mb-4">
              Subscribe to our newsletter for seasonal updates and local events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-l-md border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              />
              <Button className="rounded-l-none bg-green-700 hover:bg-green-800">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-green-100 text-center text-green-700 text-sm">
          <p>
            © {new Date().getFullYear()} The Farm Collective UK. All rights
            reserved.
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-green-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-900">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
