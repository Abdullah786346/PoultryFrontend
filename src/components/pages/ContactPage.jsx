import React from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import Footer from '../Footer';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 min-h-[80vh] pt-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#714616] mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions, feedback, or want to get involved with the Poultry Professionals Society? Reach out to us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Email Card */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center transition hover:shadow-lg">
            <div className="p-4 bg-teal-50 text-teal-600 rounded-full mb-4">
              <FaEnvelope className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-semibold">Email Us</h3>
            <a 
              href="mailto:muhammadabdullahfscem@gmail.com" 
              className="text-[#009688] hover:underline font-medium break-all text-sm sm:text-base"
            >
              muhammadabdullahfscem@gmail.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center transition hover:shadow-lg">
            <div className="p-4 bg-teal-50 text-teal-600 rounded-full mb-4">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-semibold">Call Us</h3>
            <a 
              href="tel:03445076088" 
              className="text-[#009688] hover:underline font-medium text-sm sm:text-base"
            >
              03445076088
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
