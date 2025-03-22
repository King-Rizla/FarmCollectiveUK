import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Cart() {
  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Organic Carrots",
      producer: "Green Valley Farm",
      price: 2.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    },
    {
      id: 2,
      name: "Free Range Eggs",
      producer: "Happy Hens",
      price: 3.5,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
    },
    {
      id: 3,
      name: "Artisan Sourdough Bread",
      producer: "Village Bakery",
      price: 4.25,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=800&q=80",
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
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4 h-32 sm:h-auto bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            From: {item.producer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            £{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            £{item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label="Decrease quantity"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label="Increase quantity"
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-12">
              <CardContent>
                <p className="text-xl mb-4">Your cart is empty</p>
                <Button className="bg-green-700 hover:bg-green-800">
                  Browse Marketplace
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>£{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-700 hover:bg-green-800">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4 bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 text-lg">
                Token Rewards
              </CardTitle>
              <CardDescription>Earn tokens with this purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                You'll earn{" "}
                <span className="font-medium text-amber-700">25 tokens</span>{" "}
                with this purchase that can be used for future discounts!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
