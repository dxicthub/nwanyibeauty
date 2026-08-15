import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiMessageCircle,
  FiCheckCircle, FiAlertCircle, FiArrowRight, FiPhoneCall
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import toast from 'react-hot-toast';
import api from '../services/api';

// Import hero banner image (same as About page)
import heroAboutUs from '../assets/images/hero_aboutus.jpg';

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

  // Fallback data if settings not available
  const contactData = {
    phoneNumber: settings?.phoneNumber || '+234 812 364 5507',
    businessEmail: settings?.businessEmail || 'info@nwanyionitsha.com',
    whatsappNumber: settings?.whatsappNumber || '+234 812 364 5507',
    address: settings?.address || {
      street: 'Nwanyi Onitsha',
      city: 'Onitsha',
      state: 'Anambra',
      country: 'Nigeria'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSuccess(true);
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const number = contactData.whatsappNumber || '';
    const cleanNumber = number.replace(/\D/g, '');
    const message = 'Hello, I would like to get in touch with Nyanyi Onitsha.';
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handlePhoneCall = () => {
    const number = contactData.phoneNumber || '';
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber) {
      window.location.href = `tel:${cleanNumber}`;
    }
  };

  const handleEmailClick = () => {
    const email = contactData.businessEmail || '';
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="pt-16 bg-[#FAF9FF] min-h-screen">
      {/* Hero Banner with Background Image - Same style as About page */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src={heroAboutUs} 
            alt="Contact Nyanyi Onitsha" 
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-[#6D28D9]/70 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 leading-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium max-w-2xl mx-auto">
            Have questions? We're here to help you
          </p>
        </div>
      </section>

      {/* Quick Action Cards - Moved ABOVE the contact form for better visibility */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Call Card */}
          <div className="bg-white rounded-2xl border border-[#E9DDF7] p-6 text-center hover:shadow-xl transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 bg-[#F7F3FF] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#6D28D9] transition-colors duration-300">
              <FiPhoneCall className="w-7 h-7 text-[#6D28D9] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#241238] mb-1">Call Us</h3>
            <p className="text-sm text-[#6B6475] mb-3">{contactData.phoneNumber}</p>
            <button
              onClick={handlePhoneCall}
              className="w-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white py-2.5 rounded-xl font-semibold hover:from-[#5B21B6] hover:to-[#1D4ED8] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <FiPhone className="text-lg" aria-hidden="true" />
              Call Now
            </button>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl border border-[#E9DDF7] p-6 text-center hover:shadow-xl transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
              <FaWhatsapp className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#241238] mb-1">WhatsApp</h3>
            <p className="text-sm text-[#6B6475] mb-3">{contactData.whatsappNumber}</p>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaWhatsapp className="text-lg" aria-hidden="true" />
              Chat Now
            </button>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl border border-[#E9DDF7] p-6 text-center hover:shadow-xl transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 bg-[#F7F3FF] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#6D28D9] transition-colors duration-300">
              <FiMail className="w-7 h-7 text-[#6D28D9] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#241238] mb-1">Email Us</h3>
            <p className="text-sm text-[#6B6475] mb-3">{contactData.businessEmail}</p>
            <button
              onClick={handleEmailClick}
              className="w-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white py-2.5 rounded-xl font-semibold hover:from-[#5B21B6] hover:to-[#1D4ED8] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <FiMail className="text-lg" aria-hidden="true" />
              Email Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(109,40,217,0.08)] border border-[#E9DDF7] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#241238] mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F7F3FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-[#6D28D9] text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#241238]">Address</h3>
                    <p className="text-[#6B6475] text-sm">
                      {contactData.address.street}<br />
                      {contactData.address.city}, {contactData.address.state}<br />
                      {contactData.address.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F7F3FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-[#6D28D9] text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#241238]">Phone</h3>
                    <a href={`tel:${contactData.phoneNumber}`} className="text-[#6B6475] text-sm hover:text-[#6D28D9] transition-colors">
                      {contactData.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F7F3FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-[#6D28D9] text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#241238]">Email</h3>
                    <a href={`mailto:${contactData.businessEmail}`} className="text-[#6B6475] text-sm hover:text-[#6D28D9] transition-colors">
                      {contactData.businessEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="text-green-600 text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#241238]">WhatsApp</h3>
                    <button onClick={handleWhatsApp} className="text-[#6B6475] text-sm hover:text-green-600 transition-colors">
                      Chat with us
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-xl" aria-hidden="true" /> Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(109,40,217,0.08)] border border-[#E9DDF7] p-8">
              <h2 className="text-2xl font-bold text-[#241238] mb-6">Send Us a Message</h2>
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
                  <FiCheckCircle className="text-green-500" aria-hidden="true" />
                  <span>Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[#241238]">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-[#E9DDF7]'} focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-[#FAF9FF] outline-none transition-all duration-300`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label text-[#241238]">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-[#E9DDF7]'} focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-[#FAF9FF] outline-none transition-all duration-300`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="label text-[#241238]">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-[#E9DDF7]'} focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-[#FAF9FF] outline-none transition-all duration-300`}
                    placeholder="+2341234567890"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="label text-[#241238]">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-400' : 'border-[#E9DDF7]'} focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-[#FAF9FF] outline-none transition-all duration-300`}
                    placeholder="What is this about?"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="label text-[#241238]">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400' : 'border-[#E9DDF7]'} focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 bg-[#FAF9FF] outline-none transition-all duration-300 resize-none`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white py-3 rounded-xl font-semibold hover:from-[#5B21B6] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend aria-hidden="true" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;