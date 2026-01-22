/**
 * Database Types for Farm Collective UK
 * Firestore collection interfaces
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  uid: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  isProducer: boolean;
  tokenBalance: number;
  tokenTier: TokenTier;
  createdAt: Date;
  updatedAt: Date;
}

export type TokenTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export const TOKEN_TIER_THRESHOLDS: Record<TokenTier, number> = {
  Bronze: 0,
  Silver: 100,
  Gold: 500,
  Platinum: 1000,
};

// ============================================
// PRODUCER TYPES
// ============================================

export interface Producer {
  uid: string;
  farmName: string;
  location: string;
  bio: string;
  coverImageUrl?: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  salesCount: number; // Number of completed (delivered) orders - used for Plant badge
  totalTokensGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductCategory =
  | 'vegetables'
  | 'fruit'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'herbs'
  | 'specialty';

export type ProductType = 'available' | 'growing';

export interface Product {
  id: string;
  producerId: string;
  producerName: string;
  producerAvatar?: string;
  producerRating?: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: ProductCategory;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  distance?: number; // Calculated field based on user location
  // Growing/Pre-order fields
  productType: ProductType;
  readyDate?: Date; // When the product will be ready (for growing products)
  totalShares?: number; // Total shares available for pre-order
  reservedShares?: number; // Number of shares already reserved
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  unit: string;
  category: ProductCategory;
  imageUrl: string;
  stockQuantity: number;
  // Growing/Pre-order fields
  productType?: ProductType;
  readyDate?: Date;
  totalShares?: number;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  producerName: string;
  producerId: string;
  price: number;
  unit: string;
  quantity: number;
  addedAt: Date;
  // Reservation fields (for growing products)
  isReservation?: boolean;
  readyDate?: Date;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus = 'pending' | 'paid' | 'reserved' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  producerId: string;
  producerName: string;
  // Reservation fields
  isReservation?: boolean;
  readyDate?: Date;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  tokensEarned: number;
  stripePaymentId?: string;
  deliveryAddress: DeliveryAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  deliveryNotes?: string;
}

// ============================================
// TOKEN TRANSACTION TYPES
// ============================================

export type TokenTransactionType =
  | 'purchase_reward'
  | 'sale_reward'
  | 'referral_bonus'
  | 'tier_bonus'
  | 'redemption';

export interface TokenTransaction {
  id: string;
  userId: string;
  type: TokenTransactionType;
  amount: number;
  orderId?: string;
  description: string;
  createdAt: Date;
}

// ============================================
// CATEGORY DATA
// ============================================

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruit', label: 'Fruit' },
  { value: 'dairy', label: 'Dairy & Eggs' },
  { value: 'meat', label: 'Meat' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'specialty', label: 'Specialty' },
];

// ============================================
// TOKEN CALCULATION CONSTANTS
// ============================================

export const TOKEN_CONFIG = {
  // Tokens earned per pound spent (1 token per £100 = 0.01 per pound)
  TOKENS_PER_POUND: 0.01,
  // Bonus multipliers by tier
  TIER_MULTIPLIERS: {
    Bronze: 1,
    Silver: 1.1,
    Gold: 1.25,
    Platinum: 1.5,
  } as Record<TokenTier, number>,
  // Producer earns this percentage of customer tokens
  PRODUCER_TOKEN_RATE: 1.0, // Producers also get 1 token per £100 sold
};
