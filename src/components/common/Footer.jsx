import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube, 
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight
} from 'react-icons/fi';

// Import logo from public directory
const logo = '/logo.png';

const Footer = () => {
  const { settings } = useSettings();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const categories = [
    'Hairs',
    'Hair Products',
    'Salon Materials',
    'Salon Equipment',
    'Nails & Accessories',
    'Eyelashes & Accessories',
    'Weavons',
    'Tattoos',
    'Wig Tools',
  ];

  const socialLinks = [
    { icon: FiFacebook, href: settings?.socialMedia?.facebook || '#', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: FiInstagram, href: settings?.socialMedia?.instagram || '#', label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    { icon: FiTwitter, href: settings?.socialMedia?.twitter || '#', label: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
    { icon: FiYoutube, href: settings?.socialMedia?.youtube || '#', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
    { icon: FiLinkedin, href: settings?.socialMedia?.linkedin || '#', label: 'LinkedIn', color: 'hover:bg-[#0A66C2]' },
  ];

  return (
    <footer className="bg-[#171047] text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Nyanyi Beauty Logo" 
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-white">
                {settings?.businessName || 'Nyanyi Beauty'}
              </h3>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Your one-stop destination for quality beauty, hair, nails, salon equipment and more.
            </p>
            <div className="space-y-2">
              {settings?.address && (
                <div className="flex items-start gap-3 text-sm text-white/60">
                  <FiMapPin className="mt-1 text-[#7C3AED] flex-shrink-0" />
                  <span>
                    {settings.address.street}, {settings.address.city}, {settings.address.state}
                  </span>
                </div>
              )}
              {settings?.phoneNumber && (
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <FiPhone className="text-[#7C3AED]" />
                  <span>{settings.phoneNumber}</span>
                </div>
              )}
              {settings?.businessEmail && (
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <FiMail className="text-[#7C3AED]" />
                  <span>{settings.businessEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-white/60 hover:text-[#7C3AED] transition-colors flex items-center gap-1 group"
                  >
                    <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link 
                    to={`/shop?category=${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                    className="text-sm text-white/60 hover:text-[#7C3AED] transition-colors flex items-center gap-1 group"
                  >
                    <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 ${social.color} hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#25D366] transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
          <p>
            {settings?.footerText || '© 2026 Nyanyi Onitsha Beauty & Salon Products. All rights reserved.'}
          </p> 
          <p>Powered by <span className='text-white'> <strong></strong>DXICTHUB</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;