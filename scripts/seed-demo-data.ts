/**
 * Demo Data Seed Script
 * Populates Firestore with sample products for demonstration
 *
 * Run this in the browser console or create a seed page to execute.
 * Alternatively, import and call seedDemoData() from a component.
 */

import { collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

// Demo Producer IDs (these should match actual user IDs after sign-up)
// For the demo, we'll use placeholder IDs that can be updated
const DEMO_PRODUCER_ID = 'demo-producer-001';

// Demo Products Data
const demoProducts = [
  {
    producerId: DEMO_PRODUCER_ID,
    producerName: 'Meadow Vale Farm',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeadowVale',
    producerRating: 4.8,
    name: 'Organic Carrots',
    description: 'Freshly harvested organic carrots, grown without pesticides. Sweet, crunchy, and perfect for salads, roasting, or juicing.',
    price: 2.49,
    unit: 'kg',
    category: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
    stockQuantity: 50,
    isAvailable: true,
  },
  {
    producerId: DEMO_PRODUCER_ID,
    producerName: 'Meadow Vale Farm',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeadowVale',
    producerRating: 4.8,
    name: 'Heritage Tomatoes',
    description: 'A colorful mix of heritage tomato varieties. Bursting with flavor, these tomatoes are vine-ripened for maximum taste.',
    price: 3.99,
    unit: 'kg',
    category: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80',
    stockQuantity: 30,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-002',
    producerName: 'Sunrise Orchards',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunriseOrchards',
    producerRating: 4.9,
    name: 'Honeycrisp Apples',
    description: 'Crisp, sweet, and perfectly balanced Honeycrisp apples. Hand-picked at peak ripeness from our family orchard.',
    price: 4.50,
    unit: 'kg',
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80',
    stockQuantity: 75,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-002',
    producerName: 'Sunrise Orchards',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunriseOrchards',
    producerRating: 4.9,
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked fresh daily. Perfect for desserts, smoothies, or eating straight from the punnet.',
    price: 5.99,
    unit: 'punnet',
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80',
    stockQuantity: 40,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-003',
    producerName: 'Green Valley Dairy',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley',
    producerRating: 4.7,
    name: 'Free-Range Eggs',
    description: 'Farm-fresh eggs from our happy, free-range hens. Rich, golden yolks and superior taste.',
    price: 4.25,
    unit: 'dozen',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=500&q=80',
    stockQuantity: 100,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-003',
    producerName: 'Green Valley Dairy',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GreenValley',
    producerRating: 4.7,
    name: 'Raw Organic Milk',
    description: 'Creamy, unpasteurized milk from grass-fed cows. Full of natural enzymes and nutrients.',
    price: 2.99,
    unit: 'litre',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80',
    stockQuantity: 25,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-004',
    producerName: 'Hillside Bakery',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HillsideBakery',
    producerRating: 4.9,
    name: 'Sourdough Loaf',
    description: 'Traditional sourdough bread made with our 50-year-old starter. Crusty exterior, soft interior, incredible flavor.',
    price: 4.50,
    unit: 'loaf',
    category: 'bakery',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    stockQuantity: 20,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-004',
    producerName: 'Hillside Bakery',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HillsideBakery',
    producerRating: 4.9,
    name: 'Butter Croissants',
    description: 'Flaky, buttery croissants baked fresh each morning. Made with real French butter.',
    price: 3.25,
    unit: 'pack of 4',
    category: 'bakery',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
    stockQuantity: 15,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-005',
    producerName: 'Riverside Herbs',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RiversideHerbs',
    producerRating: 4.6,
    name: 'Fresh Basil',
    description: 'Aromatic fresh basil, perfect for Italian dishes. Grown in our greenhouse for year-round availability.',
    price: 1.99,
    unit: 'bunch',
    category: 'herbs',
    imageUrl: 'https://images.unsplash.com/photo-1527792492728-08d07d011113?w=500&q=80',
    stockQuantity: 60,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-005',
    producerName: 'Riverside Herbs',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RiversideHerbs',
    producerRating: 4.6,
    name: 'Mixed Herb Box',
    description: 'A selection of fresh herbs: rosemary, thyme, sage, and oregano. Perfect for home cooks.',
    price: 4.99,
    unit: 'box',
    category: 'herbs',
    imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80',
    stockQuantity: 25,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-006',
    producerName: 'Oakwood Farm Meats',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OakwoodFarm',
    producerRating: 4.8,
    name: 'Grass-Fed Beef Mince',
    description: '100% grass-fed beef mince. Rich in flavor and perfect for bolognese, burgers, or meatballs.',
    price: 8.99,
    unit: '500g',
    category: 'meat',
    imageUrl: 'https://images.unsplash.com/photo-1602473812169-5c1c1767cdba?w=500&q=80',
    stockQuantity: 30,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-006',
    producerName: 'Oakwood Farm Meats',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OakwoodFarm',
    producerRating: 4.8,
    name: 'Free-Range Chicken',
    description: 'Whole free-range chicken, raised on pasture. Tender, flavorful, and ethically raised.',
    price: 12.99,
    unit: 'whole',
    category: 'meat',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&q=80',
    stockQuantity: 15,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-007',
    producerName: 'Artisan Provisions',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArtisanProvisions',
    producerRating: 4.9,
    name: 'Raw Local Honey',
    description: 'Pure, unprocessed honey from local wildflowers. Rich in enzymes and natural goodness.',
    price: 7.50,
    unit: '340g jar',
    category: 'specialty',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80',
    stockQuantity: 45,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-007',
    producerName: 'Artisan Provisions',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArtisanProvisions',
    producerRating: 4.9,
    name: 'Farmhouse Cheddar',
    description: 'Aged farmhouse cheddar with a rich, sharp flavor. Made using traditional methods.',
    price: 6.99,
    unit: '250g',
    category: 'specialty',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80',
    stockQuantity: 20,
    isAvailable: true,
  },
  {
    producerId: DEMO_PRODUCER_ID,
    producerName: 'Meadow Vale Farm',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeadowVale',
    producerRating: 4.8,
    name: 'Mixed Salad Leaves',
    description: 'A fresh mix of tender salad leaves including rocket, spinach, and lettuce. Ready to eat.',
    price: 2.99,
    unit: '150g bag',
    category: 'vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
    stockQuantity: 35,
    isAvailable: true,
  },
  {
    producerId: 'demo-producer-002',
    producerName: 'Sunrise Orchards',
    producerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunriseOrchards',
    producerRating: 4.9,
    name: 'Seasonal Pears',
    description: 'Sweet, juicy pears harvested at perfect ripeness. Excellent for eating fresh or poaching.',
    price: 3.75,
    unit: 'kg',
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=500&q=80',
    stockQuantity: 40,
    isAvailable: true,
  },
];

/**
 * Seed demo products to Firestore
 */
export async function seedDemoData(): Promise<void> {
  console.log('Starting demo data seed...');

  const productsRef = collection(db, 'products');
  let count = 0;

  for (const product of demoProducts) {
    try {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
      console.log(`Added: ${product.name}`);
    } catch (error) {
      console.error(`Failed to add ${product.name}:`, error);
    }
  }

  console.log(`Demo data seed complete! Added ${count} products.`);
}

/**
 * Clear all demo products from Firestore
 */
export async function clearDemoData(): Promise<void> {
  console.log('Clearing demo data...');

  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);

  let count = 0;
  for (const docSnapshot of snapshot.docs) {
    try {
      await deleteDoc(doc(db, 'products', docSnapshot.id));
      count++;
    } catch (error) {
      console.error(`Failed to delete ${docSnapshot.id}:`, error);
    }
  }

  console.log(`Cleared ${count} products.`);
}

/**
 * Reset demo data (clear and re-seed)
 */
export async function resetDemoData(): Promise<void> {
  await clearDemoData();
  await seedDemoData();
}

// Export for use in browser console or components
if (typeof window !== 'undefined') {
  (window as any).seedDemoData = seedDemoData;
  (window as any).clearDemoData = clearDemoData;
  (window as any).resetDemoData = resetDemoData;
}
