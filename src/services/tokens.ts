/**
 * Token Service
 * $FCUK Token calculations and awards
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  TokenTransaction,
  TokenTransactionType,
  TokenTier,
  TOKEN_CONFIG,
  TOKEN_TIER_THRESHOLDS,
} from '@/types/database';

const TOKEN_TRANSACTIONS_COLLECTION = 'tokenTransactions';

/**
 * Calculate tokens earned from a purchase
 */
export const calculatePurchaseTokens = (
  purchaseAmount: number,
  currentTier: TokenTier = 'Bronze'
): number => {
  const baseTokens = Math.floor(purchaseAmount * TOKEN_CONFIG.TOKENS_PER_POUND);
  const multiplier = TOKEN_CONFIG.TIER_MULTIPLIERS[currentTier];
  return Math.floor(baseTokens * multiplier);
};

/**
 * Calculate tokens earned by producer from a sale
 */
export const calculateSaleTokens = (saleAmount: number): number => {
  const baseTokens = Math.floor(saleAmount * TOKEN_CONFIG.TOKENS_PER_POUND);
  return Math.floor(baseTokens * TOKEN_CONFIG.PRODUCER_TOKEN_RATE);
};

/**
 * Determine token tier based on balance
 */
export const getTokenTier = (tokenBalance: number): TokenTier => {
  if (tokenBalance >= TOKEN_TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (tokenBalance >= TOKEN_TIER_THRESHOLDS.Gold) return 'Gold';
  if (tokenBalance >= TOKEN_TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
};

/**
 * Get user's current token balance and tier
 */
export const getUserTokenInfo = async (
  userId: string
): Promise<{ balance: number; tier: TokenTier }> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const balance = data.tokenBalance || 0;
      return {
        balance,
        tier: getTokenTier(balance),
      };
    }
    return { balance: 0, tier: 'Bronze' };
  } catch (error) {
    console.error('Error getting user token info:', error);
    return { balance: 0, tier: 'Bronze' };
  }
};

/**
 * Award tokens to a user and record the transaction
 */
const awardTokens = async (
  userId: string,
  amount: number,
  type: TokenTransactionType,
  description: string,
  orderId?: string
): Promise<void> => {
  try {
    // Get current balance
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error('User not found:', userId);
      return;
    }

    const currentBalance = userDoc.data().tokenBalance || 0;
    const newBalance = currentBalance + amount;
    const newTier = getTokenTier(newBalance);

    // Update user's token balance and tier
    await updateDoc(userRef, {
      tokenBalance: newBalance,
      tokenTier: newTier,
    });

    // Record the transaction
    await addDoc(collection(db, TOKEN_TRANSACTIONS_COLLECTION), {
      userId,
      type,
      amount,
      orderId,
      description,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error awarding tokens:', error);
    throw error;
  }
};

/**
 * Award tokens to a customer for making a purchase
 */
export const awardPurchaseTokens = async (
  customerId: string,
  amount: number,
  orderId: string
): Promise<void> => {
  await awardTokens(
    customerId,
    amount,
    'purchase_reward',
    `Earned ${amount} tokens from purchase`,
    orderId
  );
};

/**
 * Award tokens to a producer for a sale
 */
export const awardSaleTokens = async (
  producerId: string,
  saleAmount: number,
  orderId: string
): Promise<void> => {
  const tokens = calculateSaleTokens(saleAmount);
  await awardTokens(
    producerId,
    tokens,
    'sale_reward',
    `Earned ${tokens} tokens from sale of ${saleAmount.toFixed(2)}`,
    orderId
  );
};

/**
 * Get token transaction history for a user
 */
export const getTokenTransactions = async (
  userId: string
): Promise<TokenTransaction[]> => {
  try {
    const q = query(
      collection(db, TOKEN_TRANSACTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        orderId: data.orderId,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    throw error;
  }
};

/**
 * Get tier benefits description
 */
export const getTierBenefits = (tier: TokenTier): string[] => {
  const benefits: Record<TokenTier, string[]> = {
    Bronze: [
      'Earn 1 $FCUK token per £100 spent',
      'Access to marketplace',
      'Basic support',
    ],
    Silver: [
      'Earn 1.1 tokens per £100 spent (10% bonus)',
      'Early access to seasonal products',
      'Priority support',
    ],
    Gold: [
      'Earn 1.25 tokens per £100 spent (25% bonus)',
      'Free shipping on orders over £20',
      'Exclusive producer events',
      'Monthly farm box discounts',
    ],
    Platinum: [
      'Earn 1.5 tokens per £100 spent (50% bonus)',
      'Free shipping on all orders',
      'VIP farm visits',
      'Exclusive product launches',
      'Personal farm advisor',
    ],
  };

  return benefits[tier];
};

/**
 * Get progress to next tier
 */
export const getNextTierProgress = (
  currentBalance: number
): { nextTier: TokenTier | null; tokensNeeded: number; progress: number } => {
  const currentTier = getTokenTier(currentBalance);

  const tierOrder: TokenTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const currentIndex = tierOrder.indexOf(currentTier);

  if (currentIndex === tierOrder.length - 1) {
    // Already at Platinum
    return { nextTier: null, tokensNeeded: 0, progress: 100 };
  }

  const nextTier = tierOrder[currentIndex + 1];
  const nextThreshold = TOKEN_TIER_THRESHOLDS[nextTier];
  const currentThreshold = TOKEN_TIER_THRESHOLDS[currentTier];

  const tokensNeeded = nextThreshold - currentBalance;
  const progress = ((currentBalance - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return {
    nextTier,
    tokensNeeded,
    progress: Math.min(100, Math.max(0, progress)),
  };
};
