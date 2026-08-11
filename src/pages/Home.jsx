import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';

// Import Rush Hour Section
import RushHourSection from '../components/shop/RushHourSection';

// Import the updated ProductCard component
import ProductCard from '../components/shop/ProductCard';

// Import local hero banner images for carousel
import heroBanner1 from '../assets/images/hero_banner.jpg';
import heroBanner2 from '../assets/images/hero_banner2.jpg';
import heroBanner3 from '../assets/images/hero_banner3.jpg';
import heroBanner4 from '../assets/images/hero_banner4.jpg';
import heroBanner5 from '../assets/images/hero_banner5.jpg';
import heroBanner6 from '../assets/images/hero_banner6.jpg';
import heroBanner7 from '../assets/images/hero_banner7.jpg';
import heroBanner8 from '../assets/images/hero_banner8.jpg';
import heroBanner9 from '../assets/images/hero_banner9.jpg';
import heroBanner10 from '../assets/images/hero_banner10.jpg';
import heroBanner11 from '../assets/images/hero_banner11.jpg';
import heroBanner12 from '../assets/images/hero_banner12.jpg';
import heroBanner13 from '../assets/images/hero_banner13.jpg';

// Import CTA Background Image
import heroLastBg from '../assets/images/hero_last.jpg';

// Import Category Images
import cat1 from '../assets/images/home_cat/cat1.jpg';
import cat2 from '../assets/images/home_cat/cat2.jpg';
import cat3 from '../assets/images/home_cat/cat3.jpg';
import cat4 from '../assets/images/home_cat/cat4.jpg';
import cat5 from '../assets/images/home_cat/cat5.jpg';
import cat6 from '../assets/images/home_cat/cat6.jpg';
import cat7 from '../assets/images/home_cat/cat7.jpg';
import cat8 from '../assets/images/home_cat/cat8.jpg';
import cat9 from '../assets/images/home_cat/cat9.jpg';

// Import Why Choose Images
import why1 from '../assets/images/home_why_choose/why1.jpg';
import why2 from '../assets/images/home_why_choose/why2.jpg';
import why3 from '../assets/images/home_why_choose/why3.jpg';
import why4 from '../assets/images/home_why_choose/why4.jpg';
import why5 from '../assets/images/home_why_choose/why5.jpg';

// All icons from react-icons
import { 
  FiMenu, FiSearch, FiUser, FiShoppingCart, FiX, FiTruck, FiRefreshCw,
  FiShield, FiHeadphones, FiArrowRight, FiHeart, FiStar, FiCheckCircle,
  FiLoader, FiInfo, FiCheck, FiPlus, FiMinus, FiTrash2, FiEye, FiFilter,
  FiShoppingBag, FiClock, FiPackage, FiZap, FiSliders, FiLayers,
  FiPhone, FiMail, FiMapPin, FiChevronDown, FiGrid, FiList, FiTag,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { IoSparkles, IoAperture } from 'react-icons/io5';
import { FaRecycle } from 'react-icons/fa';

// Carousel Images - 13 images
const carouselImages = [
  heroBanner1,
  heroBanner2,
  heroBanner3,
  heroBanner4,
  heroBanner5,
  heroBanner6,
  heroBanner7,
  heroBanner8,
  heroBanner9,
  heroBanner10,
  heroBanner11,
  heroBanner12,
  heroBanner13,
];

// Category data with images
const CATEGORIES = [
  { id: 'hairs', title: 'Hairs', image: cat1 },
  { id: 'hair-products', title: 'Hair Products', image: cat2 },
  { id: 'salon-materials', title: 'Salon Materials', image: cat3 },
  { id: 'salon-equipment', title: 'Salon Equipment', image: cat4 },
  { id: 'nails-accessories', title: 'Nails & Accessories', image: cat5 },
  { id: 'eyelashes-accessories', title: 'Eyelashes & Accessories', image: cat6 },
  { id: 'weavons', title: 'Weavons', image: cat7 },
  { id: 'tattoos', title: 'Tattoos', image: cat8 },
  { id: 'wig-tools', title: 'Wig Tools', image: cat9 },
];

// Why Choose Data with Images - No Descriptions
const WHY_CHOOSE_DATA = [
  {
    id: 'w1',
    title: '',
    image: why1,
  },
  {
    id: 'w2',
    title: '',
    image: why2,
  },
  {
    id: 'w3',
    title: '',
    image: why3,
  },
  {
    id: 'w4',
    title: '',
    image: why4,
  },
  {
    id: 'w5',
    title: '',
    image: why5,
  },
];

// Store Services Data
const STORE_SERVICES = [
  {
    id: 's1',
    title: 'Express Worldwide Shipping',
    tagline: 'Fast & Reliable Delivery',
    icon: FiTruck,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'We deliver premium beauty products across Nigeria and beyond with speed and care.',
    perks: ['Real-time Tracking', 'Signature on Delivery', 'Safe Packaging', 'Nationwide Coverage']
  },
  {
    id: 's2',
    title: '24/7 Customer Support',
    tagline: 'We\'re Here to Help',
    icon: FiHeadphones,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    description: 'Our beauty experts are available around the clock to assist with your orders and questions.',
    perks: ['Live Chat Support', 'Email Assistance', 'Phone Support', 'WhatsApp Contact']
  },
  {
    id: 's3',
    title: 'Easy Returns & Exchanges',
    tagline: 'Hassle-Free Process',
    icon: FiRefreshCw,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'Not satisfied? Return or exchange your products within 30 days with our simple process.',
    perks: ['30-Day Returns', 'No Restocking Fees', 'Quick Refunds', 'Easy Exchange']
  },
  {
    id: 's4',
    title: 'Quality Guarantee',
    tagline: '100% Authentic Products',
    icon: FiShield,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    description: 'Every product in our catalogue is sourced from trusted brands and verified for quality.',
    perks: ['100% Authentic', 'Brand Verified', 'Quality Tested', 'Satisfaction Guaranteed']
  },
  {
    id: 's5',
    title: 'Wholesale Pricing',
    tagline: 'Best Deals for Professionals',
    icon: FaRecycle,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'Get competitive wholesale prices on bulk orders for your salon or beauty business.',
    perks: ['Bulk Discounts', 'Trade Pricing', 'Volume Savings', 'Business Accounts']
  },
];

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex text-amber-400 text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {rating >= star ? (
            <FiStar className="w-3.5 h-3.5 fill-current text-amber-400" />
          ) : rating >= star - 0.5 ? (
            <div className="relative">
              <FiStar className="w-3.5 h-3.5 text-gray-300 fill-current" />
              <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                <FiStar className="w-3.5 h-3.5 fill-current text-amber-400" />
              </div>
            </div>
          ) : (
            <FiStar className="w-3.5 h-3.5 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

// Why Choose Card Component - No Description Text, Centered Title
const WhyChooseCard = ({ item }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 w-full h-[320px] md:h-[360px] lg:h-[400px]">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/60 group-hover:via-black/20 transition-all duration-500"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl drop-shadow-lg">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onSelect }) => {
  const IconComponent = service.icon;
  return (
    <div 
      onClick={() => onSelect(service)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-50/50 to-transparent rounded-bl-full transition-transform group-hover:scale-110" />
      
      <div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${service.color}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] mb-1 block">
          Store Service
        </span>
        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#7C3AED] transition-colors">
          {service.title}
        </h3>
        <p className="text-xs font-semibold text-[#2563EB] mb-3">{service.tagline}</p>
        
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {service.description}
        </p>
      </div>

      <div className="pt-3 border-t border-purple-100/50 flex items-center justify-between text-xs font-semibold text-gray-800 group-hover:text-[#7C3AED]">
        <span>Learn More</span>
        <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

// Service Detail Modal
const ServiceDetailModal = ({ service, onClose }) => {
  if (!service) return null;
  const IconComponent = service.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${service.color}`}>
          <IconComponent className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-1 block">
          Nyanyi Guarantee
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h2>
        <p className="text-sm font-semibold text-[#2563EB] mb-4">{service.tagline}</p>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{service.description}</p>

        <h4 className="text-xs font-bold uppercase text-gray-700 mb-3 tracking-wider">Service Benefits</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {service.perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <FiCheckCircle className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-[#7C3AED] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#6D28D9] transition-colors"
        >
          Got It, Thanks!
        </button>
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
          <div className="text-xs uppercase font-bold text-[#7C3AED] tracking-widest mb-1">{product.category?.name}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={4.5} />
            <span className="text-xs text-gray-500">(24 reviews)</span>
          </div>

          <div className="text-2xl font-bold text-[#5B21B6] mb-4">{formatPrice(product.price)}</div>
          
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
                    ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
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
          <FiSearch className="w-6 h-6 text-[#7C3AED]" />
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
              className="py-3 flex items-center gap-4 hover:bg-purple-50 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <img 
                src={product.images?.[0] || `https://placehold.co/50x50/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`} 
                alt={product.name} 
                className="w-12 h-14 object-cover rounded bg-gray-100" 
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                <span className="text-xs text-[#7C3AED] font-medium">{product.category?.name}</span>
              </div>
              <span className="font-bold text-[#5B21B6] text-sm">{formatPrice(product.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Home Component
const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Auto-slide carousel every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  // Previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRes = await api.get('/categories');
      const categoriesData = categoriesRes.categories || [];
      setCategories(categoriesData);
      
      const productsByCategory = {};
      for (const category of categoriesData) {
        try {
          const response = await api.get(`/products?category=${category.slug}&limit=25`);
          productsByCategory[category.slug] = response.products || [];
          console.log(`✅ Loaded ${productsByCategory[category.slug].length} products for ${category.name}`);
        } catch (error) {
          console.error(`Error fetching products for ${category.name}:`, error);
          productsByCategory[category.slug] = [];
        }
      }
      setCategoryProducts(productsByCategory);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Toast notifications
  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // Cart handlers
  const handleAddToCart = useCallback((product, quantity = 1) => {
    addToCart(product, quantity);
    addToast(`${product.name} added to cart`);
  }, [addToCart, addToast]);

  // Wishlist handlers
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

  // Get all products for search
  const getAllProducts = useMemo(() => {
    const allProducts = [];
    for (const category in categoryProducts) {
      allProducts.push(...categoryProducts[category]);
    }
    return allProducts;
  }, [categoryProducts]);

  // Scroll to section
  const scrollToSection = (slug) => {
    const element = document.getElementById(`section-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
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

  // Hero Carousel Section
  const HeroCarousel = () => (
    <section 
      className="relative w-full px-2 sm:px-4 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mt-12 sm:mt-14 md:mt-16 lg:mt-20">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <Link 
              key={index} 
              to="/shop"
              className="min-w-full block cursor-pointer"
              onClick={() => {
                console.log(`Hero slide ${index + 1} clicked - Redirecting to Shop`);
              }}
            >
              <img 
                src={image} 
                alt={`Nyanyi Beauty & Salon Products - Slide ${index + 1}`} 
                className="w-full h-auto max-h-[70vh] sm:max-h-[70vh] md:max-h-[75vh] object-contain object-center hover:scale-105 transition-transform duration-500"
              />
            </Link>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next slide"
        >
          <FiChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white w-4 sm:w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="hidden sm:block absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10">
          {currentSlide + 1} / {carouselImages.length}
        </div>
      </div>
    </section>
  );

  // Category Navigation
  const CategoryNav = () => (
    <section className="bg-white border-b border-purple-100/30 sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 bg-gray-50 text-gray-600 hover:bg-[#7C3AED] hover:text-white border border-transparent hover:border-[#7C3AED]"
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  // Category Section
  const CategorySection = ({ category, products, index }) => {
    return (
      <div
        id={`section-${category.slug}`}
        className={`scroll-mt-20 ${index < categories.length - 1 ? 'mb-16 md:mb-20' : ''}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {category.name}
              </h2>
              <span className="text-xs font-medium text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                {products.length}
              </span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-full mt-2"></div>
          </div>
          <Link
            to={`/shop?category=${category.slug}`}
            className="group inline-flex items-center text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            View All
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, 5).map((product) => (
              <ProductCard 
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={setQuickViewProduct}
                isWishlisted={wishlistItems.some(p => p._id === product._id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <p>No products available in this category yet.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-6">
            <Link
              to={`/shop?category=${category.slug}`}
              className="group inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] font-medium border-2 border-[#7C3AED]/30 hover:border-[#7C3AED] px-6 py-2.5 rounded-xl hover:bg-purple-50 transition-all duration-300"
            >
              View All {category.name}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Why Choose Us Section - Clean Cards with Only Title
  const WhyChooseUs = () => (
    <section className="py-16 bg-[#FAF9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Why Nwanyin Onitsha
          </span>
          <h2 className="text-3xl font-bold mt-3">
            Why Choose <span className="text-[#2563EB]">Nwanyin Onitsha</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            We're committed to providing the best experience for our customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {WHY_CHOOSE_DATA.map((item) => (
            <WhyChooseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );

  // Updated Call to Action Section with Background Image
  const CTASection = () => (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src={heroLastBg} 
          alt="Ready to Shop Background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#6D28D9]/70 mix-blend-multiply"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">
            Ready to Shop?
          </h2>
          <p className="text-white/90 text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
            Browse our extensive collection of professional beauty and salon products
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a
              href="#products"
              className="bg-white text-[#6D28D9] px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-[#EDE9FE] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              Shop Now
            </a>
            <a
              href="#services-guarantees"
              className="border-2 border-white/50 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/70 text-sm md:text-base"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  if (error && !loading) {
    return (
      <div className="pt-16 bg-[#FAF9FF] min-h-screen flex items-center justify-center">
        <div className="container-custom py-12 text-center">
          <div className="bg-white rounded-2xl shadow-elegant p-12 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchData} className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9FF] text-gray-900 font-sans antialiased flex flex-col min-h-screen">
      <HeroCarousel />
      <CategoryNav />
      
      <main className="flex-grow">
        {/* Categories Section with Images */}
        <section id="categories" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Categories
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">Shop by Category</h2>
              <p className="text-sm text-gray-500 mt-2">
                Browse our extensive collection by category
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                  </div>
                  <div className="relative z-10 aspect-square flex items-center justify-center p-4">
                    <p className="text-white font-bold text-sm md:text-base text-center uppercase tracking-wider drop-shadow-lg">
                      {cat.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Rush Hour Section - Only section with offers */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RushHourSection 
            onAddToCart={handleAddToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={setQuickViewProduct}
          />
        </section>

        {/* Products Sections */}
        <section id="products" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Featured Products
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">Featured Products</h2>
              <p className="text-sm text-gray-500 mt-2">
                Handpicked products just for you
              </p>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-16">
                {categories.map((category, index) => {
                  const products = categoryProducts[category.slug] || [];
                  if (products.length === 0) return null;
                  
                  return (
                    <CategorySection
                      key={category._id}
                      category={category}
                      products={products}
                      index={index}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <WhyChooseUs />
        <CTASection />
      </main>

      {/* Modals */}
      <QuickViewModal 
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <ServiceDetailModal 
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={getAllProducts}
        onQuickView={setQuickViewProduct}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-[#171047] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <FiCheckCircle className="w-4 h-4 text-[#7C3AED]" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-mt-20 {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  );
};

export default Home;