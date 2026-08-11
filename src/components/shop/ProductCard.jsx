import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiEye, FiHeart, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const isInStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  
  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', color: 'bg-red-500', bg: 'bg-red-50 text-red-700 border-red-200' };
    if (product.stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-500', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    return { text: 'In Stock', color: 'bg-green-500', bg: 'bg-green-50 text-green-700 border-green-200' };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (isInStock) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '❤️' : '💖',
      style: {
        borderRadius: '12px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-card hover:shadow-elegant-hover transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-50">
        <div className="aspect-square">
          <img
            src={product.images?.[0] || `https://via.placeholder.com/400x400/f0f0f0/808080?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x400/f0f0f0/808080?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
        
        {/* Quick Action Buttons - Appear on Hover */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`p-3 rounded-full shadow-lg transition-all duration-300 transform ${
                isHovered ? 'translate-y-0' : 'translate-y-4'
              } ${
                isInStock
                  ? 'bg-white text-primary-600 hover:bg-primary-600 hover:text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart size={20} />
            </button>
            <Link
              to={`/product/${product._id}`}
              className={`p-3 rounded-full bg-white shadow-lg transition-all duration-300 transform ${
                isHovered ? 'translate-y-0' : 'translate-y-4'
              } hover:bg-primary-600 hover:text-white`}
            >
              <FiEye size={20} />
            </Link>
          </div>
        </div>
        
        {/* Stock Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold ${stockStatus.bg} border shadow-sm`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${stockStatus.color} mr-1.5`}></span>
          {stockStatus.text}
        </div>
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-lg">
            ⭐ Featured
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
          } shadow-md hover:shadow-lg`}
        >
          <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        {/* Category */}
        <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">
          {product.category?.name}
        </p>
        
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-1 text-sm md:text-base mt-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Stock */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {isLowStock && isInStock && (
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`mt-3 w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isInStock
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiShoppingCart size={18} />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;