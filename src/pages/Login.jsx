import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(109,40,217,0.08)] border border-[#E9DDF7]">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#6D28D9] to-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg">
              <IoSparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#241238]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#6B6475]">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
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
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
                  placeholder="you@example.com"
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
                  className="input-field pl-10 border-[#E9DDF7] focus:border-[#6D28D9] bg-[#FAF9FF]"
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
              <span className="flex items-center justify-center">
                Sign In <FiArrowRight className="ml-2" />
              </span>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-[#6B6475]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#6D28D9] hover:text-[#5B21B6] font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-[#F7F3FF] rounded-xl border border-[#E9DDF7]">
          <p className="text-xs text-[#6B6475] text-center">Demo Credentials</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-[#241238] text-center">
            <div>
              <p className="font-semibold">Customer</p>
              <p className="text-[#6B6475] text-xs">customer@example.com</p>
              <p className="text-[#6B6475] text-xs">Customer123!</p>
            </div>
            <div>
              <p className="font-semibold">Admin</p>
              <p className="text-[#6B6475] text-xs">admin@luxiline.com</p>
              <p className="text-[#6B6475] text-xs">Admin123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;