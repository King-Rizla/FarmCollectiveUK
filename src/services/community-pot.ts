/**
 * Community Pot Service
 * Track and display community impact
 * MVP: Uses mock data that can be manually updated
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CommunityPotData {
  totalAmount: number;
  monthlyGoal: number;
  currentMonthAmount: number;
  currentInitiative: {
    name: string;
    description: string;
    goal: number;
    raised: number;
  };
  pastInitiatives: {
    name: string;
    amount: number;
    date: string;
  }[];
}

// Default mock data for MVP
const defaultPotData: CommunityPotData = {
  totalAmount: 2847.50,
  monthlyGoal: 500,
  currentMonthAmount: 347.50,
  currentInitiative: {
    name: "Community Fridge Project",
    description: "Funding a community fridge to reduce food waste and support local families",
    goal: 500,
    raised: 347.50,
  },
  pastInitiatives: [
    { name: "School Garden Program", amount: 750, date: "December 2025" },
    { name: "Local Food Bank Support", amount: 1250, date: "November 2025" },
    { name: "Farmers Market Setup", amount: 500, date: "October 2025" },
  ],
};

/**
 * Get community pot data
 * Tries to fetch from Firestore, falls back to mock data
 */
export const getCommunityPotData = async (): Promise<CommunityPotData> => {
  try {
    const docRef = doc(db, 'settings', 'community-pot');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        totalAmount: data.totalAmount || defaultPotData.totalAmount,
        monthlyGoal: data.monthlyGoal || defaultPotData.monthlyGoal,
        currentMonthAmount: data.currentMonthAmount || defaultPotData.currentMonthAmount,
        currentInitiative: data.currentInitiative || defaultPotData.currentInitiative,
        pastInitiatives: data.pastInitiatives || defaultPotData.pastInitiatives,
      };
    }

    // Return mock data if document doesn't exist
    return defaultPotData;
  } catch (error) {
    console.error('Error fetching community pot data:', error);
    // Return mock data on error
    return defaultPotData;
  }
};

/**
 * Calculate contribution from order total
 * MVP: 1% of each order goes to the community pot
 */
export const calculatePotContribution = (orderTotal: number): number => {
  return orderTotal * 0.01; // 1% contribution
};
