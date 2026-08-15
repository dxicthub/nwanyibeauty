import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiMail, FiShield, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@luxiline.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user?.role === 'admin') {
          toast.success('Welcome Admin!');
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          // Logout the non-admin user
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        }
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#2563EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6D28D9] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
              <FiShield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#241238]">Admin Login</h2>
          <p className="mt-2 text-sm text-[#6B6475]">Access the admin dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label text-[#241238]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#6B6475]" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9]"
                  placeholder="admin@luxiline.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label text-[#241238]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#6B6475]" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9]"
                  placeholder="••••••••"
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-[#6D28D9] hover:text-[#5B21B6] transition-colors">
              ← Back to Customer Login
            </Link>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-[#F7F3FF] rounded-lg border border-[#E9DDF7]">
          <p className="text-xs text-[#6B6475] text-center">Demo Credentials</p>
          <p className="text-sm text-[#241238] text-center font-medium">
            Email: admin@luxiline.com<br />
            Password: Admin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;