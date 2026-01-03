
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut as authSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

// Define the shape of the user profile
interface UserProfile {
  email: string;
  full_name?: string;
  avatar_url?: string;
  isProducer?: boolean;
  // Add other profile fields as necessary
}

// Define the shape of the context value
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

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
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
      if (user) {
        setSession(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userProfile = userDoc.data() as UserProfile;
          setProfile(userProfile);
          setIsProducer(userProfile.isProducer || false);
        } else {
          // Handle case where user exists in auth but not in firestore
          const userProfile: UserProfile = { 
            email: user.email!,
            full_name: user.displayName,
            avatar_url: user.photoURL,
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile: UserProfile = {
      email: user.email!,
      isProducer: false, // Default value for new users
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    setSession(user);
    setProfile(userProfile);
    setIsProducer(false);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting session and profile
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged will handle setting session and profile
  };

  const signOut = async () => {
    await authSignOut(auth);
    setSession(null);
    setProfile(null);
    setIsProducer(false);
  };

  const activateProducerProfile = async () => {
    if (!session) throw new Error("No user is logged in.");
    const userDocRef = doc(db, 'users', session.uid);
    await updateDoc(userDocRef, { isProducer: true });
    if(profile){
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
