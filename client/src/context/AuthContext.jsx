'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (email, password) => {
    // Placeholder login logic
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      token: 'jwt_placeholder_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUser(userData);
    try {
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData));
    } catch (e) {
      /* ignore */
    }
    return userData;
  };

  const register = (name, email, password) => {
    // Placeholder register logic
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      token: 'jwt_placeholder_' + Date.now(),
      phone: '',
      address: '',
      createdAt: new Date().toISOString(),
    };
    setUser(userData);
    try {
      localStorage.setItem('pepta_wholesale_user', JSON.stringify(userData));
    } catch (e) {
      /* ignore */
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('pepta_wholesale_user');
    } catch (e) {
      /* ignore */
    }
  };

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
