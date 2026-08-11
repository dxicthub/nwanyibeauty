import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiSend, 
  FiMessageCircle,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSuccess(true);
        toast.success('Message sent successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings?.whatsappNumber || '';
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    const message = `Hello, I would like to get in touch with Luxiline Beauty.`;
    const encodedMessage = encodeURIComponent(message);
    
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    } else {
      toast.error('WhatsApp number not configured');
    }
  };

  const getOpeningHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const hours = settings?.openingHours?.[day];
      if (hours?.open && hours?.close) {
        return `${dayNames[index]}: ${hours.open} - ${hours.close}`;
      }
      return `${dayNames[index]}: Closed`;
    });
  };

  const socialLinks = [
    { icon: FiFacebook, url: settings?.socialMedia?.facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FiInstagram, url: settings?.socialMedia?.instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FiTwitter, url: settings?.socialMedia?.twitter, label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: FiYoutube, url: settings?.socialMedia?.youtube, label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: FiLinkedin, url: settings?.socialMedia?.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ].filter(social => social.url);

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* Address */}
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600 text-sm">
                        {settings.address.street}<br />
                        {settings.address.city}, {settings.address.state}<br />
                        {settings.address.country} {settings.address.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {settings?.phoneNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <a href={`tel:${settings.phoneNumber}`} className="text-gray-600 text-sm hover:text-primary-600 transition-colors">
                        {settings.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings?.businessEmail && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <a href={`mailto:${settings.businessEmail}`} className="text-gray-600 text-sm hover:text-primary-600 transition-colors">
                        {settings.businessEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {settings?.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">WhatsApp</h3>
                      <button
                        onClick={handleWhatsAppClick}
                        className="text-gray-600 text-sm hover:text-green-600 transition-colors"
                      >
                        {settings.whatsappNumber}
                      </button>
                    </div>
                  </div>
                )}

                {/* Opening Hours */}
                {settings?.openingHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Opening Hours</h3>
                      <div className="space-y-1 mt-1">
                        {getOpeningHours().map((hour, index) => (
                          <p key={index} className="text-gray-600 text-sm">
                            {hour}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color} hover:text-white`}
                        aria-label={social.label}
                      >
                        <social.icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Button */}
              {settings?.whatsappNumber && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Chat on WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <FiCheckCircle className="text-green-600 text-xl" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-600 text-sm">We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle size={14} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle size={14} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle size={14} /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                    placeholder="What is this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle size={14} /> {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle size={14} /> {errors.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum 10 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {settings?.phoneNumber && (
                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-200 transition-colors">
                    <FiPhone className="text-primary-600 text-xl" />
                  </div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-500">{settings.phoneNumber}</p>
                </a>
              )}

              {settings?.businessEmail && (
                <a
                  href={`mailto:${settings.businessEmail}`}
                  className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-200 transition-colors">
                    <FiMail className="text-primary-600 text-xl" />
                  </div>
                  <p className="font-medium text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-500">{settings.businessEmail}</p>
                </a>
              )}

              {settings?.whatsappNumber && (
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                    <FiMessageCircle className="text-green-600 text-xl" />
                  </div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Quick Chat</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;