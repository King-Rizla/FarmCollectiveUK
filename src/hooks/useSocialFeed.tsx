
import { useState } from "react";

// Dummy social feed data
const posts = [
  {
    id: "1",
    author: {
      name: "Green Valley Farm",
      role: "Producer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley",
    },
    content:
      "Just harvested our first batch of organic carrots for the season! They're looking absolutely beautiful and will be available at the marketplace tomorrow. 🥕",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    location: "Hertfordshire",
    distance: 3.2,
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Sarah Johnson",
      role: "Consumer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    content:
      "Made the most amazing salad with fresh produce from @MeadowFarm! The difference in taste compared to supermarket vegetables is incredible. Supporting local has never been so delicious! #FarmToTable",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    location: "Essex",
    distance: 5.7,
    timestamp: "5 hours ago",
    likes: 42,
    comments: 8,
    shares: 3,
    liked: true,
  },
  {
    id: "3",
    author: {
      name: "Meadow Honey",
      role: "Producer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meadow",
    },
    content:
      "Our bees have been busy! Just bottled our spring wildflower honey and it's looking absolutely gorgeous. The flowers this year have given it a beautiful amber color and delicate flavor. Available now in the marketplace!",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80",
    location: "Kent",
    distance: 2.9,
    timestamp: "1 day ago",
    likes: 36,
    comments: 7,
    shares: 4,
    liked: false,
  },
  {
    id: "4",
    author: {
      name: "Tom Williams",
      role: "Consumer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    },
    content:
      "Just picked up my weekly veg box from @GreenValleyFarm and I'm so impressed with the quality! The token rewards are a nice bonus too - already saved £12 this month. #SupportLocal",
    image: null,
    location: "Surrey",
    distance: 4.1,
    timestamp: "2 days ago",
    likes: 18,
    comments: 3,
    shares: 1,
    liked: false,
  },
  {
    id: "5",
    author: {
      name: "Oak Lane Dairy",
      role: "Producer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OakLane",
    },
    content:
      "Big news! We've just completed our new cheese aging room and will be launching three new artisanal cheese varieties next month. Here's a sneak peek of our new Cheddar aging process. #ArtisanalCheese #LocalDairy",
    image:
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80",
    location: "Buckinghamshire",
    distance: 6.3,
    timestamp: "3 days ago",
    likes: 53,
    comments: 12,
    shares: 8,
    liked: true,
  },
  {
    id: "6",
    author: {
      name: "Emma Thompson",
      role: "Consumer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    content:
      "Made my first loaf using flour from @WaterMillGrains and it turned out perfect! There's something special about knowing exactly where your ingredients come from. #HomeBaking #LocalIngredients",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    location: "London",
    distance: 7.8,
    timestamp: "4 days ago",
    likes: 29,
    comments: 6,
    shares: 2,
    liked: false,
  },
  {
    id: "7",
    author: {
      name: "Riverside Herbs",
      role: "Producer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riverside",
    },
    content:
      "We're hosting a herb growing workshop next Saturday! Learn how to grow your own culinary herbs at home, plus take home a starter kit with 5 different herb seedlings. Limited spots available - book through our profile. #GrowYourOwn",
    image:
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=80",
    location: "Oxfordshire",
    distance: 8.4,
    timestamp: "5 days ago",
    likes: 41,
    comments: 15,
    shares: 9,
    liked: false,
  },
];

export const useSocialFeed = () => {
  const [feedPosts, setFeedPosts] = useState(posts);
  const [activeTab, setActiveTab] = useState("all");

  const handleLike = (postId: string) => {
    setFeedPosts(
      feedPosts.map((post) => {
        if (post.id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string, commentText: string) => {
    setFeedPosts(
      feedPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          };
        }
        return post;
      })
    );
    // In a real app, you would also store the comment
  };

  const handleCreatePost = (newPost: { content: string; image: string | null }) => {
    const post = {
      id: String(feedPosts.length + 1),
      author: {
        name: "You (Consumer)",
        role: "Consumer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      },
      content: newPost.content,
      image: newPost.image,
      location: "Your Location",
      distance: 0,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };

    setFeedPosts([post, ...feedPosts]);
  };

  // Filter posts based on active tab
  const filteredPosts = feedPosts.filter((post) => {
    if (activeTab === "all") return true;
    if (activeTab === "producers") return post.author.role === "Producer";
    if (activeTab === "consumers") return post.author.role === "Consumer";
    return true;
  });

  return {
    filteredPosts,
    activeTab,
    handleLike,
    handleComment,
    handleCreatePost,
    setActiveTab,
  };
};
