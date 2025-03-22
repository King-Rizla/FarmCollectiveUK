import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  MoreHorizontal,
  Image,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const SocialPost = ({ post, onLike, onComment }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment("");
    }
  };

  return (
    <Card className="mb-6 border border-green-100 overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border-2 border-green-100">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-green-100 text-green-800">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-green-900">
                  {post.author.name}
                </h3>
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    post.author.role === "Producer"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800",
                  )}
                >
                  {post.author.role}
                </span>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <span>{post.timestamp}</span>
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3 mr-0.5" />
                <span>
                  {post.location} ({post.distance} km)
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-green-700">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-4">
          <p className="text-green-800 whitespace-pre-line">{post.content}</p>
        </div>

        {/* Post Image (if any) */}
        {post.image && (
          <div className="aspect-video w-full overflow-hidden bg-green-50">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="px-4 py-3 border-t border-b border-green-100 flex justify-between items-center text-sm text-green-700">
          <div>
            {post.likes > 0 && (
              <span>
                {post.likes} {post.likes === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
          <div>
            {post.comments > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:text-green-900 transition-colors"
              >
                {post.comments} {post.comments === 1 ? "comment" : "comments"}
              </button>
            )}
            {post.shares > 0 && post.comments > 0 && (
              <span className="mx-1">•</span>
            )}
            {post.shares > 0 && (
              <span>
                {post.shares} {post.shares === 1 ? "share" : "shares"}
              </span>
            )}
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-4 py-2 flex justify-between border-b border-green-100">
          <Button
            variant="ghost"
            className={cn(
              "flex-1 flex items-center justify-center gap-2",
              post.liked
                ? "text-red-500"
                : "text-green-700 hover:text-green-900",
            )}
            onClick={() => onLike(post.id)}
          >
            <Heart className={cn("h-5 w-5", post.liked && "fill-current")} />
            Like
          </Button>
          <Button
            variant="ghost"
            className="flex-1 flex items-center justify-center gap-2 text-green-700 hover:text-green-900"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>
          <Button
            variant="ghost"
            className="flex-1 flex items-center justify-center gap-2 text-green-700 hover:text-green-900"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="p-4 bg-green-50/50">
            {/* Sample Comments */}
            <div className="space-y-4 mb-4">
              <div className="flex">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                    <p className="font-medium text-sm text-green-900">
                      Alex Johnson
                    </p>
                    <p className="text-sm text-green-800">
                      This looks amazing! Can't wait to try some.
                    </p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <button className="hover:text-green-900">Like</button>
                    <span className="mx-1">•</span>
                    <button className="hover:text-green-900">Reply</button>
                    <span className="mx-1">•</span>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>

              <div className="flex">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                    <p className="font-medium text-sm text-green-900">
                      Maria Lopez
                    </p>
                    <p className="text-sm text-green-800">
                      I bought some last week and they were delicious!
                    </p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <button className="hover:text-green-900">Like</button>
                    <span className="mx-1">•</span>
                    <button className="hover:text-green-900">Reply</button>
                    <span className="mx-1">•</span>
                    <span>30 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="pr-10 bg-white"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                >
                  <Image className="h-5 w-5" />
                </button>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!comment.trim()}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CreatePostCard = ({ onCreatePost }) => {
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      onCreatePost({
        content: postContent,
        image: postImage,
      });
      setPostContent("");
      setPostImage(null);
    }
  };

  // Simulated image upload
  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    setPostImage(
      "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800&q=80",
    );
  };

  return (
    <Card className="mb-8 border border-green-100 bg-white">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share an update or photo from your farm or kitchen..."
                className="w-full min-h-[100px] p-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              {postImage && (
                <div className="mt-3 relative">
                  <img
                    src={postImage}
                    alt="Upload preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 h-8 w-8"
                    onClick={() => setPostImage(null)}
                  >
                    ×
                  </Button>
                </div>
              )}

              <div className="mt-3 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-200"
                    onClick={handleImageUpload}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-200"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  Post Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const SocialFeed = () => {
  const [feedPosts, setFeedPosts] = useState(posts);
  const [activeTab, setActiveTab] = useState("all");

  const handleLike = (postId) => {
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
      }),
    );
  };

  const handleComment = (postId, commentText) => {
    setFeedPosts(
      feedPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          };
        }
        return post;
      }),
    );
    // In a real app, you would also store the comment
  };

  const handleCreatePost = (newPost) => {
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

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-green-800 mb-4">
            Community Feed
          </h1>
          <p className="text-green-700 max-w-3xl">
            Connect with local producers and fellow food enthusiasts. Share your
            experiences, recipes, and support the local food community.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Feed */}
          <div className="flex-1 order-2 md:order-1">
            <Tabs
              defaultValue="all"
              className="mb-6"
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-green-50 w-full justify-start">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="producers">Producers</TabsTrigger>
                <TabsTrigger value="consumers">Consumers</TabsTrigger>
              </TabsList>
            </Tabs>

            <CreatePostCard onCreatePost={handleCreatePost} />

            {filteredPosts.map((post) => (
              <SocialPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 order-1 md:order-2">
            <Card className="border border-green-100 bg-white sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-serif font-medium text-lg text-green-800 mb-4">
                  Community Highlights
                </h3>

                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">
                      Upcoming Events
                    </h4>
                    <p className="text-sm text-green-700 mb-2">
                      Herb Growing Workshop - This Saturday
                    </p>
                    <Button
                      variant="link"
                      className="text-green-700 p-0 h-auto"
                    >
                      View Details
                    </Button>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-1">
                      Token Rewards
                    </h4>
                    <p className="text-sm text-amber-700 mb-2">
                      Earn 2x tokens on all marketplace interactions this week!
                    </p>
                    <Link to="/rewards">
                      <Button
                        variant="link"
                        className="text-amber-700 p-0 h-auto"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">
                      Popular Producers
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley" />
                        </Avatar>
                        <span className="text-sm text-green-700">
                          Green Valley Farm
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Follow
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Meadow" />
                        </Avatar>
                        <span className="text-sm text-green-700">
                          Meadow Honey
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Follow
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=OakLane" />
                        </Avatar>
                        <span className="text-sm text-green-700">
                          Oak Lane Dairy
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SocialFeed;
