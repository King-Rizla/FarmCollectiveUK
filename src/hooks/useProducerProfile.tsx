
import { useState } from "react";

// Mock data
const producerData = {
  name: "Willow Grove Market Garden",
  username: "willowgrove",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
  coverImage:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  location: "Kent, UK",
  bio: "Family-run organic market garden specializing in heritage vegetables, herbs, and edible flowers. Practicing regenerative agriculture since 2015.",
  joinDate: "January 2022",
  tokenBalance: 780,
  tokenTier: "Gold",
  monthlySales: 342.5,
  monthlySavings: 17.13,
  rating: 4.8,
  reviewCount: 32,
};

const products = [
  {
    id: "1",
    name: "Heritage Tomato Mix",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80",
    price: 4.25,
    unit: "500g",
    quantity: 15,
    description:
      "A colorful mix of heritage tomato varieties bursting with flavor. Grown using traditional methods and harvested at peak ripeness.",
  },
  {
    id: "2",
    name: "Fresh Herb Bundle",
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4b11f158?w=400&q=80",
    price: 3.5,
    unit: "bundle",
    quantity: 8,
    description:
      "Fresh-cut culinary herbs including rosemary, thyme, sage, and parsley. Grown using organic methods to ensure the best flavor for your cooking.",
  },
  {
    id: "3",
    name: "Edible Flower Mix",
    image:
      "https://images.unsplash.com/photo-1515545255053-fded3e3b5b00?w=400&q=80",
    price: 5.99,
    unit: "punnet",
    quantity: 5,
    description:
      "Beautiful and delicious edible flowers to garnish salads, desserts, and cocktails. Includes nasturtiums, violas, and calendula.",
  },
  {
    id: "4",
    name: "Seasonal Salad Greens",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    price: 3.75,
    unit: "200g",
    quantity: 20,
    description:
      "A mix of seasonal salad greens including baby lettuce, arugula, and spinach. Harvested fresh each morning.",
  },
];

const reviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    product: "Heritage Tomato Mix",
    content:
      "These tomatoes are incredible! So much flavor compared to supermarket varieties. Will definitely order again.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: "2",
    author: "Mark Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
    product: "Fresh Herb Bundle",
    content:
      "The herbs were very fresh and aromatic. They really elevated my cooking. The packaging was also eco-friendly which I appreciate.",
    rating: 4,
    date: "1 month ago",
  },
  {
    id: "3",
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    product: "Edible Flower Mix",
    content:
      "Beautiful flowers that made my salad look and taste amazing! My dinner guests were so impressed.",
    rating: 5,
    date: "1 month ago",
  },
];

const socialPosts = [
  {
    id: "1",
    content:
      "Just harvested our first batch of heritage tomatoes for the season! They're looking absolutely beautiful and will be available at the marketplace tomorrow. 🍅",
    image:
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80",
    likes: 24,
    comments: 5,
    date: "2 days ago",
  },
  {
    id: "2",
    content:
      "We're hosting a herb growing workshop next Saturday! Learn how to grow your own culinary herbs at home, plus take home a starter kit with 5 different herb seedlings. Limited spots available - book through our profile. #GrowYourOwn",
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4b11f158?w=400&q=80",
    likes: 18,
    comments: 7,
    date: "1 week ago",
  },
];

export const useProducerProfile = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    quantity: "",
    description: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add the product to the database
    console.log("New product:", newProduct);
    // Reset form
    setNewProduct({
      name: "",
      price: "",
      unit: "",
      quantity: "",
      description: "",
    });
  };

  return {
    producerData,
    products,
    reviews,
    socialPosts,
    newProduct,
    searchValue,
    filteredProducts,
    handleInputChange,
    handleSearchChange,
    handleSubmit,
  };
};
