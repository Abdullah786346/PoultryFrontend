import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const showAdminProfile = currentUser && isDashboardRoute;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-colors duration-200 py-4 px-4 md:px-8 border-b ${
        isDashboardRoute 
          ? 'bg-[#0f172a] text-white border-slate-800 shadow-md' // Dashboard Dark Theme Sync
          : 'bg-white text-gray-900 border-gray-100 shadow-sm'   // Landing Page Clean Theme
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* LEFT: LOGO + BRAND */}
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
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

        {/* CENTER: MAIN NAV LINKS */}
        {!showAdminProfile && (
          <div className="hidden lg:flex items-center justify-center flex-grow space-x-1 xl:space-x-2 px-2">
            {['Home', 'About', 'Membership', 'Events', 'Resources', 'Contact'].map((item) => (
              <HashLink 
                key={item}
                smooth 
                to={item === 'Home' ? '/' : `/#${item.toLowerCase()}`} 
                className="py-2 px-3 text-gray-600 hover:text-teal-600 rounded-md font-semibold transition text-sm tracking-wide whitespace-nowrap"
              >
                {item}
              </HashLink>
            ))}
          </div>
        )}

        {/* RIGHT: AUTH SECTION */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {showAdminProfile ? (
            /* ADMIN PROFILE BOX (Dashboard Color Synced) */
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-full py-1.5 pl-2 pr-4 shadow-sm select-none">
              <img
                src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                alt="admin-avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="font-semibold text-sm max-w-[150px] truncate text-slate-200">
                {currentUser.displayName || currentUser.email}
              </span>
              {/* Crimson Red badge to match your dashboard layout buttons */}
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-1">
                {currentUser.role || 'Admin'}
              </span>
            </div>
          ) : (
            /* STANDARD BUTTONS (Teal Scheme for Landing Page) */
            <div className="hidden lg:flex items-center space-x-3">
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
    </nav>
  );
};

export default Navbar;