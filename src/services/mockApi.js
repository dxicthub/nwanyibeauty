// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Professional Hair Dryer',
    description: 'High-performance professional hair dryer with ionic technology for faster drying and less damage.',
    price: 89.99,
    stock: 25,
    sku: 'HD-001',
    images: ['https://images.unsplash.com/photo-1519415387722-a1c3bbef9e54?w=400'],
    category: { _id: 'cat1', name: 'Salon Equipment', slug: 'salon-equipment' },
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  // ... more products as defined earlier
];

const mockCategories = [
  { _id: 'cat1', name: 'Salon Equipment', slug: 'salon-equipment', description: 'Professional salon equipment', status: 'active' },
  // ... more categories as defined earlier
];

const mockSettings = {
  businessName: 'Luxiline Beauty',
  businessEmail: 'info@luxiline.com',
  phoneNumber: '+1234567890',
  whatsappNumber: '+1234567890',
  // ... more settings as defined earlier
};

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getProducts: async (params = {}) => {
    await delay(300);
    // ... filtering logic as defined earlier
    return {
      data: {
        success: true,
        products: filteredProducts,
        pagination: {
          page: 1,
          limit: 20,
          total: filteredProducts.length,
          pages: Math.ceil(filteredProducts.length / 20),
        },
      },
    };
  },
  // ... other mock functions as defined earlier
};