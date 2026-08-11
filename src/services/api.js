import axios from 'axios';
import { 
  mockProducts, 
  mockCategories, 
  getAllProducts, 
  getProductsByCategory, 
  getProductById 
} from './mockProducts';

// Use mock data - set to true to bypass MongoDB
const USE_MOCK = true;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const realApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Helper for mock delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // GET requests
  get: async (url, params = {}) => {
    if (USE_MOCK) {
      await delay(300);
      
      // Handle products request
      if (url === '/products' || url.startsWith('/products?')) {
        let products = getAllProducts();
        
        // Apply filters from params
        if (params.category) {
          products = products.filter(p => 
            p.category.slug === params.category || 
            p.category._id === params.category
          );
        }
        if (params.search) {
          const search = params.search.toLowerCase();
          products = products.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search) ||
            p.sku?.toLowerCase().includes(search)
          );
        }
        if (params.featured === 'true') {
          products = products.filter(p => p.featured);
        }
        if (params.minPrice) {
          products = products.filter(p => p.price >= parseFloat(params.minPrice));
        }
        if (params.maxPrice) {
          products = products.filter(p => p.price <= parseFloat(params.maxPrice));
        }
        
        // Sort
        if (params.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
        else if (params.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
        else if (params.sort === 'name_asc') products.sort((a, b) => a.name.localeCompare(b.name));
        else if (params.sort === 'name_desc') products.sort((a, b) => b.name.localeCompare(a.name));
        else if (params.sort === 'newest') products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Pagination
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const total = products.length;
        const start = (page - 1) * limit;
        const paginatedProducts = products.slice(start, start + limit);
        
        return {
          products: paginatedProducts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      }
      
      // Handle single product
      if (url.startsWith('/products/')) {
        const id = url.split('/')[2];
        const product = getProductById(id);
        return { product };
      }
      
      // Handle categories
      if (url === '/categories') {
        return { categories: mockCategories };
      }
      
      // Handle settings
      if (url === '/settings') {
        return {
          settings: {
            businessName: 'Luxiline Beauty',
            businessEmail: 'info@luxiline.com',
            phoneNumber: '+2341234567890',
            whatsappNumber: '+2341234567890',
            address: {
              street: '123 Beauty Street',
              city: 'Lagos',
              state: 'Lagos',
              country: 'Nigeria',
              postalCode: '100001',
            },
            socialMedia: {
              facebook: 'https://facebook.com/luxilinebeauty',
              instagram: 'https://instagram.com/luxilinebeauty',
              twitter: 'https://twitter.com/luxilinebeauty',
            },
            footerText: '© 2024 Luxiline Beauty. All rights reserved.',
            deliveryFee: 0,
            minimumOrderAmount: 0,
          },
        };
      }
      
      // Handle orders
      if (url === '/orders/my-orders') {
        return { orders: [] };
      }
      
      // Default response
      return { success: true, data: [] };
    }
    
    // Real API call
    try {
      const response = await realApi.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Real API error:', error);
      throw error;
    }
  },

  // POST requests
  post: async (url, data) => {
    if (USE_MOCK) {
      await delay(500);
      
      if (url === '/orders') {
        const newOrder = {
          _id: `order_${Date.now()}`,
          orderNumber: `ORD-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
          ...data,
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
        };
        return { success: true, order: newOrder };
      }
      
      if (url === '/auth/login') {
        if (data.email === 'admin@luxiline.com' && data.password === 'Admin123!') {
          return {
            success: true,
            token: 'mock-jwt-token-12345',
            user: {
              id: 'admin1',
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@luxiline.com',
              phone: '+2341234567890',
              role: 'admin',
            },
          };
        }
        if (data.email === 'test@example.com' && data.password === 'password123') {
          return {
            success: true,
            token: 'mock-jwt-token-67890',
            user: {
              id: 'user1',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              phone: '+2341234567890',
              role: 'customer',
            },
          };
        }
        throw new Error('Invalid credentials');
      }
      
      if (url === '/auth/register') {
        return {
          success: true,
          token: `mock-jwt-token-${Date.now()}`,
          user: {
            id: `user_${Date.now()}`,
            ...data,
            role: 'customer',
          },
        };
      }
      
      if (url === '/contact') {
        return { success: true, message: 'Message sent successfully' };
      }
      
      return { success: true, data: {} };
    }
    
    try {
      const response = await realApi.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Real API error:', error);
      throw error;
    }
  },

  // PUT requests
  put: async (url, data) => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true, data: {} };
    }
    try {
      const response = await realApi.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Real API error:', error);
      throw error;
    }
  },

  // DELETE requests
  delete: async (url) => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    try {
      const response = await realApi.delete(url);
      return response.data;
    } catch (error) {
      console.error('Real API error:', error);
      throw error;
    }
  },

  // PATCH requests
  patch: async (url, data) => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true, data: {} };
    }
    try {
      const response = await realApi.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Real API error:', error);
      throw error;
    }
  },
};

export default api;