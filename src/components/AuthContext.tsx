import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id?: string | number;
  full_name?: string;
  email?: string;
  role?: 'customer' | 'admin';
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userProfile: UserProfile) => void;
  logout: () => void;
}

// ============================================================================
// Constants (match auth.js)
// ============================================================================

const AUTH_TOKEN_KEY = 'auth_token';
const USER_PROFILE_KEY = 'user_profile';

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const profileStr = localStorage.getItem(USER_PROFILE_KEY);
      if (token && profileStr) {
        return JSON.parse(profileStr) as UserProfile;
      }
    } catch {}
    return null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = useCallback((token: string, userProfile: UserProfile) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch {}
    setUser(userProfile);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_PROFILE_KEY);
    } catch {}
    setUser(null);
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY || e.key === USER_PROFILE_KEY) {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const profileStr = localStorage.getItem(USER_PROFILE_KEY);
        if (token && profileStr) {
          try {
            setUser(JSON.parse(profileStr));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useAuth = () => useContext(AuthContext);
