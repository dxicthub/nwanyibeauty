import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiClock, FiShoppingCart, FiLoader, FiCheck } from 'react-icons/fi';
import { IoFlash } from 'react-icons/io5';
import toast from 'react-hot-toast';

// Rush Hour Products - Special deals with reduced prices
const RUSH_HOUR_PRODUCTS = [
  {
    _id: 'rush-001',
    name: 'Premium Virgin Straight Hair',
    description: '100% human hair, silky straight texture, 16 inches, 3 bundles.',
    price: 25000,
    originalPrice: 35000,
    stock: 44,
    maxStock: 80,
    sku: 'RH-001',
    images: ['https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=400&h=400&fit=crop'],
    category: { _id: 'cat1', name: 'Hairs', slug: 'hairs' },
    featured: true,
    status: 'active',
    discountPercentage: 29,
  },
  {
    _id: 'rush-002',
    name: 'Mielle Rosemary Hair Masque',
    description: 'Deep conditioning hair masque with rosemary oil. Promotes hair growth and strength.',
    price: 8500,
    originalPrice: 12000,
    stock: 18,
    maxStock: 50,
    sku: 'RH-002',
    images: ['https://images.unsplash.com/photo-1582333388877-51fe5a2fde3e?w=400&h=400&fit=crop'],
    category: { _id: 'cat2', name: 'Hair Products', slug: 'hair-products' },
    featured: true,
    status: 'active',
    discountPercentage: 29,
  },
  {
    _id: 'rush-003',
    name: 'Luxury Salon Chair',
    description: 'Professional salon styling chair, hydraulic, premium comfort for clients.',
    price: 95000,
    originalPrice: 120000,
    stock: 6,
    maxStock: 30,
    sku: 'RH-003',
    images: ['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop'],
    category: { _id: 'cat4', name: 'Salon Equipment', slug: 'salon-equipment' },
    featured: true,
    status: 'active',
    discountPercentage: 21,
  },
  {
    _id: 'rush-004',
    name: 'Nail Art Starter Kit',
    description: 'Complete nail art starter kit with tools, polishes, and accessories.',
    price: 14500,
    originalPrice: 18000,
    stock: 12,
    maxStock: 45,
    sku: 'RH-004',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop'],
    category: { _id: 'cat5', name: 'Nails & Accessories', slug: 'nails-accessories' },
    featured: false,
    status: 'active',
    discountPercentage: 19,
  },
  {
    _id: 'rush-005',
    name: '3D Mink Eyelashes',
    description: 'Premium 3D mink eyelash extensions, 10 pairs, natural and voluminous.',
    price: 3000,
    originalPrice: 5000,
    stock: 30,
    maxStock: 100,
    sku: 'RH-005',
    images: ['https://images.unsplash.com/photo-1586841559683-f84c22106e4f?w=400&h=400&fit=crop'],
    category: { _id: 'cat6', name: 'Eyelashes & Accessories', slug: 'eyelashes-accessories' },
    featured: true,
    status: 'active',
    discountPercentage: 40,
  },
  {
    _id: 'rush-006',
    name: 'Curly Wig (12 Inches)',
    description: 'Beautiful curly wig, 12 inches, natural-looking curls, comfortable fit.',
    price: 32000,
    originalPrice: 40000,
    stock: 8,
    maxStock: 35,
    sku: 'RH-006',
    images: ['https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=400&h=400&fit=crop'],
    category: { _id: 'cat9', name: 'Wig Tools', slug: 'wig-tools' },
    featured: false,
    status: 'active',
    discountPercentage: 20,
  },
];

// Countdown Timer Hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setIsExpired(true);
        return null;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === null) {
        clearInterval(interval);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isExpired };
};

// Rush Hour Product Card - No "Add to Cart" button, only hover overlay
const RushHourCard = ({ product, onAddToCart, onQuickView, isWishlisted, onToggleWishlist }) => {
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

  const isInStock = product.stock > 0;
  const currentPrice = product.price;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = originalPrice > currentPrice;
  const maxStock = product.maxStock || 100;
  const stockPercentage = Math.min((product.stock / maxStock) * 100, 100);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isAdded || !isInStock) return;
    
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      onAddToCart(product);
      setTimeout(() => setIsAdded(false), 2000);
    }, 350);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#E9DDF7] relative">
      {/* Rush Hour Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse flex items-center gap-1">
          <IoFlash className="w-3 h-3" /> Rush Hour
        </span>
        <span className="bg-[#6D28D9] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
          -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
        </span>
      </div>
      
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer">
        <img 
          src={product.images?.[0] || `https://placehold.co/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => { 
            e.target.src = `https://placehold.co/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Quick Add Overlay - Only shows on hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={handleAdd}
            disabled={isAdding || isAdded || !isInStock}
            className={`w-full font-semibold py-2 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${
              !isInStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6D28D9] text-white hover:bg-[#2563EB]'
            }`}
          >
            {isAdding ? (
              <><FiLoader className="w-4 h-4 animate-spin" /> Adding...</>
            ) : isAdded ? (
              <><FiCheck className="w-4 h-4 text-emerald-500" /> Added to Cart</>
            ) : !isInStock ? (
              'Out of Stock'
            ) : (
              <><FiShoppingCart className="w-4 h-4" /> Quick Add</>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        {/* Category */}
        <div className="text-[9px] font-bold uppercase tracking-widest text-[#6D28D9] mb-0.5">
          {product.category?.name}
        </div>
        
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-[#241238] mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-amber-400 text-[10px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>★</span>
            ))}
          </div>
          <span className="text-[9px] text-[#6B6475]">(24)</span>
        </div>
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex flex-col items-start gap-0.5">
            {hasDiscount && (
              <span className="text-xs text-[#6B6475] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-[#6D28D9]">
              {formatPrice(currentPrice)}
            </span>
          </div>
          
          {/* Items Left with Progress Bar */}
          {isInStock && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-[#6B6475] mb-0.5">
                <span className="font-medium">{product.stock} items left</span>
                <span className="text-[#6B6475]">{Math.round(stockPercentage)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    product.stock <= 10 ? 'bg-[#6D28D9]' : 
                    product.stock <= 25 ? 'bg-[#2563EB]' : 
                    'bg-[#6D28D9]'
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          {!isInStock && (
            <div className="mt-2">
              <span className="text-xs font-medium text-[#6D28D9]">Out of Stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Rush Hour Section
const RushHourSection = ({ onAddToCart, wishlistItems, onToggleWishlist, onQuickView }) => {
  // Set Rush Hour time (e.g., 2:00 PM to 4:00 PM daily)
  const [rushHourActive, setRushHourActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const checkRushHour = () => {
      const now = new Date();
      const startHour = 14; // 2:00 PM
      const endHour = 16;   // 4:00 PM
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      const isActive = (currentHour > startHour || (currentHour === startHour && currentMinutes >= 0)) &&
                       (currentHour < endHour || (currentHour === endHour && currentMinutes === 0));
      
      setRushHourActive(isActive);

      if (isActive) {
        const endTime = new Date();
        endTime.setHours(endHour, 0, 0, 0);
        const diff = endTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        const nextStart = new Date();
        nextStart.setHours(startHour, 0, 0, 0);
        if (now > nextStart) {
          nextStart.setDate(nextStart.getDate() + 1);
        }
        const diff = nextStart - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    checkRushHour();
    const interval = setInterval(checkRushHour, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeDisplay = () => {
    if (!timeLeft) return '00:00:00';
    const { hours, minutes, seconds } = timeLeft;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const activeProducts = rushHourActive ? RUSH_HOUR_PRODUCTS : [];

  // Timer Component - Full width with color scheme
  const TimerDisplay = () => (
    <div className="w-full bg-gradient-to-r from-[#6D28D9] via-[#6D28D9] to-[#2563EB] py-4 px-6 rounded-2xl shadow-lg mb-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
        <div className="flex items-center gap-2">
          <IoFlash className="w-6 h-6 text-white animate-pulse" />
          <span className="text-white font-bold text-sm uppercase tracking-wider">Rush Hour</span>
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full animate-pulse">
            🔴 LIVE
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <FiClock className="w-5 h-5 text-white/80" />
          <span className="text-white/80 font-medium text-sm">Time left:</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="bg-white/20 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
              {timeLeft?.hours.toString().padStart(2, '0') || '00'}
            </span>
            <span className="text-white text-2xl font-bold">:</span>
            <span className="bg-white/20 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
              {timeLeft?.minutes.toString().padStart(2, '0') || '00'}
            </span>
            <span className="text-white text-2xl font-bold">:</span>
            <span className="bg-white/20 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
              {timeLeft?.seconds.toString().padStart(2, '0') || '00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!rushHourActive) {
    return (
      <div className="w-full">
        {/* Timer always visible - even when not active */}
        <div className="w-full bg-gradient-to-r from-[#6D28D9]/60 via-[#6D28D9]/40 to-[#2563EB]/40 py-4 px-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
            <div className="flex items-center gap-2">
              <IoFlash className="w-6 h-6 text-white/60" />
              <span className="text-white font-bold text-sm uppercase tracking-wider">Next Rush Hour</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-white/60" />
              <span className="text-white/60 font-medium text-sm">Starts in:</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="bg-white/10 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
                  {timeLeft?.hours.toString().padStart(2, '0') || '00'}
                </span>
                <span className="text-white/60 text-2xl font-bold">:</span>
                <span className="bg-white/10 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
                  {timeLeft?.minutes.toString().padStart(2, '0') || '00'}
                </span>
                <span className="text-white/60 text-2xl font-bold">:</span>
                <span className="bg-white/10 text-white text-2xl md:text-3xl font-bold px-3 py-1 rounded-lg min-w-[50px] text-center">
                  {timeLeft?.seconds.toString().padStart(2, '0') || '00'}
                </span>
              </div>
            </div>
            
            <div className="hidden md:block text-white/40 text-sm">
              ⏰ Daily 2PM - 4PM
            </div>
          </div>
        </div>
        
        <div className="bg-[#F7F3FF] rounded-3xl p-6 border-2 border-[#E9DDF7] border-dashed">
          <div className="flex items-center justify-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#EDE9FE] rounded-full flex items-center justify-center">
                <IoFlash className="w-6 h-6 text-[#6D28D9]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#241238]">⏰ Rush Hour Deals</h3>
                <p className="text-sm text-[#6B6475]">
                  Coming soon! Check back at 2:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Full Width Timer */}
      <TimerDisplay />

      {/* Products Grid */}
      <div className="bg-[#F7F3FF] rounded-3xl p-6 border-2 border-[#E9DDF7]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {activeProducts.map((product) => (
            <RushHourCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlistItems.some(p => p._id === product._id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RushHourSection;