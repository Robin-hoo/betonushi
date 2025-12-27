import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  dob?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user: User, expiresAt: number) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

const clearAuth = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
  };

  // Restore auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedExpiresAt = localStorage.getItem('token_expires_at');

    if (!storedToken || !storedUser || !storedExpiresAt) {
      setIsLoading(false);
      return;
    }

    const expiresAt = Number(storedExpiresAt);
    const isValid = Date.now() < expiresAt;

    if (!isValid) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setIsLoggedIn(true);
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, expiresAt: number) => {
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token_expires_at', expiresAt.toString());
  };

  const logout = () => {
    clearAuth();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        login,
        logout,
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
