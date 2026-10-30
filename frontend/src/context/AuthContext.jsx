import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nutrilife_token'));
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize and check user session from JWT
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('nutrilife_token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setHasProfile(false);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setHasProfile(Boolean(response.data.user.hasProfile));
      } else {
        localStorage.removeItem('nutrilife_token');
        setUser(null);
        setToken(null);
        setHasProfile(false);
      }
    } catch (err) {
      console.warn('Session verification error:', err.response?.data?.message || err.message);
      localStorage.removeItem('nutrilife_token');
      setUser(null);
      setToken(null);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser, hasProfile: profileStatus } = response.data;
      localStorage.setItem('nutrilife_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setHasProfile(Boolean(profileStatus));
      return { success: true, hasProfile: Boolean(profileStatus) };
    }
    return { success: false, message: response.data.message };
  };

  // Register
  const register = async (formData) => {
    const response = await authService.register(formData);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('nutrilife_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setHasProfile(false);
      return { success: true };
    }
    return { success: false, message: response.data.message };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('nutrilife_token');
    setToken(null);
    setUser(null);
    setHasProfile(false);
  };

  // Update profile status locally
  const markProfileCreated = (updatedProfile) => {
    setHasProfile(true);
    setUser((prev) => (prev ? { ...prev, profile: updatedProfile, hasProfile: true } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        hasProfile,
        loading,
        login,
        register,
        logout,
        refreshUserData: checkAuth,
        markProfileCreated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
