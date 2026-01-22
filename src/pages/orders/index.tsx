/**
 * Order History Page
 * View all customer orders with status and details
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Coins,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { getCustomerOrders } from "@/services/orders";
import { Order, OrderStatus } from "@/types/database";

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" },
  paid: { icon: ShoppingBag, color: "text-yellow-700", bgColor: "bg-yellow-100" },
  shipped: { icon: Truck, color: "text-blue-700", bgColor: "bg-blue-100" },
  delivered: { icon: CheckCircle, color: "text-green-700", bgColor: "bg-green-100" },
  cancelled: { icon: XCircle, color: "text-red-700", bgColor: "bg-red-100" },
};

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = statusConfig[order.status].icon;

  return (
    <Card className="border-green-100 hover:border-green-200 transition-all">
      <CardContent className="p-0">
        {/* Order Header - Always visible */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-green-800">
                  Order #{order.id.slice(0, 8)}
                </span>
                <Badge
                  className={cn(
                    "font-medium",
                    statusConfig[order.status].bgColor,
                    statusConfig[order.status].color
                  )}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-800">
                £{order.total.toFixed(2)}
              </p>
              <div className="flex items-center justify-end mt-1 text-amber-600">
                <Coins className="h-3 w-3 mr-1" />
                <span className="text-sm">+{order.tokensEarned} $FCUK</span>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 p-0">
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Details - Expandable */}
        {expanded && (
          <div className="border-t border-green-100 p-4 bg-green-50/50">
            <h4 className="font-medium text-green-800 mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-green-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      from {item.producerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-800">
                      {item.quantity} x £{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      £{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span>£{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-800">
                <span>Total</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  Delivery Address
                </h4>
                <p className="text-sm text-gray-600">
                  {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
                  <br />
                  {order.deliveryAddress.addressLine1}
                  {order.deliveryAddress.addressLine2 && (
                    <>
                      <br />
                      {order.deliveryAddress.addressLine2}
                    </>
                  )}
                  <br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.postcode}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderHistory = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.uid) {
        setLoading(false);
        return;
      }

      try {
        const ordersData = await getCustomerOrders(session.uid);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.uid]);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalTokensEarned = orders.reduce((sum, order) => sum + order.tokensEarned, 0);

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto py-24 px-4">
          <Card className="max-w-lg mx-auto text-center p-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Sign in to view orders
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to see your order history.
              </p>
              <Link to="/signin">
                <Button className="bg-green-700 hover:bg-green-800">
                  Sign In
                </Button>
              </Link>
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

      <main className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-green-800 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">
              Track your orders and view purchase history
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="py-4">
                <p className="text-sm text-green-600">Total Orders</p>
                <p className="text-2xl font-semibold text-green-800">
                  {orders.length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="py-4">
                <p className="text-sm text-green-600">Total Spent</p>
                <p className="text-2xl font-semibold text-green-800">
                  £{totalSpent.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="py-4">
                <p className="text-sm text-amber-600">Tokens Earned</p>
                <p className="text-2xl font-semibold text-amber-700">
                  {totalTokensEarned} $FCUK
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", "paid", "shipped", "delivered", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status as OrderStatus | "all")}
                className={cn(
                  filter === status
                    ? "bg-green-700 hover:bg-green-800"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({orders.filter((o) => o.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-green-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="border-green-100">
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {filter === "all"
                    ? "No orders yet"
                    : `No ${filter} orders`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === "all"
                    ? "Start shopping to see your orders here!"
                    : "Try selecting a different filter."}
                </p>
                {filter === "all" && (
                  <Link to="/marketplace">
                    <Button className="bg-green-700 hover:bg-green-800">
                      Browse Marketplace
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
