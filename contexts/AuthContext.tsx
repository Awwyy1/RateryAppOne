import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { trackLogin } from '../utils/analytics';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Detect Safari browser
const isSafari = (): boolean => {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
};

// Detect standalone PWA mode (added to home screen)
const isStandalone = (): boolean => {
  return ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone) ||
    window.matchMedia('(display-mode: standalone)').matches;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle redirect result on page load (for Safari redirect flow)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          trackLogin();
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
      });
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    // Safari (especially PWA mode) doesn't support signInWithPopup reliably
    // Use signInWithRedirect for Safari, popup for everything else
    if (isSafari() || isStandalone()) {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (error) {
        console.error('Error signing in with redirect:', error);
        throw error;
      }
    } else {
      try {
        await signInWithPopup(auth, googleProvider);
        trackLogin();
      } catch (error) {
        // If popup fails (blocked, etc.), fall back to redirect
        console.warn('Popup sign-in failed, trying redirect:', error);
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect sign-in also failed:', redirectError);
          throw redirectError;
        }
      }
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
