import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; // Prefer explicit import for clarity
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg py-4 px-4 md:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">

          {/* Logo and Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-12 h-12 object-cover mr-3 rounded"
              />
              <div>
                <div className="text-xl font-bold text-darkgrey">Poultry Professionals Society PPS</div>
                <div className="text-sm text-crimson">Competency is the Excellency</div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0`}>
            <div className="flex flex-col md:flex-row md:space-x-8 w-full text-center">
              <HashLink smooth to="/" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                Home
              </HashLink>
              <HashLink smooth to="/#about" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                About
              </HashLink>
              <HashLink smooth to="/#membership" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                Membership
              </HashLink>
              <HashLink smooth to="/#news" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                Events
              </HashLink>
              <HashLink smooth to="/#resources" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                Resources
              </HashLink>
              <HashLink smooth to="/#contact" onClick={closeMobileMenu} className="py-2 px-4 text-darkgrey hover:bg-brown hover:text-purewhite rounded-lg font-medium">
                Contact
              </HashLink>
            </div>

            <div className="mt-4 md:mt-0 md:ml-8 flex">

              {currentUser ? (

                <button
  onClick={() => {
    closeMobileMenu();
    navigate('/login');
  }}
  className="bg-crimson hover:bg-red-700 text-purewhite font-bold py-2 px-6 rounded-lg w-full md:w-auto"
>
  Member Login
</button>

              ) : (

                <button

                  onClick={() => {

                    closeMobileMenu();

                    navigate('/login');

                  }}

                  className="bg-crimson hover:bg-darkgrey text-purewhite font-bold py-2 px-6 rounded-lg w-full md:w-auto"

                >

                  Member Login

                </button>

              )}

            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
