'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { IUser, SEUDepartment } from '@/types/user';
import { useToast } from '@/context/ToastContext';
import {
  auth,
  googleProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  isFirebaseConfigured,
} from '@/lib/firebase';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: SEUDepartment;
  studentId?: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem('seu_basa_token');
    const savedUser = localStorage.getItem('seu_basa_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }

      // Verify session with server
      api
        .get('/auth/me')
        .then((res) => {
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('seu_basa_user', JSON.stringify(res.data.data.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('seu_basa_token');
          localStorage.removeItem('seu_basa_user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token: receivedToken } = res.data.data;

      setUser(loggedInUser);
      setToken(receivedToken);
      localStorage.setItem('seu_basa_token', receivedToken);
      localStorage.setItem('seu_basa_user', JSON.stringify(loggedInUser));

      toast.success(`Welcome back, ${loggedInUser.name || 'SEU Student'}! Logged in successfully.`);
      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      const { user: registeredUser, token: receivedToken } = res.data.data;

      setUser(registeredUser);
      setToken(receivedToken);
      localStorage.setItem('seu_basa_token', receivedToken);
      localStorage.setItem('seu_basa_user', JSON.stringify(registeredUser));

      toast.success(`Welcome to To Let SEU, ${registeredUser.name}! Account registered successfully.`);
      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      const msg = 'Firebase is not configured yet. Please add NEXT_PUBLIC_FIREBASE_* credentials to .env.local.';
      toast.error(msg);
      return { success: false, message: msg };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const email = (googleUser.email || '').toLowerCase().trim();

      if (!email.endsWith('@gmail.com')) {
        await auth.signOut();
        const msg = 'Only valid @gmail.com accounts are permitted to sign in.';
        toast.error(msg);
        return { success: false, message: msg };
      }

      // Sync with Express backend to create/login MongoDB user
      const res = await api.post('/auth/google', {
        email,
        name: googleUser.displayName || email.split('@')[0],
        avatarUrl: googleUser.photoURL || undefined,
        googleId: googleUser.uid,
      });

      const { user: loggedInUser, token: receivedToken } = res.data.data;

      setUser(loggedInUser);
      setToken(receivedToken);
      localStorage.setItem('seu_basa_token', receivedToken);
      localStorage.setItem('seu_basa_user', JSON.stringify(loggedInUser));

      toast.success(`Welcome, ${loggedInUser.name}! Signed in with Google.`);
      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google sign-in popup was closed.' };
      }
      const message =
        err.response?.data?.message ||
        err.message ||
        'Google sign-in failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@gmail.com')) {
      const msg = 'Please enter a valid @gmail.com address.';
      toast.error(msg);
      return { success: false, message: msg };
    }

    if (!isFirebaseConfigured() || !auth) {
      const msg = 'Firebase is not configured yet. Please add NEXT_PUBLIC_FIREBASE_* credentials to .env.local.';
      toast.error(msg);
      return { success: false, message: msg };
    }

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      toast.success('Password reset link sent! Check your Gmail inbox.');
      return { success: true };
    } catch (err: any) {
      const message =
        err.code === 'auth/user-not-found'
          ? 'No account found with this Gmail address in Firebase.'
          : err.message || 'Failed to send password reset email.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    try {
      api.post('/auth/logout').catch(() => {});
      if (auth) {
        auth.signOut().catch(() => {});
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('seu_basa_token');
      localStorage.removeItem('seu_basa_user');
      toast.success('Logged out successfully. See you soon!');
    } catch {
      toast.error('Logout encountered an issue.');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        localStorage.setItem('seu_basa_user', JSON.stringify(res.data.data.user));
      }
    } catch (e) {}
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('seu_basa_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isModerator,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
