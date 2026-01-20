import * as functions from "firebase-functions";
import Stripe from "stripe";
import cors from "cors";

// Initialize Stripe with your secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// CORS middleware
const corsHandler = cors({ origin: true });

/**
 * Create a PaymentIntent for checkout
 */
export const createPaymentIntent = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Only allow POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { amount, currency = "gbp", metadata } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid amount" });
        return;
      }

      // Create the PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata || {},
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to create payment",
      });
    }
  });
});

// Webhook can be added later when needed for production
