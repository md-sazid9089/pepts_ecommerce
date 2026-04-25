'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import apiClient from '@/services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount with migration from old "Precious Play" keys
  useEffect(() => {
    try {
      // Check for new Pepta key first
      let saved = localStorage.getItem('pepta_wholesale_user');
      
      // If not found, check for old "Precious Play" key and migrate
      if (!saved) {
        const oldKey = localStorage.getItem('precious_wholesale_user');
        if (oldKey) {
          // Migrate old key to new key
          localStorage.setItem('pepta_wholesale_user', oldKey);
          localStorage.removeItem('precious_wholesale_user');
          saved = oldKey;
        }
      }

      if (saved) {
        const savedUser = JSON.parse(saved);
        queueMicrotask(() => {
          setUser(savedUser);
          setIsLoading(false);
        });
        return;
      }
    } catch (e) {
      /* ignore */
    }
    queueMicrotask(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    if (res.success && res.data) {
      const userData = res.data.user || res.data
      const token = res.data.token
      
      setUser(userData)
      if (token) apiClient.setToken(token)
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData))
      return res
    }
    throw new Error(res.message || 'Login failed')
  }

  const register = async (name, email, password) => {
    // Split name into first/last for the API
    const parts = name.split(' ')
    const first = parts[0]
    const last = parts.slice(1).join(' ') || 'User'
    
    const res = await authApi.register(email, password, first, last)
    if (res.success && res.data) {
      const userData = res.data.user || res.data
      const token = res.data.token

      setUser(userData)
      if (token) apiClient.setToken(token)
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData))
      return res
    }
    throw new Error(res.message || 'Registration failed')
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    localStorage.removeItem('pepta_wholesale_user')
  }

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(updated));
    } catch (e) {
      /* ignore */
    }
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
