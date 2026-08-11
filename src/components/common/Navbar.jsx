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
        ? 'bg-white/92 backdrop-blur-xl shadow-[0_8px_30px_rgba(59,27,90,0.08)] border-b border-purple-100/70' 
        : 'bg-white/96 backdrop-blur-md border-b border-purple-100/50 shadow-[0_4px_18px_rgba(59,27,90,0.04)]'
    }`}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D8C4F2] to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Nyanyi Beauty Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#35145F] group-hover:text-[#7C3AED] transition-colors">
              {settings?.businessName || 'Nyanyi Beauty'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2.5 text-sm font-semibold text-[#5B5566] hover:text-[#5B21B6] transition-all duration-200 rounded-full hover:bg-[#F5F0FF]"
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
                className="w-48 lg:w-64 px-4 py-2.5 pl-10 bg-[#FAF8FF] border border-[#E8DDF7] rounded-full focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] outline-none transition-all text-sm text-[#35145F] placeholder:text-[#9A91A6] shadow-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D9A]" size={18} />
            </form>

            {/* Wishlist */}
            <button className="relative p-2.5 text-[#5B5566] hover:text-[#6D28D9] transition-all rounded-full hover:bg-[#F5F0FF]">
              <FiHeart size={22} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 text-[#5B5566] hover:text-[#6D28D9] transition-all rounded-full hover:bg-[#F5F0FF]">
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-md ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#403A48] hover:text-[#5B21B6] transition-all px-3 py-2 rounded-full hover:bg-[#F5F0FF]">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#2563EB] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-[#F3EEFF]">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="font-medium text-sm">{user?.firstName}</span>
                  <FiChevronDown className="w-4 h-4 text-[#8B7D9A]" />
                </button>
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_18px_50px_rgba(59,27,90,0.16)] border border-[#E8DDF7] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-purple-100/50">
                    <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/account" className="flex items-center px-4 py-2.5 text-sm text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] transition-colors">
                    <FiUser className="mr-3 text-[#8B7D9A]" size={16} />
                    Dashboard
                  </Link>
                  <Link to="/account/orders" className="flex items-center px-4 py-2.5 text-sm text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] transition-colors">
                    <FiPackage className="mr-3 text-[#8B7D9A]" size={16} />
                    My Orders
                  </Link>
                  <Link to="/account/profile" className="flex items-center px-4 py-2.5 text-sm text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] transition-colors">
                    <FiSettings className="mr-3 text-[#8B7D9A]" size={16} />
                    Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <hr className="my-2 border-purple-100/50" />
                      <Link to="/admin/dashboard" className="flex items-center px-4 py-2.5 text-sm text-[#6D28D9] hover:bg-[#F7F3FF] transition-colors">
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
              <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#2563EB] text-white text-sm font-bold rounded-full hover:from-[#5B21B6] hover:via-[#6D28D9] hover:to-[#1D4ED8] transition-all duration-300 shadow-[0_8px_20px_rgba(124,58,237,0.22)] hover:shadow-[0_10px_25px_rgba(124,58,237,0.30)]">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 text-[#403A48] hover:text-[#6D28D9] transition-all rounded-full hover:bg-[#F5F0FF]"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-5 border-t border-[#EDE6F5] animate-slide-down">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] rounded-2xl transition-all"
                >
                  <link.icon className="mr-3 text-[#8B7D9A]" size={20} />
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
                    className="w-full px-4 py-3 pl-10 bg-[#FAF8FF] border border-[#E8DDF7] rounded-2xl focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] outline-none transition-all text-[#35145F]"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7D9A]" size={18} />
                </div>
              </form>

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] rounded-2xl transition-all"
              >
                <div className="flex items-center">
                  <FiShoppingCart className="mr-3 text-[#8B7D9A]" size={20} />
                  <span>Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white text-[10px] font-extrabold rounded-full w-6 h-6 flex items-center justify-center shadow-md ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] rounded-2xl transition-all"
              >
                <FiHeart className="mr-3 text-[#8B7D9A]" size={20} />
                Wishlist
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-[#4B4452] hover:bg-[#F7F3FF] hover:text-[#5B21B6] rounded-2xl transition-all"
                  >
                    <FiUser className="mr-3 text-[#8B7D9A]" size={20} />
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
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <FiLogOut className="mr-3 text-red-400" size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3.5 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#2563EB] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(124,58,237,0.20)]"
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