import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { 
  FiSearch, FiFilter, FiGrid, FiList, FiShoppingCart, FiX,
  FiArrowLeft, FiArrowRight, FiStar, FiHeart, FiEye, FiSliders,
  FiChevronDown, FiLoader, FiCheck, FiPackage, FiClock, FiZap,
  FiShoppingBag, FiRefreshCw, FiMinus, FiPlus, FiCheckCircle
} from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

// Fallback mock data for when API fails
const FALLBACK_PRODUCTS = [
  {
    _id: '1',
    name: 'Professional Hair Dryer',
    description: 'High-performance professional hair dryer with ionic technology for faster drying and less damage.',
    price: 45000,
    stock: 25,
    sku: 'HD-001',
    images: ['https://images.unsplash.com/photo-1519415387722-a1c3bbef9e54?w=400'],
    category: { _id: 'cat1', name: 'Salon Equipment', slug: 'salon-equipment' },
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Premium Shampoo Set',
    description: 'Complete hair care set with shampoo, conditioner, and treatment mask for all hair types.',
    price: 8500,
    stock: 50,
    sku: 'SS-002',
    images: ['https://images.unsplash.com/photo-1553531381-41c9ea81f06d?w=400'],
    category: { _id: 'cat2', name: 'Hair Products', slug: 'hair-products' },
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Salon Chair Set',
    description: 'Comfortable and adjustable salon chair set for professional use.',
    price: 29999,
    stock: 10,
    sku: 'SC-003',
    images: ['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400'],
    category: { _id: 'cat1', name: 'Salon Equipment', slug: 'salon-equipment' },
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Nail Polish Collection',
    description: 'Complete nail polish collection with 48 vibrant colors and professional finish.',
    price: 7999,
    stock: 30,
    sku: 'NC-004',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'],
    category: { _id: 'cat4', name: 'Nails & Accessories', slug: 'nails-accessories' },
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Eyelash Extension Kit',
    description: 'Professional eyelash extension kit with multiple lengths and types.',
    price: 12999,
    stock: 15,
    sku: 'EK-005',
    images: ['https://images.unsplash.com/photo-1586841559683-f84c22106e4f?w=400'],
    category: { _id: 'cat5', name: 'Eyelashes & Accessories', slug: 'eyelashes-accessories' },
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Premium Weavon Bundle',
    description: 'High-quality human hair weavon bundle for natural look and feel.',
    price: 15999,
    stock: 20,
    sku: 'WB-006',
    images: ['https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=400'],
    category: { _id: 'cat6', name: 'Weavons', slug: 'weavons' },
    featured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_CATEGORIES = [
  { _id: 'cat1', name: 'Salon Equipment', slug: 'salon-equipment', description: 'Professional salon equipment', status: 'active' },
  { _id: 'cat2', name: 'Hair Products', slug: 'hair-products', description: 'Premium hair products', status: 'active' },
  { _id: 'cat3', name: 'Salon Materials', slug: 'salon-materials', description: 'Professional salon supplies', status: 'active' },
  { _id: 'cat4', name: 'Nails & Accessories', slug: 'nails-accessories', description: 'Nail care products', status: 'active' },
  { _id: 'cat5', name: 'Eyelashes & Accessories', slug: 'eyelashes-accessories', description: 'Eyelash extensions', status: 'active' },
  { _id: 'cat6', name: 'Weavons', slug: 'weavons', description: 'Quality weavons', status: 'active' },
  { _id: 'cat7', name: 'Tattoos', slug: 'tattoos', description: 'Tattoo supplies', status: 'active' },
  { _id: 'cat8', name: 'Wig Tools', slug: 'wig-tools', description: 'Wig tools and accessories', status: 'active' },
];

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex text-amber-400 text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {rating >= star ? (
            <FiStar className="w-4 h-4 fill-current text-amber-400" />
          ) : rating >= star - 0.5 ? (
            <div className="relative">
              <FiStar className="w-4 h-4 text-gray-300 fill-current" />
              <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                <FiStar className="w-4 h-4 fill-current text-amber-400" />
              </div>
            </div>
          ) : (
            <FiStar className="w-4 h-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onQuickView, isWishlisted, onToggleWishlist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', color: 'bg-red-500' };
    if (product.stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-500' };
    return { text: 'In Stock', color: 'bg-green-500' };
  };

  const stockStatus = getStockStatus();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isAdded || product.stock === 0) return;
    
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      onAddToCart(product);
      setTimeout(() => setIsAdded(false), 2000);
    }, 350);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative">
      {/* Badges */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gray-900 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            Featured
          </span>
        </div>
      )}
      
      {/* Stock Status Badge */}
      {product.stock === 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            Out of Stock
          </span>
        </div>
      )}
      
      {product.stock > 0 && product.stock <= 10 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-yellow-500 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            Low Stock
          </span>
        </div>
      )}
      
      {/* Wishlist button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
          isWishlisted 
            ? 'bg-rose-50 text-rose-500 border border-rose-200 scale-110' 
            : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500 hover:bg-white'
        }`} 
        aria-label="Add to wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
      </button>

      {/* Quick View Button */}
      <button 
        onClick={() => onQuickView(product)}
        className="absolute top-14 right-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
        title="Quick View"
      >
        <FiEye className="w-4 h-4" />
      </button>
      
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer"
      >
        <img 
          src={product.images?.[0] || `https://placehold.co/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => { 
            e.target.src = `https://placehold.co/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Quick add overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={handleAdd}
            disabled={isAdding || isAdded || product.stock === 0}
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${
              product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white/95 backdrop-blur-md text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}
          >
            {isAdding ? (
              <><FiLoader className="w-4 h-4 animate-spin" /> Adding...</>
            ) : isAdded ? (
              <><FiCheck className="w-4 h-4 text-emerald-500" /> Added to Cart</>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <><FiShoppingBag className="w-4 h-4" /> Quick Add</>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">{product.category?.name}</div>
        <h3 
          onClick={() => onQuickView(product)}
          className="text-base font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={4.5} />
          <span className="text-xs text-gray-500 font-medium">(24)</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className={`text-xs font-medium ${stockStatus.text === 'In Stock' ? 'text-green-600' : stockStatus.text === 'Low Stock' ? 'text-yellow-600' : 'text-red-600'}`}>
              {stockStatus.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick View Modal
const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 shadow-md"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 aspect-square md:aspect-auto bg-gray-100 relative">
          <img 
            src={product.images?.[0] || `https://placehold.co/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="text-xs uppercase font-bold text-blue-600 tracking-widest mb-1">{product.category?.name}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={4.5} />
            <span className="text-xs text-gray-500">(24 reviews)</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 mb-4">{formatPrice(product.price)}</div>
          
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-4">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-4 items-center">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-600"><FiMinus className="w-4 h-4" /></button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 text-gray-600"><FiPlus className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={product.stock === 0}
                className={`flex-1 py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg ${
                  product.stock > 0
                    ? 'bg-gray-900 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingBag className="w-4 h-4" /> 
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Search Modal
const SearchModal = ({ isOpen, onClose, products, onQuickView }) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    return products.filter(p => 
      p.name?.toLowerCase().includes(query.toLowerCase()) || 
      p.category?.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <FiSearch className="w-6 h-6 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base outline-none text-gray-900 placeholder-gray-400"
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto divide-y divide-gray-100">
          {query.trim() && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">No products found matching "{query}"</p>
          )}

          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              onClick={() => {
                onQuickView(product);
                onClose();
              }}
              className="py-3 flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <img 
                src={product.images?.[0] || `https://placehold.co/50x50/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`} 
                alt={product.name} 
                className="w-12 h-14 object-cover rounded bg-gray-100" 
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                <span className="text-xs text-blue-600 font-medium">{product.category?.name}</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // Update URL params
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.page > 1) params.set('page', filters.page);
    setSearchParams(params);
  }, [filters]);

  // Toast notifications
  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(FALLBACK_CATEGORIES);
      setUsingFallback(true);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', filters.page);
      params.append('limit', 20);

      const response = await api.get(`/products?${params}`);
      
      if (response.products && response.products.length > 0) {
        setProducts(response.products);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: response.products.length,
          pages: 1,
        });
        setUsingFallback(false);
      } else {
        useFallbackProducts();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      useFallbackProducts();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackProducts = () => {
    let filtered = [...FALLBACK_PRODUCTS];
    
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category._id === filters.category || 
        p.category.slug === filters.category
      );
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setProducts(filtered);
    setPagination({
      page: 1,
      limit: 20,
      total: filtered.length,
      pages: 1,
    });
    setUsingFallback(true);
    setError(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
    setShowFilters(false);
  };

  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(p => p._id === product._id);
      if (exists) {
        addToast(`Removed from wishlist`);
        return prev.filter(p => p._id !== product._id);
      } else {
        addToast(`Added to wishlist`);
        return [...prev, product];
      }
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId || c.slug === categoryId);
    return category?.name || 'Category';
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-gray-200"></div>
          <div className="p-4">
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IoSparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Shop</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {filters.search ? `Search Results: "${filters.search}"` : 'Our Collection'}
              </h1>
              <p className="text-gray-300 mt-1">
                {pagination.total > 0 ? `${pagination.total} products found` : 'Browse our extensive catalogue'}
                {usingFallback && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                    Demo Mode
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              
              {/* View Toggle */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
                  }`}
                  title="List View"
                >
                  <FiList size={18} />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-colors ${
                  showFilters 
                    ? 'bg-white text-gray-900' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Toggle Filters"
              >
                <FiSliders className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`md:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-elegant p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FiSliders className="w-5 h-5 text-blue-600" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug || cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      min="0"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>

                {/* Active Filters */}
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice) && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.category && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center border border-blue-200">
                          {getCategoryName(filters.category)}
                          <button
                            onClick={() => handleFilterChange('category', '')}
                            className="ml-1.5 hover:text-blue-900"
                          >
                            <FiX size={12} />
                          </button>
                        </span>
                      )}
                      {filters.search && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center border border-blue-200">
                          "{filters.search}"
                          <button
                            onClick={() => handleFilterChange('search', '')}
                            className="ml-1.5 hover:text-blue-900"
                          >
                            <FiX size={12} />
                          </button>
                        </span>
                      )}
                      {(filters.minPrice || filters.maxPrice) && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center border border-blue-200">
                          ₦{filters.minPrice || '0'} - ₦{filters.maxPrice || '∞'}
                          <button
                            onClick={() => {
                              handleFilterChange('minPrice', '');
                              handleFilterChange('maxPrice', '');
                            }}
                            className="ml-1.5 hover:text-blue-900"
                          >
                            <FiX size={12} />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-sm"
                >
                  Clear All Filters
                </button>

                {usingFallback && (
                  <button
                    onClick={fetchProducts}
                    className="w-full py-2.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <FiRefreshCw className="w-4 h-4" /> Connect to Server
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSkeleton />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-elegant p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">
                  {filters.search || filters.category || filters.minPrice || filters.maxPrice
                    ? 'Try adjusting your filters or search terms'
                    : 'No products are available at the moment'}
                </p>
                {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-700">{products.length}</span> of{' '}
                    <span className="font-semibold text-gray-700">{pagination.total}</span> products
                  </p>
                </div>

                {/* Products Grid/List */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                    : 'space-y-4'
                }>
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id}
                      product={product}
                      onAddToCart={addToCart}
                      onQuickView={setQuickViewProduct}
                      isWishlisted={wishlistItems.some(p => p._id === product._id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        if (pageNum > 0 && pageNum <= pagination.pages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-xl transition-colors text-sm font-medium ${
                                pageNum === pagination.page
                                  ? 'bg-gray-900 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal 
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={setQuickViewProduct}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;