/**
 * Cart Page
 * Shopping cart with real Firestore persistence
 */

import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, Loader2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { calculatePurchaseTokens } from "@/services/tokens";

const CartItemSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex flex-col sm:flex-row">
      <Skeleton className="w-full sm:w-1/4 h-32" />
      <div className="flex-1 p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  </Card>
);

export default function Cart() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const {
    cartItems,
    itemCount,
    subtotal,
    shipping,
    total,
    loading,
    updateQuantity,
    removeItem,
  } = useCart();

  const tokensToEarn = calculatePurchaseTokens(subtotal);

  // Redirect to signin if not authenticated
  if (!authLoading && !session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto py-24 px-4 md:px-6">
          <Card className="max-w-lg mx-auto text-center p-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Sign in to view your cart
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to add items to your cart and checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signin">
                  <Button className="bg-green-700 hover:bg-green-800">
                    Sign In
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" className="border-green-200">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto py-24 px-4 md:px-6">
        <div className="mb-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center text-green-700 hover:text-green-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-green-800">
            Your Cart
          </h1>
          {itemCount > 0 && (
            <p className="text-green-600">{itemCount} items in your cart</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty Cart */}
            {!loading && cartItems.length === 0 && (
              <Card className="text-center p-12">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-serif font-semibold text-green-800 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Discover fresh, local produce from our marketplace.
                  </p>
                  <Link to="/marketplace">
                    <Button className="bg-green-700 hover:bg-green-800">
                      Browse Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Cart Items */}
            {!loading && cartItems.length > 0 && (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/4 h-32 sm:h-auto bg-gray-100">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg text-green-800">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              From: {item.producerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-800">
                              {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.price.toFixed(2)} / {item.unit}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={loading}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={loading}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-green-800">Order Summary</CardTitle>
                {cartItems.length > 0 && (
                  <CardDescription>{itemCount} items</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 30 && (
                  <p className="text-sm text-green-600">
                    Add {(30 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span className="text-green-800">Total</span>
                  <span className="text-green-800">{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={cartItems.length === 0 || loading}
                  onClick={() => navigate("/checkout")}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>

            {/* Token Rewards Preview */}
            {cartItems.length > 0 && (
              <Card className="mt-4 bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800 text-lg">
                    Token Rewards
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Earn tokens with this purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-800">
                    You'll earn{" "}
                    <span className="font-semibold text-amber-700 text-lg">
                      {tokensToEarn} $FCUK tokens
                    </span>{" "}
                    with this purchase that can be used for future discounts and
                    exclusive benefits!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
