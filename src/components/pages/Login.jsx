import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        const cleanText = text.trim();
        if (cleanText.startsWith("<")) {
          throw new Error(`Server returned HTML error page (Status ${res.status}). This usually means a backend crash or configuration issue.`);
        } else {
          throw new Error(cleanText || `Server error (Status ${res.status})`);
        }
      }

      if (res.ok) {
        login(data.user, data.token);  // Update auth context
        navigate('/dashboard');        // Navigate after login
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-amber-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs for premium glassmorphism effect */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-crimson opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 opacity-5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-crimson p-0.5">
              <img
                src="/assets/logo.jpg"
                alt="PPS Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
            PPS Member Login
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Access your Poultry Professionals Society account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#de0f3f] focus:ring-crimson border-white/20 rounded bg-white/5 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-crimson hover:text-red-400 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-crimson hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all duration-300 transform active:scale-95 shadow-lg shadow-crimson/35 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-crimson hover:text-red-400 transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;