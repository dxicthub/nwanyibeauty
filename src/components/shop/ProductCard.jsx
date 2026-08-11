import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiLoader, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
  const isInStock = product.stock > 0;

  // Use product fields: price, originalPrice, stock, maxStock
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
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative">
      {/* Badges - Only Stock and Discount badges remain */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
          </span>
        </div>
      )}
      
      {product.stock === 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            Out of Stock
          </span>
        </div>
      )}
      
      <div 
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
        
        {/* Quick Add Overlay - Only Add to Cart on hover */}
        <div className="absolute bottom-0 inset-x-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={handleAdd}
            disabled={isAdding || isAdded || !isInStock}
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${
              !isInStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
            }`}
          >
            {isAdding ? (
              <><FiLoader className="w-4 h-4 animate-spin" /> Adding...</>
            ) : isAdded ? (
              <><FiCheck className="w-4 h-4 text-emerald-500" /> Added to Cart</>
            ) : !isInStock ? (
              'Out of Stock'
            ) : (
              <><FiShoppingCart className="w-4 h-4" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] mb-1">
          {product.category?.name}
        </div>
        
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-1 hover:text-[#7C3AED] cursor-pointer transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-amber-400 text-[10px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>★</span>
            ))}
          </div>
          <span className="text-[10px] text-gray-500 font-medium">(24)</span>
        </div>
        
        {/* Price Section - Left Aligned, Stacked */}
        <div className="mt-auto">
          <div className="flex flex-col items-start gap-0.5">
            {/* Old Price - Striked out and faded */}
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {/* New Price */}
            <span className={`text-lg font-bold ${hasDiscount ? 'text-red-600' : 'text-[#5B21B6]'}`}>
              {formatPrice(currentPrice)}
            </span>
          </div>
          
          {/* Items Left with Progress Bar */}
          {isInStock && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                <span className="font-medium">{product.stock} items left</span>
                <span className="text-gray-400">{Math.round(stockPercentage)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    product.stock <= 10 ? 'bg-red-500' : 
                    product.stock <= 25 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Stock Status Text (if out of stock) */}
          {!isInStock && (
            <div className="mt-2">
              <span className="text-xs font-medium text-red-600">Out of Stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;