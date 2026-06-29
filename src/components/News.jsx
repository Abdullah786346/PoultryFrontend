import React, { useState, useEffect } from 'react';
import { format, parseISO, isThisMonth, isThisWeek } from 'date-fns';
import { FaCalendarAlt, FaNewspaper, FaSearch, FaRegCalendarCheck } from 'react-icons/fa';

const NewsEventsPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for data
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/newsEventsData.json');
        
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        
        const data = await response.json();
        setNews(data.news);
        setEvents(data.events);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter news based on category and search term
  const filteredNews = news.filter(item => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter events
  const upcomingEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return isThisMonth(eventDate) || isThisWeek(eventDate) || new Date() < eventDate;
  });

  // Handle news item click
  const handleNewsClick = (item) => {
    setSelectedNews(item);
  };

  // Close news detail modal
  const closeNewsDetail = () => {
    setSelectedNews(null);
  };

  // Get category classes for styling
  const getCategoryClasses = (category) => {
    switch(category) {
      case 'Research':
        return 'bg-[#e9edd1] text-[#5a631c]';
      case 'Event':
        return 'bg-[#fde0e6] text-[#de0f3f]';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }
    
    // Mock subscription functionality
    setMessage('Thank you for subscribing!');
    setEmail('');
    
    // In a real app, you would send this to your backend
    console.log('Subscribed email:', email);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714616] mx-auto"></div>
          <p className="mt-4 text-[#714616]">Loading news & events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-800">Error Loading Data</h2>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#714616] text-white rounded hover:bg-[#5a370f] transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#545454]">
      {/* Header */}
      <header className="bg-[#714616] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">News & Events</h1>
              <p className="mt-4 text-xl max-w-3xl">
                Stay updated with the latest research, industry news, and upcoming events in the poultry industry.
              </p>
            </div>
            <div className="hidden md:block">
              <FaNewspaper className="text-white opacity-20 w-32 h-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* News Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#714616] mb-4 md:mb-0">
              Latest News & Updates
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  className="pl-10 pr-4 py-2 border border-[#714616] rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-[#714616]" />
              </div>
              <div className="flex items-center border border-[#714616] rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-2 ${activeFilter === "all" ? "bg-[#de0f3f] text-white" : "bg-white text-[#714616]"}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 ${activeFilter === "Research" ? "bg-[#de0f3f] text-white" : "bg-white text-[#714616]"}`}
                  onClick={() => setActiveFilter("Research")}
                >
                  Research
                </button>
                <button
                  className={`px-4 py-2 ${activeFilter === "Event" ? "bg-[#de0f3f] text-white" : "bg-white text-[#714616]"}`}
                  onClick={() => setActiveFilter("Event")}
                >
                  Events
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-[#eee0d0]"
                  onClick={() => handleNewsClick(item)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryClasses(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-[#714616] text-sm">{format(parseISO(item.date), 'MMM d, yyyy')}</span>
                    </div>
                    <h3 className="text-xl font-bold mt-4 mb-2 text-[#714616]">{item.title}</h3>
                    <p className="text-[#545454]">{item.excerpt}</p>
                    <button className="mt-4 text-[#de0f3f] font-medium flex items-center">
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No news found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#714616]">Upcoming Events</h2>
            <div className="flex items-center text-[#de0f3f] font-medium">
              <FaRegCalendarCheck className="mr-2" />
              <span>Add to Calendar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#eee0d0]">
                <div className="border-b border-[#eee0d0]">
                  <div className="grid grid-cols-12 py-3 px-4 bg-[#f7f3ee] text-[#714616] text-sm font-medium">
                    <div className="col-span-3">Date</div>
                    <div className="col-span-5">Event</div>
                    <div className="col-span-4">Location</div>
                  </div>
                </div>
                <div className="divide-y divide-[#eee0d0]">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="grid grid-cols-12 py-4 px-4 hover:bg-[#f7f3ee]">
                        <div className="col-span-3 flex items-center">
                          <FaCalendarAlt className="text-[#de0f3f] mr-2" />
                          <div>
                            <div className="font-medium text-[#714616]">{format(parseISO(event.date), 'MMM d, yyyy')}</div>
                            <div className="text-sm text-[#545454]">{event.time}</div>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <div className="font-medium text-[#714616]">{event.title}</div>
                          <div className="text-sm text-[#545454]">{event.description}</div>
                        </div>
                        <div className="col-span-4 text-[#545454]">{event.location}</div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center col-span-full">
                      <p className="text-gray-500">No upcoming events scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Event Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#eee0d0]">
              <h3 className="text-xl font-bold mb-4 text-[#714616]">Event Calendar</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-[#714616]">August 2025</h4>
                  <div className="flex">
                    <button className="p-1 rounded hover:bg-[#f7f3ee]">
                      <svg className="w-5 h-5 text-[#714616]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-[#f7f3ee] ml-2">
                      <svg className="w-5 h-5 text-[#714616]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-[#714616] py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(31)].map((_, index) => {
                    const day = index + 1;
                    const hasEvent = [10, 22].includes(day);
                    const isAug10 = day === 10;
                    const isAug22 = day === 22;
                    
                    return (
                      <div 
                        key={index} 
                        className={`text-center py-2 rounded-full relative ${
                          isAug10 ? 'bg-[#e9edd1] font-bold' : 
                          isAug22 ? 'bg-[#fde0e6] font-bold' : 
                          'hover:bg-[#f7f3ee]'
                        }`}
                      >
                        {day}
                        {hasEvent && (
                          <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                            isAug10 ? 'bg-[#5a631c]' : 'bg-[#de0f3f]'
                          }`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t border-[#eee0d0] pt-4">
                <h4 className="font-bold mb-3 text-[#714616]">Key Events</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-[#5a631c] mt-1.5 mr-2"></div>
                    <div>
                      <div className="font-medium text-[#5a631c]">Aug 10: Poultry Health Workshop</div>
                      <div className="text-sm text-[#545454]">Chicago</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-[#de0f3f] mt-1.5 mr-2"></div>
                    <div>
                      <div className="font-medium text-[#de0f3f]">Aug 22: Feed Formulation Seminar</div>
                      <div className="text-sm text-[#545454]">Virtual</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryClasses(selectedNews.category)}`}>
                    {selectedNews.category}
                  </span>
                  <p className="text-[#714616] mt-2">
                    {format(parseISO(selectedNews.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <button 
                  onClick={closeNewsDetail}
                  className="text-[#714616] hover:text-[#de0f3f]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <h2 className="text-3xl font-bold mt-4 mb-6 text-[#714616]">{selectedNews.title}</h2>
              <div className="prose max-w-none">
                <p className="text-[#545454] mb-4">{selectedNews.excerpt}</p>
                <p className="text-[#545454]">{selectedNews.content}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#eee0d0]">
                <h3 className="text-lg font-bold mb-3 text-[#714616]">Share this article:</h3>
                <div className="flex space-x-3">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#de0f3f] text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5a631c] text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#714616] text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 3 5.3 3 9.24c0 2.4 1.9 5.44 5.13 6.54.38.08.5-.17.5-.38 0-.19-.01-.82-.01-1.49-1.85.34-2.3-.82-2.3-.82-.35-.86-.84-1.1-.84-1.1-.68-.44.05-.44.05-.44.76.05 1.16.76 1.16.76.67 1.13 1.75.81 2.18.62.07-.48.26-.81.48-1-.88-.1-1.8-.42-1.8-1.9 0-.42.15-.78.4-1.04-.13-.1-.17-.48 0-.98 0 0 .34-.1 1.1.4.32-.08.66-.13 1-.13.34 0 .68.05 1 .13.76-.5 1.1-.4 1.1-.4.17.5.04.88 0 .98.25.27.4.62.4 1.04 0 1.48-.92 1.8-1.8 1.9.27.23.5.69.5 1.4 0 1-.01 1.8-.01 2.05 0 .21.12.46.5.38 3.23-1.1 5.13-4.15 5.13-6.54C21 5.3 17.42 2 12.04 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Newsletter Signup Section */}
      <div className="bg-[#714616] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Stay Updated</h3>
              <p className="mt-2 max-w-lg">
                Subscribe to our newsletter for the latest news, research updates, and event announcements in the poultry industry.
              </p>
            </div>
            <div className="md:w-1/2">
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={handleSubscribe}
              >
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#de0f3f] hover:bg-[#bf0d36] px-6 py-2 rounded-lg font-medium transition whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              {message && <p className="mt-2 text-sm">{message}</p>}
              <p className="mt-2 text-sm opacity-75">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventsPage;