import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= (product?.stock || 0)) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity('');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    const whatsappNumber = settings?.whatsappNumber || '';
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    const message = `Hello, I would like to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: $${(product.price * quantity).toFixed(2)}\n\nPlease provide more information about my order.`;
    const encodedMessage = encodeURIComponent(message);
    
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    } else {
      // Fallback if no WhatsApp number is set
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 flex justify-center items-center min-h-screen">
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-16 container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Product not found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn-primary inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600/ec4899/ffffff?text=' + product.name];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary-600">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-600 shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <p className="text-gray-500 mb-4">
                Category: <Link to={`/shop?category=${product.category?.slug}`} className="text-primary-600 hover:underline">
                  {product.category?.name}
                </Link>
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  ${product.price?.toFixed(2)}
                </span>
                {product.sku && (
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-700 font-medium">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-700 font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityInput}
                      min="1"
                      max={product.stock}
                      className="w-16 text-center border-x border-gray-300 py-2 outline-none"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center ${
                    product.stock > 0
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiShoppingCart className="mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Order via WhatsApp
                </button>
              </div>

              {/* Additional Info */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-gray-500">{key}:</span>
                        <span className="ml-2 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section - Optional */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* You can add related products here */}
            <div className="text-center text-gray-500 py-8">
              <p>Related products coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;