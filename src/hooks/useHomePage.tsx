
import { useState } from "react";

// Mock data - in a real app, this would come from an API
const featuredProducersData = [
  {
    id: "1",
    name: "Green Valley Farm",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80",
    location: "Hertfordshire",
    rating: 4.9,
    description: "Organic vegetables & free-range eggs.",
    products: [
      { name: "Heritage Carrots", price: 2.5 },
      { name: "Rainbow Chard", price: 3.0 },
    ],
  },
  {
    id: "2",
    name: "Orchard House Foods",
    image: "https://images.unsplash.com/photo-1621203893247-3834ada8cfba?w=500&q=80",
    location: "Kent",
    rating: 4.8,
    description: "Artisanal preserves & seasonal fruits.",
    products: [
      { name: "Strawberry Jam", price: 4.5 },
      { name: "Apple & Pear Box", price: 12.0 },
    ],
  },
  {
    id: "3",
    name: "Watermill Grains",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
    location: "Wiltshire",
    rating: 4.9,
    description: "Stone-ground flour & organic oats.",
    products: [
      { name: "Wholemeal Flour", price: 3.2 },
      { name: "Rolled Oats", price: 2.8 },
    ],
  },
];

const featuredProductsData = [
  {
    id: "1",
    name: "Artisan Sourdough",
    producer: "The Corner Bakery",
    image: "https://images.unsplash.com/photo-1549932877-691659112294?w=500&q=80",
    price: 3.8,
    rating: 4.9,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Wildflower Honey",
    producer: "Meadow Honey",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&q=80",
    price: 8.5,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Aged Farmhouse Cheddar",
    producer: "Oak Lane Dairy",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&q=80",
    price: 12.5,
    rating: 4.8,
    reviewCount: 203,
  },
  {
    id: "4",
    name: "Organic Apple Juice",
    producer: "Orchard House Foods",
    image: "https://images.unsplash.com/photo-1603957822964-b8a514d3a436?w=500&q=80",
    price: 4.2,
    rating: 4.7,
    reviewCount: 76,
  },
];

export const useHomePage = () => {
  const [featuredProducers] = useState(featuredProducersData);
  const [featuredProducts] = useState(featuredProductsData);

  return { featuredProducers, featuredProducts };
};
