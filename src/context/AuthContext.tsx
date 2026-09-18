'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { IUser, SEUDepartment } from '@/types/user';
import { useToast } from '@/context/ToastContext';

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

      toast.success(`Welcome to SEU Basa, ${registeredUser.name}! Account registered successfully.`);
      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    try {
      api.post('/auth/logout').catch(() => {});
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
