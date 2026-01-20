/**
 * Cart Context
 * Global cart state management with Firestore persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { CartItem, Product } from '@/types/database';
import {
  getCartItems,
  addToCart as addToCartService,
  updateCartItemQuantity as updateQuantityService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
  getCartTotal,
  calculateShipping,
} from '@/services/cart';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate derived values
  const { subtotal, itemCount } = getCartTotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  // Fetch cart items when user changes
  const fetchCartItems = useCallback(async () => {
    if (!session?.uid) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const items = await getCartItems(session.uid);
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [session?.uid, toast]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!session?.uid) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const newItem = await addToCartService(session.uid, product, quantity);

      // Update local state
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === product.id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newItem;
          return updated;
        }
        return [...prev, newItem];
      });

      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      await updateQuantityService(session.uid, cartItemId, quantity);

      if (quantity <= 0) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      } else {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: string) => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      await removeFromCartService(session.uid, cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

      toast({
        title: 'Removed',
        description: 'Item removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      await clearCartService(session.uid);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart from server
  const refreshCart = async () => {
    await fetchCartItems();
  };

  const value: CartContextType = {
    cartItems,
    itemCount,
    subtotal,
    shipping,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
