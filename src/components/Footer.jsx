import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('Subscribing...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
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
        setStatus(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus(data.error || 'Subscription failed');
      }
    } catch (err) {
      setStatus('Failed: ' + err.message);
    }
  };

  return (
    <footer className="bg-white text-gray-700 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-12 h-12 object-cover mr-3 rounded"
              />
              <div>
                <div className="text-xl font-bold text-[#714616]">Poultry Professionals Society PPS </div>
                <div className="text-sm text-[#de0f3f]">Competency is the Excellency</div>
              </div>
            </div>

            <p className="text-[#545454] mb-4">
              "Poultry Professionals Society is committed to the betterment of the global poultry industry through education, collaboration, and innovation."
            </p>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="font-bold text-lg mb-3 text-[#5a631c]">Follow Us</h4>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#545454] hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#545454] hover:text-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#545454] hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#5a631c]">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-[#545454] hover:text-[#de0f3f] transition-colors">About Us</a></li>
              <li><a href="/membership" className="text-[#545454] hover:text-[#de0f3f] transition-colors">Membership</a></li>

              <li><a href="/events" className="text-[#545454] hover:text-[#de0f3f] transition-colors">Events</a></li>
              <li><a href="/resources" className="text-[#545454] hover:text-[#de0f3f] transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#5a631c]">Contact Us</h4>
            <address className="text-[#545454] not-italic space-y-2">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[#de0f3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:muhammadabdullahfscem@gmail.com" className="hover:text-[#de0f3f] transition-colors">
                  muhammadabdullahfscem@gmail.com
                </a>
              </div>

              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-[#de0f3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+923024684453" className="hover:text-[#de0f3f] transition-colors">
                  +923445076088
                </a>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#5a631c]">Newsletter</h4>
            <p className="text-[#545454] mb-4">Subscribe to our newsletter for updates</p>
            <form onSubmit={handleSubscribe} className="flex mb-3">
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-l-lg w-full text-[#545454] focus:outline-none focus:ring-2 focus:ring-[#de0f3f] border border-gray-300"
                required
              />
              <button type="submit" className="bg-[#de0f3f] hover:bg-[#c10e38] px-4 rounded-r-lg transition-colors text-white font-semibold">
                Subscribe
              </button>
            </form>
            {status && (
              <p className="text-sm mt-1 text-[#de0f3f] font-semibold">{status}</p>
            )}
            <p className="text-[#545454] text-sm mt-2">
              Stay updated with the latest poultry industry news and events
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-[#545454]">
          <p>© 2025 Poultry Professionals Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;