import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch, FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa';
import '../index.css';
import './Home.css';

const Header = ({ totalPages, currentPage, onPageClick, isDarkMode, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('All');
  const sidebarRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const closeSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', closeSidebar);
    return () => {
      document.removeEventListener('mousedown', closeSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAccountClick = (pageNumber) => {
    onPageClick(pageNumber);
    setIsSidebarOpen(false);
  };

  const handleBackClick = () => {
    setIsSidebarOpen(false);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <header className={`nav ${isDarkMode ? 'bg-gray-900' : 'bg-blue-500'} text-white h-24 w-full p-4 flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaBars className="text-white mr-2 ml-4 mt-2 cursor-pointer" onClick={toggleSidebar} />
          <span className="text-xx mt-2 font-bold">Telegram</span>
        </div>
        <div className="flex items-center">
          <FaSearch className="text-white mr-4" />
          <button onClick={toggleTheme} className="text-white">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 bg-gray-800 text-white h-full w-[450px] p-4 overflow-y-auto"
        >
          <div className="flex items-center mb-4">
            <FaArrowLeft className="text-white mr-2 text-lg cursor-pointer" onClick={handleBackClick} />
          </div>
          <div className="flex items-center mb-4">
            <img className="rounded-full h-12 w-12 mr-2" src="https://via.placeholder.com/50" alt="Profile" />
            <h3 className="text-xl font-bold">Profile</h3>
          </div>
          <div className="flex flex-col space-y-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-white text-lg hover:bg-gray-700 rounded ${
                  currentPage === index + 1 ? 'bg-blue-600' : 'bg-gray-800'
                }`}
                onClick={() => handleAccountClick(index + 1)}
              >
                Account {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="ul flex gap-10 mt-2 font-base text-lg">
        <button
          className={`text-white ${activeLink === 'All' ? 'font-bold ' : ''}`}
          onClick={() => handleLinkClick('All')}
        >
          All
        </button>
        <button
          className={`text-white ${activeLink === 'Regulars' ? 'font-bold' : ''}`}
          onClick={() => handleLinkClick('Regulars')}
        >
          Regulars
        </button>
        <button
          className={`text-white ${activeLink === 'Unread' ? 'font-bold' : ''}`}
          onClick={() => handleLinkClick('Unread')}
        >
          Unread
        </button>
      </div>
    </header>
  );
};

export default Header;
