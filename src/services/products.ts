/**
 * Product Service
 * CRUD operations for products in Firestore
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
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { Product, ProductFormData, ProductCategory } from '@/types/database';

const PRODUCTS_COLLECTION = 'products';

/**
 * Convert Firestore document to Product type
 */
const docToProduct = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    producerId: data.producerId,
    producerName: data.producerName,
    producerAvatar: data.producerAvatar,
    producerRating: data.producerRating,
    name: data.name,
    description: data.description,
    price: data.price,
    unit: data.unit,
    category: data.category,
    imageUrl: data.imageUrl,
    stockQuantity: data.stockQuantity,
    isAvailable: data.isAvailable,
    distance: data.distance,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Get all available products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  category: ProductCategory
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * Get products by producer ID
 */
export const getProductsByProducer = async (
  producerId: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('producerId', '==', producerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToProduct);
  } catch (error) {
    console.error('Error fetching products by producer:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docToProduct(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (
  producerId: string,
  producerName: string,
  producerAvatar: string,
  producerRating: number,
  productData: ProductFormData
): Promise<Product> => {
  try {
    const newProduct = {
      ...productData,
      producerId,
      producerName,
      producerAvatar,
      producerRating,
      isAvailable: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);

    return {
      id: docRef.id,
      ...productData,
      producerId,
      producerName,
      producerAvatar,
      producerRating,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  productId: string,
  updates: Partial<ProductFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product (soft delete - sets isAvailable to false)
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      isAvailable: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Hard delete a product (permanently removes from database)
 */
export const hardDeleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error hard deleting product:', error);
    throw error;
  }
};

/**
 * Update product stock quantity
 */
export const updateProductStock = async (
  productId: string,
  quantityChange: number
): Promise<void> => {
  try {
    const product = await getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = product.stockQuantity + quantityChange;
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);

    await updateDoc(docRef, {
      stockQuantity: Math.max(0, newQuantity),
      isAvailable: newQuantity > 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // For a production app, consider using Algolia or ElasticSearch
    // This is a simple client-side filter for the demo
    const products = await getAllProducts();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        product.description.toLowerCase().includes(lowerSearchTerm) ||
        product.producerName.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
