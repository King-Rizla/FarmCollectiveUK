/**
 * Activate Producer Mode
 * Quick utility to set current user as a producer
 */

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, User, Sprout } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ActivateProducer() {
  const { session, profile, isProducer, activateProducerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!session?.uid) {
      setError('You must be signed in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await activateProducerProfile();
      setSuccess(true);
    } catch (err) {
      console.error('Error activating producer:', err);
      setError('Failed to activate producer mode. Check console for details.');
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
                <Sprout className="h-6 w-6" />
                Activate Producer Mode
              </CardTitle>
              <CardDescription>
                Enable producer features for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!session ? (
                <div className="text-center py-6">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    You need to be signed in to activate producer mode.
                  </p>
                  <Link to="/signin">
                    <Button className="bg-green-700 hover:bg-green-800">
                      Sign In
                    </Button>
                  </Link>
                </div>
              ) : isProducer || success ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-green-800 font-medium mb-2">
                    Producer Mode Active!
                  </p>
                  <p className="text-gray-600 mb-6">
                    You can now add products and manage your producer profile.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link to="/profile/producer">
                      <Button className="w-full bg-green-700 hover:bg-green-800">
                        Go to Producer Dashboard
                      </Button>
                    </Link>
                    <Link to="/admin/seed">
                      <Button variant="outline" className="w-full border-green-200">
                        Seed Demo Products
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Signed in as:</strong> {profile?.email || session.email}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>Current status:</strong> Consumer
                    </p>
                  </div>

                  <p className="text-gray-600">
                    Activating producer mode will allow you to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Add and manage products</li>
                    <li>View orders for your products</li>
                    <li>Earn tokens from sales</li>
                    <li>Access the producer dashboard</li>
                  </ul>

                  {error && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleActivate}
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      <>
                        <Sprout className="h-4 w-4 mr-2" />
                        Activate Producer Mode
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
