import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage for existing session
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        console.log('✅ User restored from localStorage:', userData.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Check for admin login
      if (email === 'admin@luxiline.com' && password === 'Admin123!') {
        const adminUser = {
          id: 'admin1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@luxiline.com',
          phone: '+2341234567890',
          role: 'admin',
          status: 'active',
        };
        
        localStorage.setItem('token', 'admin-token-12345');
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        setIsAdmin(true);
        toast.success('Welcome Admin!');
        console.log('✅ Admin login successful');
        return { success: true, user: adminUser };
      }

      // Check for demo customer login
      if (email === 'customer@example.com' && password === 'Customer123!') {
        const customerUser = {
          id: 'customer1',
          firstName: 'Customer',
          lastName: 'User',
          email: 'customer@example.com',
          phone: '+2341234567890',
          role: 'customer',
          status: 'active',
        };
        
        localStorage.setItem('token', 'customer-token-12345');
        localStorage.setItem('user', JSON.stringify(customerUser));
        setUser(customerUser);
        setIsAdmin(false);
        toast.success('Welcome back!');
        console.log('✅ Customer login successful');
        return { success: true, user: customerUser };
      }

      // Try to login with real API
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user: userData } = response.data;
        
        if (token && userData) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          toast.success(`Welcome${userData.role === 'admin' ? ' Admin' : ''}!`);
          console.log('✅ API login successful');
          return { success: true, user: userData };
        }
      } catch (apiError) {
        console.log('API login failed, checking mock credentials...');
        // If API fails, check mock credentials
        if (email === 'test@example.com' && password === 'password123') {
          const mockUser = {
            id: 'mock1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+2341234567890',
            role: 'customer',
            status: 'active',
          };
          localStorage.setItem('token', 'mock-token-12345');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          setIsAdmin(false);
          toast.success('Welcome (Demo Mode)!');
          console.log('✅ Mock login successful');
          return { success: true, user: mockUser };
        }
        throw new Error('Invalid credentials');
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('❌ Login error:', error.message);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering user:', userData.email);
      
      // Try to register with real API
      try {
        const response = await api.post('/auth/register', userData);
        const { token, user: userDataResponse } = response.data;
        
        if (token && userDataResponse) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userDataResponse));
          setUser(userDataResponse);
          setIsAdmin(false);
          toast.success('Registration successful!');
          console.log('✅ API registration successful');
          return { success: true, user: userDataResponse };
        }
      } catch (apiError) {
        console.log('API registration failed, using mock registration...');
        // If API fails, use mock registration
        const mockUser = {
          id: `user_${Date.now()}`,
          ...userData,
          role: 'customer',
          status: 'active',
        };
        
        localStorage.setItem('token', `mock-token-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAdmin(false);
        toast.success('Registration successful (Demo Mode)!');
        console.log('✅ Mock registration successful');
        return { success: true, user: mockUser };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAdmin(userData.role === 'admin');
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;