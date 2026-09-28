'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUser, userExists, getUserData } from '@/lib/userService';

export interface AuthUser extends User {
  pro?: boolean;
  points?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase auth is not configured, skip auth listener
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
            const dbUser = await getUserData(firebaseUser.uid);
            const extendedUser: AuthUser = {
                ...firebaseUser,
                pro: dbUser?.pro || false,
                points: dbUser?.points || 0
            };
            setUser(extendedUser);
        } catch (error) {
            console.error("Error fetching user data", error);
            setUser(firebaseUser as AuthUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase authentication is not configured.');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const exists = await userExists(user.uid);
      
      if (!exists) {
        await createUser(
          user.uid,
          user.email || '',
          user.displayName || 'User',
          user.photoURL
        );
        window.location.href = '/onboarding';
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase authentication is not configured.');
    try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        console.error("Error signing in with Email", error);
        throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) throw new Error('Firebase authentication is not configured.');
    try {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        
        await updateProfile(user, { displayName: name });
        
        await createUser(
            user.uid,
            email,
            name,
            null
        );
        
    } catch (error) {
        console.error("Error signing up with Email", error);
        throw error;
    }
  };

  const logOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

