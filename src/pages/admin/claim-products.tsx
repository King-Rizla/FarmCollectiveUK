/**
 * Claim All Products
 * Updates all products in database to belong to current user (for testing)
 */

import { useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClaimProducts() {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const claimAllProducts = async () => {
    if (!session?.uid) {
      setStatus('You must be signed in.');
      return;
    }

    setLoading(true);
    setStatus('Claiming all products...');

    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      let count = 0;
      for (const docSnapshot of snapshot.docs) {
        await updateDoc(doc(db, 'products', docSnapshot.id), {
          producerId: session.uid,
          producerName: profile?.name || profile?.full_name || 'Your Farm',
          producerAvatar: profile?.avatar || profile?.avatar_url || '',
        });
        count++;
        setStatus(`Updated ${count}/${snapshot.docs.length} products...`);
      }

      setStatus(`Done! Claimed ${count} products.`);
      setSuccess(true);
    } catch (error) {
      console.error('Error claiming products:', error);
      setStatus('Failed to claim products. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Claim All Products (Testing)
              </CardTitle>
              <CardDescription>
                Assign all marketplace products to your account for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!session ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    You need to be signed in.
                  </p>
                  <Link to="/signin">
                    <Button className="bg-green-700 hover:bg-green-800">
                      Sign In
                    </Button>
                  </Link>
                </div>
              ) : success ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-green-800 font-medium mb-2">
                    All Products Claimed!
                  </p>
                  <p className="text-gray-600 mb-6">
                    All marketplace products now belong to your account.
                  </p>
                  <Link to="/profile/producer">
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      Go to Producer Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Testing Mode:</strong> This will update all products
                      in the database to have your user ID as the producer.
                      You'll be able to edit and delete them from your producer profile.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Your User ID:</strong> {session.uid}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>Display Name:</strong> {profile?.name || profile?.full_name || 'Not set'}
                    </p>
                  </div>

                  {status && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">{status}</p>
                    </div>
                  )}

                  <Button
                    onClick={claimAllProducts}
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Claim All Products
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
