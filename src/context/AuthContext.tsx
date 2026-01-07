
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut as authSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface UserProfile {
  email: string;
  full_name?: string;
  avatar_url?: string;
  isProducer?: boolean;
}

interface AuthContextType {
  session: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isProducer: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  activateProducerProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProducer, setIsProducer] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setSession(user);
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userProfile = userDoc.data() as UserProfile;
            setProfile(userProfile);
            setIsProducer(userProfile.isProducer || false);
          } else {
            // Fallback: If auth exists but firestore doc doesn't (yet), creates it.
            const userProfile: UserProfile = { 
              email: user.email!,
              full_name: user.displayName || 'User',
              avatar_url: user.photoURL || '',
              isProducer: false
            };
            await setDoc(userDocRef, userProfile);
            setProfile(userProfile);
            setIsProducer(false);
          }
        } else {
          setSession(null);
          setProfile(null);
          setIsProducer(false);
        }
      } catch (error) {
        console.error("Auth State Change Error:", error);
        // Optional: Set an error state here if you have one
      } finally {
        setLoading(false); // <--- CRITICAL: This must ALWAYS run
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const newUserProfile: UserProfile = {
      email: user.email!,
      isProducer: false,
    };
    await setDoc(doc(db, 'users', user.uid), newUserProfile);
    // Manually set state after creation
    setProfile(newUserProfile);
    setSession(user);
    setIsProducer(false);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle loading the user data
  };

  const signInWithGoogle = async () => {
    // Note: We DO NOT set loading(true) here to avoid unmounting the UI
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Explicitly check/create profile immediately to ensure data exists before redirect
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const userProfile: UserProfile = { 
          email: user.email!,
          full_name: user.displayName || "User",
          avatar_url: user.photoURL || "",
          isProducer: false
        };
        await setDoc(userDocRef, userProfile);
        setProfile(userProfile);
      }
      // Session will be updated by the listener, but we can set it here too for responsiveness
      setSession(user);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await authSignOut(auth);
    // Clear state manually for instant UI feedback
    setSession(null);
    setProfile(null);
    setIsProducer(false);
  };

  const activateProducerProfile = async () => {
    if (!session) throw new Error("No user is logged in.");
    const userDocRef = doc(db, 'users', session.uid);
    await updateDoc(userDocRef, { isProducer: true });
    if (profile) {
      const updatedProfile = { ...profile, isProducer: true };
      setProfile(updatedProfile);
      setIsProducer(true);
    }
  };

  const value = {
    session,
    profile,
    loading,
    isProducer,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    activateProducerProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
