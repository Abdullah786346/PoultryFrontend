import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarItems from './NavbarItems';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth(); // Agat logout function context me hai toh usey nikal lein

  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  
  // FIX 2: Agar user kahin bhi logged in ho (chahe dashboard ho ya landing page), hum usey handle karenge
  const showAdminProfile = currentUser && isDashboardRoute;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-colors duration-200 py-4 px-4 md:px-8 border-b ${
        isDashboardRoute 
          ? 'bg-[#0f172a] text-white border-slate-800 shadow-md' 
          : 'bg-white text-gray-900 border-gray-100 shadow-sm'   
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* LEFT: LOGO + BRAND */}
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
          <img
            src="/assets/logo.jpg"
            alt="Logo"
            className="w-12 h-12 object-cover mr-3 rounded-full border border-gray-100 shadow-sm"
          />
          <div className="max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-none">
            <div className={`text-base md:text-lg lg:text-xl font-bold tracking-tight leading-tight whitespace-nowrap lg:whitespace-normal ${
              isDashboardRoute ? 'text-white' : 'text-gray-900'
            }`}>
              Poultry Professionals Society PPS
            </div>
            <div className={`text-[10px] md:text-xs font-medium tracking-wide mt-0.5 ${
              isDashboardRoute ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Competency is the Excellency
            </div>
          </div>
        </div>

        {/* CENTER: MAIN NAV LINKS (DESKTOP) */}
        {!showAdminProfile && (
          <div className="hidden lg:flex items-center justify-center flex-grow">
            <NavbarItems isDashboardRoute={isDashboardRoute} />
          </div>
        )}

        {/* RIGHT: AUTH SECTION (DESKTOP) */}
        <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
          {currentUser ? (
            /* FIX 2: Agar user Logged In hai (Dashboard ho ya normal page), toh profile dikhao */
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 border rounded-full py-1.5 pl-2 pr-4 shadow-sm select-none ${
                isDashboardRoute ? 'bg-slate-900/60 border-slate-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <img
                  src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className={`font-semibold text-sm max-w-[150px] truncate ${isDashboardRoute ? 'text-slate-200' : 'text-gray-700'}`}>
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              
              {/* Ek chota sa Dashboard aur Logout button bhi de diya jo user ko sahulat dega */}
              {!isDashboardRoute && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-semibold text-teal-600 hover:underline"
                >
                  Dashboard
                </button>
              )}
            </div>
          ) : (
            /* Agar user logged in NAHI hai (Jaise image_527ce2.jpg me Login page par dikh raha hai) */
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#009688] hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-lg transition text-sm shadow-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="border border-[#009688] text-[#009688] hover:bg-teal-50 font-semibold py-2 px-5 rounded-lg transition text-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* MOBILE & TABLET HAMBURGER BUTTON */}
        {!showAdminProfile && (
          <button
            className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        )}

      </div>

      {/* 📱 FIX 1: MOBILE MENU DROPDOWN (Yeh aapke purane code me miss tha) */}
      {isMenuOpen && !showAdminProfile && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 space-y-2 bg-white px-2 animate-fade-in">
          <NavbarItems isMobile={true} onClickItem={() => setIsMenuOpen(false)} />
          
          {/* Mobile Auth Buttons ya Profile */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {currentUser ? (
              <div className="px-4 py-2 bg-gray-50 rounded-lg flex items-center space-x-3">
                <img src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} className="w-8 h-8 rounded-full" alt="user" />
                <span className="text-sm font-semibold text-gray-700 truncate">{currentUser.displayName || currentUser.email}</span>
              </div>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full bg-[#009688] text-white font-semibold py-2.5 px-4 rounded-lg text-center text-sm">Login</button>
                <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} className="w-full border border-[#009688] text-[#009688] font-semibold py-2.5 px-4 rounded-lg text-center text-sm">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;