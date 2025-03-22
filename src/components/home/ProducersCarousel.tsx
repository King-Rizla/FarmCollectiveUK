import React from "react";
import { MapPin, Star, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Producer {
  id: string;
  name: string;
  image: string;
  distance: number;
  bio: string;
  rating: number;
}

interface ProducersCarouselProps {
  producers?: Producer[];
  title?: string;
  description?: string;
}

export default function ProducersCarousel({
  producers = [
    {
      id: "1",
      name: "Green Valley Farm",
      image:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
      distance: 3.2,
      bio: "Family-run organic farm specializing in seasonal vegetables and free-range eggs.",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Hillside Orchard",
      image:
        "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&q=80",
      distance: 5.7,
      bio: "Heritage apple varieties and small-batch cider production since 1978.",
      rating: 4.6,
    },
    {
      id: "3",
      name: "Meadow Honey",
      image:
        "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80",
      distance: 2.9,
      bio: "Sustainable beekeeping with wildflower and specialty seasonal honeys.",
      rating: 4.9,
    },
    {
      id: "4",
      name: "Riverside Herbs",
      image:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=80",
      distance: 4.1,
      bio: "Culinary and medicinal herbs grown using traditional methods.",
      rating: 4.7,
    },
    {
      id: "5",
      name: "Oak Lane Dairy",
      image:
        "https://images.unsplash.com/photo-1594761051656-153faa4ea454?w=800&q=80",
      distance: 6.3,
      bio: "Small-scale dairy producing artisanal cheeses and yogurt from grass-fed cows.",
      rating: 4.5,
    },
  ],
  title = "Featured Producers",
  description = "Discover local growers and producers in your area committed to sustainable farming practices.",
}: ProducersCarouselProps) {
  return (
    <section className="w-full py-12 bg-green-50/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-serif font-semibold tracking-tight text-green-800 mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-[700px] text-green-700/80">
            {description}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {producers.map((producer) => (
              <CarouselItem
                key={producer.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full overflow-hidden border border-green-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-square relative overflow-hidden bg-green-100">
                    <img
                      src={producer.image}
                      alt={producer.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-sm font-medium text-green-800">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-green-600" />
                      <span>{producer.distance} km</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-medium text-xl text-green-900">
                        {producer.name}
                      </h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {producer.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-green-700/80 text-sm line-clamp-3">
                      {producer.bio}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative static left-0 translate-y-0 bg-green-700 hover:bg-green-800 text-white" />
            <CarouselNext className="relative static right-0 translate-y-0 bg-green-700 hover:bg-green-800 text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
