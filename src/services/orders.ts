/**
 * Orders Service
 * Order creation and management
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
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Order,
  OrderItem,
  OrderStatus,
  DeliveryAddress,
  CartItem,
} from '@/types/database';
import { clearCart } from './cart';
import { updateProductStock } from './products';
import { awardPurchaseTokens, awardSaleTokens } from './tokens';

const ORDERS_COLLECTION = 'orders';

/**
 * Convert Firestore document to Order type
 */
const docToOrder = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    customerId: data.customerId,
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    status: data.status,
    items: data.items,
    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,
    tokensEarned: data.tokensEarned,
    stripePaymentId: data.stripePaymentId,
    deliveryAddress: data.deliveryAddress,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Create a new order from cart items
 */
export const createOrder = async (
  customerId: string,
  customerEmail: string,
  customerName: string,
  cartItems: CartItem[],
  deliveryAddress: DeliveryAddress,
  subtotal: number,
  shipping: number,
  total: number,
  tokensEarned: number,
  stripePaymentId?: string
): Promise<Order> => {
  try {
    // Convert cart items to order items
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      producerId: item.producerId,
      producerName: item.producerName,
    }));

    const orderData = {
      customerId,
      customerEmail,
      customerName,
      status: 'paid' as OrderStatus,
      items: orderItems,
      subtotal,
      shipping,
      total,
      tokensEarned,
      stripePaymentId,
      deliveryAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);

    // Update product stock for each item
    for (const item of cartItems) {
      await updateProductStock(item.productId, -item.quantity);
    }

    // Award tokens to customer
    await awardPurchaseTokens(customerId, tokensEarned, docRef.id);

    // Award tokens to producers (grouped by producer)
    const producerTotals = new Map<string, number>();
    for (const item of cartItems) {
      const current = producerTotals.get(item.producerId) || 0;
      producerTotals.set(item.producerId, current + item.price * item.quantity);
    }

    for (const [producerId, saleAmount] of producerTotals) {
      await awardSaleTokens(producerId, saleAmount, docRef.id);
    }

    // Clear the customer's cart
    await clearCart(customerId);

    return {
      id: docRef.id,
      customerId,
      customerEmail,
      customerName,
      status: 'paid',
      items: orderItems,
      subtotal,
      shipping,
      total,
      tokensEarned,
      stripePaymentId,
      deliveryAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get an order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docToOrder(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Get all orders for a customer
 */
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToOrder);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

/**
 * Get all orders containing products from a producer
 */
export const getProducerOrders = async (producerId: string): Promise<Order[]> => {
  try {
    // Note: Firestore doesn't support querying nested array fields directly
    // We fetch all orders and filter client-side for simplicity
    // In production, consider using a separate producer_orders collection
    const snapshot = await getDocs(
      query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    );

    const allOrders = snapshot.docs.map(docToOrder);

    // Filter orders that contain items from this producer
    return allOrders.filter((order) =>
      order.items.some((item) => item.producerId === producerId)
    );
  } catch (error) {
    console.error('Error fetching producer orders:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get recent orders (for admin/dashboard)
 */
export const getRecentOrders = async (limitCount: number = 10): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      // limit(limitCount) - would need to import limit from firebase
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limitCount).map(docToOrder);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Calculate producer's total sales from orders
 */
export const calculateProducerSales = async (producerId: string): Promise<number> => {
  try {
    const orders = await getProducerOrders(producerId);

    let totalSales = 0;
    for (const order of orders) {
      if (order.status !== 'cancelled') {
        for (const item of order.items) {
          if (item.producerId === producerId) {
            totalSales += item.price * item.quantity;
          }
        }
      }
    }

    return totalSales;
  } catch (error) {
    console.error('Error calculating producer sales:', error);
    throw error;
  }
};
