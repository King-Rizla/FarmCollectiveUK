/**
 * Stripe Configuration
 * Payment infrastructure for Farm Collective UK
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Firebase Functions URL (update after deployment)
const FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || 'http://127.0.0.1:5001/farmcollective-fcuk/us-central1';

// Stripe instance (lazy loaded)
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or create the Stripe instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise || Promise.resolve(null);
};

/**
 * Check if Stripe is configured
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY;
};

/**
 * Format amount for Stripe (convert pounds to pence)
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Stripe (convert pence to pounds)
 */
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

/**
 * Create a PaymentIntent via Firebase Cloud Function
 */
export const createPaymentIntent = async (
  amount: number,
  metadata?: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/createPaymentIntent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'gbp',
        metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return null;
  }
};

/**
 * Demo mode payment processing (fallback when Stripe not configured)
 */
export const processDemoPayment = async (
  amount: number
): Promise<{ success: boolean; paymentId: string; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    paymentId: `pay_demo_${Date.now()}`,
  };
};

/**
 * Format card number with spaces
 */
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

/**
 * Format expiry date
 */
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

/**
 * Test card numbers for demo (Stripe test cards)
 */
export const TEST_CARDS = {
  success: '4242 4242 4242 4242',
  declineGeneric: '4000 0000 0000 0002',
  declineInsufficientFunds: '4000 0000 0000 9995',
  requiresAuthentication: '4000 0025 0000 3155',
};
