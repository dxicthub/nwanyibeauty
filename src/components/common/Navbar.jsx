import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiHeart,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiHome,
  FiShoppingBag,
  FiMail,
  FiInfo,
  FiChevronDown
} from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

// Import logo from public directory
const logo = '/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/shop', label: 'Shop', icon: FiShoppingBag },
    { to: '/about', label: 'About', icon: FiInfo },
    { to: '/contact', label: 'Contact', icon: FiMail },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100/30' 
        : 'bg-white backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Nyanyi Beauty Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
            />
            <span className="text-xl font-bold text-gray-800 group-hover:text-[#7C3AED] transition-colors">
              {settings?.businessName || 'Nyanyi Beauty'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#7C3AED] transition-colors duration-200 rounded-xl hover:bg-purple-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            {/* Wishlist */}
            <button className="relative p-2 text-gray-600 hover:text-[#7C3AED] transition-colors rounded-xl hover:bg-purple-50">
              <FiHeart size={22} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#7C3AED] transition-colors rounded-xl hover:bg-purple-50">
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-[#7C3AED] transition-colors px-3 py-2 rounded-xl hover:bg-purple-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#2563EB] rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="font-medium text-sm">{user?.firstName}</span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-purple-100/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-purple-100/50">
                    <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/account" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors">
                    <FiUser className="mr-3 text-gray-400" size={16} />
                    Dashboard
                  </Link>
                  <Link to="/account/orders" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors">
                    <FiPackage className="mr-3 text-gray-400" size={16} />
                    My Orders
                  </Link>
                  <Link to="/account/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors">
                    <FiSettings className="mr-3 text-gray-400" size={16} />
                    Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <hr className="my-2 border-purple-100/50" />
                      <Link to="/admin/dashboard" className="flex items-center px-4 py-2.5 text-sm text-[#7C3AED] hover:bg-purple-50 transition-colors">
                        <FiSettings className="mr-3" size={16} />
                        Admin Panel
                      </Link>
                    </>
                  )}
                  <hr className="my-2 border-purple-100/50" />
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <FiLogOut className="mr-3 text-red-400" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-sm font-semibold rounded-xl hover:from-[#6D28D9] hover:to-[#1D4ED8] transition-all duration-300 shadow-md hover:shadow-lg">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#7C3AED] transition-colors rounded-xl hover:bg-purple-50"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-purple-100/30 animate-slide-down">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <link.icon className="mr-3 text-gray-400" size={20} />
                  {link.label}
                </Link>
              ))}
              
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </form>

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <FiShoppingCart className="mr-3 text-gray-400" size={20} />
                  <span>Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <FiHeart className="mr-3 text-gray-400" size={20} />
                Wishlist
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <FiUser className="mr-3 text-gray-400" size={20} />
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <FiSettings className="mr-3" size={20} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <FiLogOut className="mr-3 text-red-400" size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white font-semibold rounded-xl"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;