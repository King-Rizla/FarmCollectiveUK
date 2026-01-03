import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  backgroundImage?: string;
  ctaButtons?: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
}

const HeroSection = ({
  headline = "Buy Fresh. Support Local. Grow Together.",
  subheadline = "Connect directly with local food growers in your community and discover the freshest produce while supporting sustainable farming.",
  backgroundImage = "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1920&q=80",
  ctaButtons = {
    primary: {
      text: "Browse Marketplace",
      href: "/marketplace",
    },
    secondary: {
      text: "Join as a Grower",
      href: "/signup",
    },
  },
}: HeroSectionProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-amber-50">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 to-green-900/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1920&q=30')] opacity-5 mix-blend-overlay" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 lg:py-44 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Decorative element */}
          <div className="mb-6 flex justify-center">
            <div className="h-1 w-24 bg-amber-400 rounded-full"></div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-md">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
            <Button
              size="lg"
              className={cn(
                "bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-6 text-lg shadow-lg",
                "transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl",
              )}
              asChild
            >
              <a href={ctaButtons.primary.href}>{ctaButtons.primary.text}</a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={cn(
                "border-2 border-white text-white bg-transparent hover:bg-white/10 font-medium px-8 py-6 text-lg shadow-lg",
                "transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl",
              )}
              asChild
            >
              <a href={ctaButtons.secondary.href}>
                {ctaButtons.secondary.text}
              </a>
            </Button>
          </div>

          {/* Optional: Scroll indicator */}
          <div className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce flex-col items-center">
            <span className="text-white/80 text-sm mb-2">Discover More</span>
            <ArrowDown className="text-white h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
