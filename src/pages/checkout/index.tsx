/**
 * Checkout Page
 * Complete purchase with Stripe payment processing
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  Loader2,
  Lock,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { createOrder } from "@/services/orders";
import { calculatePurchaseTokens } from "@/services/tokens";
import {
  getStripe,
  createPaymentIntent,
  processDemoPayment,
  TEST_CARDS,
} from "@/lib/stripe";
import { DeliveryAddress } from "@/types/database";

// Form validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(5, "Valid postcode required"),
  deliveryNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Stripe CardElement styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

// Inner checkout form component (uses Stripe hooks)
function CheckoutForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, profile } = useAuth();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [useDemoMode, setUseDemoMode] = useState(false);

  const tokensToEarn = calculatePurchaseTokens(subtotal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: profile?.full_name?.split(" ")[0] || "",
      lastName: profile?.full_name?.split(" ").slice(1).join(" ") || "",
      email: profile?.email || session?.email || "",
    },
  });

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto py-24 px-4 md:px-6">
          <Card className="max-w-lg mx-auto text-center p-12">
            <CardContent>
              <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Sign in to checkout
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to complete your purchase.
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

  // Empty cart check
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto py-24 px-4 md:px-6">
          <Card className="max-w-lg mx-auto text-center p-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-green-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some items to your cart before checking out.
              </p>
              <Link to="/marketplace">
                <Button className="bg-green-700 hover:bg-green-800">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setProcessing(true);
    setCardError(null);

    try {
      let paymentId: string;

      if (useDemoMode) {
        // Demo mode - simulated payment
        const result = await processDemoPayment(total);
        if (!result.success) {
          throw new Error(result.error || "Payment failed");
        }
        paymentId = result.paymentId;
      } else {
        // Real Stripe payment
        if (!stripe || !elements) {
          throw new Error("Stripe not loaded");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element not found");
        }

        // Create PaymentIntent via Cloud Function
        const paymentIntent = await createPaymentIntent(total, {
          customerId: session.uid,
          customerEmail: data.email,
        });

        if (!paymentIntent) {
          throw new Error("Failed to create payment. Please try demo mode.");
        }

        // Confirm the payment
        const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
          paymentIntent.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                phone: data.phone,
                address: {
                  line1: data.addressLine1,
                  line2: data.addressLine2 || undefined,
                  city: data.city,
                  postal_code: data.postcode,
                  country: "GB",
                },
              },
            },
          }
        );

        if (error) {
          throw new Error(error.message || "Payment failed");
        }

        if (confirmedPayment?.status !== "succeeded") {
          throw new Error("Payment was not successful");
        }

        paymentId = confirmedPayment.id;
      }

      // Create delivery address
      const deliveryAddress: DeliveryAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        postcode: data.postcode,
        deliveryNotes: data.deliveryNotes,
      };

      // Create order in Firestore
      const order = await createOrder(
        session.uid,
        data.email,
        `${data.firstName} ${data.lastName}`,
        cartItems,
        deliveryAddress,
        subtotal,
        shipping,
        total,
        tokensToEarn,
        paymentId
      );

      // Clear cart
      await clearCart();

      toast({
        title: "Order placed successfully!",
        description: `You earned ${tokensToEarn} $FCUK tokens.`,
      });

      // Navigate to confirmation page
      navigate(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setCardError(error instanceof Error ? error.message : "Payment failed");
      toast({
        title: "Checkout failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto py-24 px-4 md:px-6">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-green-700 hover:text-green-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-green-800">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Delivery Information
                  </CardTitle>
                  <CardDescription>
                    Enter your delivery details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+44 7123 456789"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      placeholder="123 Main Street"
                      {...register("addressLine1")}
                      className={errors.addressLine1 ? "border-red-500" : ""}
                    />
                    {errors.addressLine1 && (
                      <p className="text-sm text-red-500">
                        {errors.addressLine1.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      placeholder="Apartment, suite, etc."
                      {...register("addressLine2")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="London"
                        {...register("city")}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        placeholder="SW1A 1AA"
                        {...register("postcode")}
                        className={errors.postcode ? "border-red-500" : ""}
                      />
                      {errors.postcode && (
                        <p className="text-sm text-red-500">
                          {errors.postcode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryNotes">
                      Delivery Notes (Optional)
                    </Label>
                    <Input
                      id="deliveryNotes"
                      placeholder="Any special instructions for delivery"
                      {...register("deliveryNotes")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Enter your card details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode Toggle */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useDemoMode}
                        onChange={(e) => setUseDemoMode(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Use demo mode (simulated payment)
                      </span>
                    </label>
                  </div>

                  {useDemoMode ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Demo Mode:</strong> Payment will be simulated.
                        No real charges will be made.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Test Mode:</strong> Use card{" "}
                          <code className="bg-green-100 px-1 rounded">
                            {TEST_CARDS.success}
                          </code>{" "}
                          with any future expiry and CVC.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Card Details</Label>
                        <div className="p-3 border rounded-md bg-white">
                          <CardElement options={cardElementOptions} />
                        </div>
                        {cardError && (
                          <p className="text-sm text-red-500">{cardError}</p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-green-800">Order Summary</CardTitle>
                  <CardDescription>{cartItems.length} items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `£${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span className="text-green-800">Total</span>
                      <span className="text-green-800">
                        £{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={processing || (!useDemoMode && !stripe)}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay £{total.toFixed(2)}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Your payment is secure and encrypted
                  </p>
                </CardFooter>
              </Card>

              {/* Token Rewards */}
              <Card className="mt-4 bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800 text-lg">
                    Token Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      You'll earn{" "}
                      <span className="font-semibold text-amber-700">
                        {tokensToEarn} $FCUK tokens
                      </span>{" "}
                      with this purchase!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

// Main export with Stripe Elements wrapper
export default function Checkout() {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof getStripe> | null>(null);

  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
