'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user state from localStorage on mount.
  // The JWT lives in an httpOnly cookie — we cannot read it from JS.
  // We trust the user object in localStorage as the session indicator;
  // the server will return 401 when the cookie expires, at which point
  // the app should catch the error and call logout().
  useEffect(() => {
    try {
      // Check for current Pepta key
      let saved = localStorage.getItem('pepta_wholesale_user');

      // Migrate from legacy "Precious Play" key if present
      if (!saved) {
        const oldKey = localStorage.getItem('precious_wholesale_user');
        if (oldKey) {
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
    } catch {
      /* ignore parse errors */
    }
    queueMicrotask(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    if (res.success && res.data) {
      const userData = res.data.user || res.data
      // Token is set by the server as an httpOnly cookie — no client-side token handling
      setUser(userData)
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData))
      return res
    }
    throw new Error(res.message || 'Login failed')
  }

  const register = async (name, email, password) => {
    const parts = name.split(' ')
    const first = parts[0]
    const last = parts.slice(1).join(' ') || 'User'

    const res = await authApi.register(email, password, first, last)
    if (res.success && res.data) {
      const userData = res.data.user || res.data
      // Token is set by the server as an httpOnly cookie — no client-side token handling
      setUser(userData)
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData))
      return res
    }
    throw new Error(res.message || 'Registration failed')
  }

  const logout = async () => {
    try {
      // Ask the server to clear the httpOnly cookie
      await authApi.logout()
    } catch {
      // Even if the API call fails, clear client state
    }
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
