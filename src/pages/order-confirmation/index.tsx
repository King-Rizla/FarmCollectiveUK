/**
 * Order Confirmation Page
 * Displays order success and token rewards
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Coins, Home, ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getOrderById } from '@/services/orders';
import { getUserTokenInfo, getNextTierProgress, getTierBenefits } from '@/services/tokens';
import { useAuth } from '@/context/AuthContext';
import { Order, TokenTier } from '@/types/database';
import { Progress } from '@/components/ui/progress';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { session } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{ balance: number; tier: TokenTier }>({
    balance: 0,
    tier: 'Bronze',
  });
  const [tierProgress, setTierProgress] = useState<{
    nextTier: TokenTier | null;
    tokensNeeded: number;
    progress: number;
  }>({ nextTier: 'Silver', tokensNeeded: 100, progress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId || !session?.uid) {
        setLoading(false);
        return;
      }

      try {
        const [orderData, userTokenInfo] = await Promise.all([
          getOrderById(orderId),
          getUserTokenInfo(session.uid),
        ]);

        setOrder(orderData);
        setTokenInfo(userTokenInfo);
        setTierProgress(getNextTierProgress(userTokenInfo.balance));
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, session?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find this order. Please check your email for order details.
              </p>
              <Link to="/marketplace">
                <Button className="bg-green-700 hover:bg-green-800">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const tierBenefits = getTierBenefits(tokenInfo.tier);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-semibold text-green-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-700">
              Thank you for supporting local producers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Package className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
                <CardDescription>Order #{order.id.slice(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? 'FREE' : `${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-800">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-sm">
                  <h4 className="font-medium text-green-800 mb-2">Delivery Address</h4>
                  <p className="text-gray-600">
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
              </CardContent>
            </Card>

            {/* Token Rewards */}
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <Coins className="h-5 w-5 mr-2" />
                  $FCUK Tokens Earned
                </CardTitle>
                <CardDescription className="text-amber-700">
                  The revolution rewards you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tokens Earned */}
                <div className="text-center p-6 bg-white/50 rounded-lg">
                  <p className="text-5xl font-bold text-amber-600 mb-2">
                    +{order.tokensEarned}
                  </p>
                  <p className="text-amber-800">tokens from this order</p>
                </div>

                {/* Current Balance */}
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div>
                    <p className="text-sm text-amber-700">Total Balance</p>
                    <p className="text-2xl font-semibold text-amber-800">
                      {tokenInfo.balance} tokens
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-200 rounded-full">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-amber-800">
                      {tokenInfo.tier}
                    </span>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                {tierProgress.nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Progress to {tierProgress.nextTier}</span>
                      <span className="text-amber-800 font-medium">
                        {tierProgress.tokensNeeded} tokens to go
                      </span>
                    </div>
                    <Progress value={tierProgress.progress} className="h-2" />
                  </div>
                )}

                {/* Current Tier Benefits */}
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-800">
                    Your {tokenInfo.tier} Benefits:
                  </h4>
                  <ul className="space-y-1">
                    {tierBenefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="text-sm text-amber-700 flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-amber-600 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile/consumer">
              <Button variant="outline" className="w-full sm:w-auto border-green-200 text-green-700 hover:bg-green-50">
                <Package className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto border-green-200 text-green-700 hover:bg-green-50">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <Card className="mt-8 bg-green-100 border-green-200">
            <CardContent className="py-6 text-center">
              <p className="text-green-800">
                <span className="font-semibold">You're helping build a better food system.</span>
                <br />
                Your purchase supports local farmers and reduces food miles.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
