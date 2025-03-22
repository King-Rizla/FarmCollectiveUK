import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Organic Carrots",
      producer: "Green Valley Farm",
      price: 2.99,
      quantity: 2,
    },
    {
      id: 2,
      name: "Free Range Eggs",
      producer: "Happy Hens",
      price: 3.5,
      quantity: 1,
    },
    {
      id: 3,
      name: "Artisan Sourdough Bread",
      producer: "Village Bakery",
      price: 4.25,
      quantity: 1,
    },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 3.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-green-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
              <CardDescription>Enter your delivery details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Smith" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.smith@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+44 7123 456789" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" placeholder="123 Main Street" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input id="address2" placeholder="Apartment, suite, etc." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="London" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" placeholder="SW1A 1AA" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
                <Input
                  id="deliveryNotes"
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Smith" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="mt-4">
                  <div className="text-center p-4">
                    <p className="mb-4">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Continue with PayPal
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="mt-4">
                  <div className="space-y-4">
                    <p>Select your preferred cryptocurrency:</p>
                    <RadioGroup defaultValue="bitcoin">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bitcoin" id="bitcoin" />
                        <Label htmlFor="bitcoin">Bitcoin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ethereum" id="ethereum" />
                        <Label htmlFor="ethereum">Ethereum</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="farmtoken" id="farmtoken" />
                        <Label htmlFor="farmtoken">
                          Farm Collective Token (5% discount)
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-gray-600">
                      You will receive wallet address details after placing your
                      order.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cartItems.length} items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>£{shipping.toFixed(2)}</span>
                </div>
                {paymentMethod === "crypto" && (
                  <div className="flex justify-between text-green-700">
                    <span>Crypto Discount</span>
                    <span>-£{(total * 0.05).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    £
                    {paymentMethod === "crypto"
                      ? (total * 0.95).toFixed(2)
                      : total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-700 hover:bg-green-800">
                Place Order
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4 bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 text-lg">
                Token Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                You'll earn{" "}
                <span className="font-medium text-amber-700">25 tokens</span>{" "}
                with this purchase!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
