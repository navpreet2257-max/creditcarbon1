import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('carbon_credit_token');
    const businessData = localStorage.getItem('carbon_credit_business');
    
    if (token && businessData) {
      setIsAuthenticated(true);
      setBusiness(JSON.parse(businessData));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, business_id, business_name } = response.data;
      
      // Store token and business data
      localStorage.setItem('carbon_credit_token', access_token);
      const businessData = { id: business_id, name: business_name, email };
      localStorage.setItem('carbon_credit_business', JSON.stringify(businessData));
      
      setIsAuthenticated(true);
      setBusiness(businessData);
      
      toast.success(`Welcome back, ${business_name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (businessData) => {
    try {
      const response = await authAPI.register(businessData);
      const { access_token, business_id, business_name } = response.data;
      
      // Store token and business data
      localStorage.setItem('carbon_credit_token', access_token);
      const business = { id: business_id, name: business_name, email: businessData.email };
      localStorage.setItem('carbon_credit_business', JSON.stringify(business));
      
      setIsAuthenticated(true);
      setBusiness(business);
      
      toast.success(`Welcome to Carbon Credit, ${business_name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('carbon_credit_token');
    localStorage.removeItem('carbon_credit_business');
    setIsAuthenticated(false);
    setBusiness(null);
    toast.info('You have been logged out');
  };

  const value = {
    isAuthenticated,
    business,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};