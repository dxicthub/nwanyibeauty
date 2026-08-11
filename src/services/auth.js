src/services/Auth.jsimport api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [],
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      // If token is invalid, clear storage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      // Update stored user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return {
        success: true,
        message: response.data.message || 'Password updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update password',
      };
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to request password reset',
      };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password',
      };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return {
        success: true,
        message: response.data.message || 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify email',
      };
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return {
        success: true,
        message: response.data.message || 'Verification email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send verification email',
      };
    }
  },

  // Check if user has admin role
  isAdmin: () => {
    const user = authService.getStoredUser();
    return user?.role === 'admin';
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = authService.getStoredUser();
    return user?.role === role;
  },

  // Get user's full name
  getFullName: () => {
    const user = authService.getStoredUser();
    if (user) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return '';
  },

  // Get user's display name (fallback to email if no name)
  getDisplayName: () => {
    const fullName = authService.getFullName();
    if (fullName) return fullName;
    
    const user = authService.getStoredUser();
    return user?.email || 'User';
  },
};

// Export individual functions for convenience
export const {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
  getToken,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
  isAdmin,
  hasRole,
  getFullName,
  getDisplayName,
} = authService;

export default authService;