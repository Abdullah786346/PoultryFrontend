import React from 'react';

const Mission = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#714616] mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-[#de0f3f] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Mission Card 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow border border-[#5a631c]">
            <div className="bg-[#de0f3f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#5a631c] mb-3">Promote Best Practices</h3>
            <p className="text-[#545454]">We establish and promote best practices in poultry farming to ensure animal welfare and food safety.</p>
          </div>
          
          {/* Mission Card 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow border border-[#5a631c]">
            <div className="bg-[#de0f3f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#5a631c] mb-3">Support Farmers</h3>
            <p className="text-[#545454]">We provide resources, training, and support to poultry farmers to help them succeed in their operations.</p>
          </div>
          
          {/* Mission Card 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow border border-[#5a631c]">
            <div className="bg-[#de0f3f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#5a631c] mb-3">Advance Research</h3>
            <p className="text-[#545454]">We fund and promote research in poultry science to advance knowledge and improve industry practices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;