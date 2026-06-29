// src/components/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
        setMessage(data.message);
        setError('');
      } else {
        setError(data.error || 'Password reset failed');
        setMessage('');
      }
    } catch (err) {
      setError('Password reset failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-amber-950 py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-crimson opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10 text-white space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-crimson p-0.5">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-200 px-4 py-3 rounded-lg text-center text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition-all sm:text-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#de0f3f] hover:bg-[#b30c33] text-white font-semibold py-3 px-4 rounded-lg transition transform duration-150 active:scale-95 shadow-lg shadow-[#de0f3f]/30"
          >
            Send Reset Link
          </button>
          
          <p className="text-center text-gray-300 text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-crimson font-semibold hover:text-red-400 transition-colors">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;