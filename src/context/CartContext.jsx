import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateTotals(items);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateTotals(cartItems);
  }, [cartItems]);

  const updateTotals = (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalItems(total);
    setSubtotal(subtotalAmount);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product === product._id);
      
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity + quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevItems;
        }
        
        const updatedItems = prevItems.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated ${product.name} quantity`);
        return updatedItems;
      } else {
        // Check if enough stock
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevItems;
        }
        
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          quantity,
          sku: product.sku,
          stock: product.stock,
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.product === productId);
      if (item) {
        toast.success(`Removed ${item.name} from cart`);
      }
      return prevItems.filter(item => item.product !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const item = prevItems.find(item => item.product === productId);
      if (!item) return prevItems;
      
      if (quantity > item.stock) {
        toast.error(`Only ${item.stock} items available in stock`);
        return prevItems;
      }
      
      return prevItems.map(item =>
        item.product === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};