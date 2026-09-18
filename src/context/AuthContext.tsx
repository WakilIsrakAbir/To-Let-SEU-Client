'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { IUser, SEUDepartment } from '@/types/user';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seu_basa_token');
    }
    return null;
  });

  const [user, setUser] = useState<IUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('seu_basa_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Verify session with server on startup
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('seu_basa_token') : null;

    // Verify session with server
    if (savedToken) {
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

      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Login failed. Please check credentials.';
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

      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('seu_basa_token');
    localStorage.removeItem('seu_basa_user');
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
