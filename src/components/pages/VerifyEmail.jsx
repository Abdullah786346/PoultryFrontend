// src/components/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    const verifyToken = async (verifyTokenStr) => {
      try {
        const res = await fetch('/api/verify-email?token=' + verifyTokenStr);
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
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError(data.error || 'Email verification failed');
        }
      } catch (err) {
        setError('Email verification failed: ' + err.message);
      }
    };

    if (token) {
      verifyToken(token);
    } else {
      setError('Invalid verification link');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-amber-950 py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-crimson opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10 text-white space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4 animate-bounce">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-crimson p-0.5">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Finalizing your Poultry Professionals Society membership
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

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#de0f3f] hover:bg-[#b30c33] text-white font-semibold py-3 px-4 rounded-lg transition transform duration-150 active:scale-95 shadow-lg shadow-[#de0f3f]/30"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;