import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiArrowRight,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(109,40,217,0.08)] border border-[#E9DDF7] p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6D28D9] to-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg">
                <IoSparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#241238]">Create Account</h2>
            <p className="mt-2 text-sm text-[#6B6475]">Join Nyanyi Beauty today</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
              <FiCheckCircle className="text-green-500" />
              <span>Registration successful! Redirecting...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
              <FiAlertCircle className="text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-[#241238]">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-[#6B6475]" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="label text-[#241238]">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-[#6B6475]" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label text-[#241238]">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#6B6475]" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label text-[#241238]">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-[#6B6475]" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                  placeholder="+2341234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-[#241238]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-[#6B6475]" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="label text-[#241238]">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-[#6B6475]" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#E9DDF7] pt-6">
              <h3 className="text-sm font-semibold text-[#241238] mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label text-[#241238]">Street Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-[#6B6475]" />
                    </div>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label text-[#241238]">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="input-field border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="label text-[#241238]">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="input-field border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="label text-[#241238]">Postal Code</label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      className="input-field border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-[#241238]">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input-field border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                    placeholder="Nigeria"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB] text-white py-3 rounded-xl font-semibold hover:from-[#5B21B6] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account <FiArrowRight className="ml-2" />
                </span>
              )}
            </button>

            <p className="text-center text-sm text-[#6B6475]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6D28D9] hover:text-[#5B21B6] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;