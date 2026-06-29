import React from 'react';
import {
  FaInfoCircle,
  FaUsers,
  FaUserFriends,
  FaNewspaper,
  FaCalendarAlt,
  FaBriefcase,
  FaBook,
  FaHandshake,
} from 'react-icons/fa';

const HomeTiles = () => {
  const links = [
    { title: "About PPS", href: "#about", icon: <FaInfoCircle className="text-3xl mb-2" /> },
    { title: "Committees", href: "#committees", icon: <FaUsers className="text-3xl mb-2" /> },
    { title: "Membership", href: "#membership", icon: <FaUserFriends className="text-3xl mb-2" /> },
    { title: "News & Events", href: "#news", icon: <FaNewspaper className="text-3xl mb-2" /> },
    { title: "Calendar", href: "#calendar", icon: <FaCalendarAlt className="text-3xl mb-2" /> },
    { title: "Opportunities", href: "#opportunities", icon: <FaBriefcase className="text-3xl mb-2" /> },
    { title: "Publications", href: "#publications", icon: <FaBook className="text-3xl mb-2" /> },
    { title: "Sponsors/Partners", href: "#sponsors", icon: <FaHandshake className="text-3xl mb-2" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container mx-auto px-4 py-8">
        <section className="py-10 px-4 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#714616]">
            Explore PPS Programs and Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="bg-[#714616] text-white text-center p-6 rounded-xl shadow-lg hover:scale-105 transition transform duration-300 hover:shadow-xl flex flex-col items-center"
              >
                {link.icon}
                <span className="font-medium">{link.title}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeTiles;
