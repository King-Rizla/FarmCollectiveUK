/**
 * Cart Service
 * Cart operations with Firestore persistence
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, Product } from '@/types/database';

/**
 * Get the cart subcollection reference for a user
 */
const getCartRef = (userId: string) => {
  return collection(db, 'users', userId, 'cart');
};

/**
 * Convert Firestore document to CartItem type
 */
const docToCartItem = (doc: any): CartItem => {
  const data = doc.data();
  return {
    id: doc.id,
    productId: data.productId,
    productName: data.productName,
    productImage: data.productImage,
    producerName: data.producerName,
    producerId: data.producerId,
    price: data.price,
    unit: data.unit,
    quantity: data.quantity,
    addedAt: data.addedAt?.toDate() || new Date(),
  };
};

/**
 * Get all cart items for a user
 */
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartRef = getCartRef(userId);
    const snapshot = await getDocs(cartRef);
    return snapshot.docs.map(docToCartItem);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

/**
 * Add a product to the cart
 */
export const addToCart = async (
  userId: string,
  product: Product,
  quantity: number = 1
): Promise<CartItem> => {
  try {
    const cartRef = getCartRef(userId);

    // Check if product already exists in cart
    const q = query(cartRef, where('productId', '==', product.id));
    const existingItems = await getDocs(q);

    if (!existingItems.empty) {
      // Update quantity of existing item
      const existingDoc = existingItems.docs[0];
      const existingItem = docToCartItem(existingDoc);
      const newQuantity = existingItem.quantity + quantity;

      await updateDoc(existingDoc.ref, {
        quantity: newQuantity,
      });

      return {
        ...existingItem,
        quantity: newQuantity,
      };
    }

    // Add new item to cart
    const cartItemData = {
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      producerName: product.producerName,
      producerId: product.producerId,
      price: product.price,
      unit: product.unit,
      quantity,
      addedAt: serverTimestamp(),
    };

    const docRef = await addDoc(cartRef, cartItemData);

    return {
      id: docRef.id,
      ...cartItemData,
      addedAt: new Date(),
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<void> => {
  try {
    if (quantity <= 0) {
      await removeFromCart(userId, cartItemId);
      return;
    }

    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await updateDoc(cartItemRef, { quantity });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 */
export const removeFromCart = async (
  userId: string,
  cartItemId: string
): Promise<void> => {
  try {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await deleteDoc(cartItemRef);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear all items from the cart
 */
export const clearCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = getCartRef(userId);
    const snapshot = await getDocs(cartRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Get cart total
 */
export const getCartTotal = (cartItems: CartItem[]): { subtotal: number; itemCount: number } => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, itemCount };
};

/**
 * Calculate shipping cost based on subtotal
 */
export const calculateShipping = (subtotal: number): number => {
  // Free shipping over 30 pounds
  if (subtotal >= 30) {
    return 0;
  }
  return 3.99;
};

/**
 * Get cart item count for a user (efficient single query)
 */
export const getCartItemCount = async (userId: string): Promise<number> => {
  try {
    const cartItems = await getCartItems(userId);
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
};
