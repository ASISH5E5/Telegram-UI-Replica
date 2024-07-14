import React, { useState } from 'react';
import Header from './Header';
import Contacts from './Contacts';
import Messages from './Messages';
import BgImage from '../Images/BgImage.webp';
import './Home.css';

const Home = ({ currentPage, totalPages, onPageClick }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(currentPage);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContacts, setShowContacts] = useState(true);

  const handleContactClick = (chatId) => {
    setSelectedChat(chatId);
    setShowContacts(false);
  };

  const handleAccountClick = (accountId) => {
    setSelectedAccount(accountId);
    setSelectedChat(null);
    setShowContacts(true);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`home-container h-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header
        totalPages={totalPages}
        currentPage={currentPage}
        onPageClick={handleAccountClick}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      <div className="mid flex h-full">
        <div className={`mid-contacts w-full lg:w-1/3 h-full ${showContacts ? 'block' : 'hidden'} lg:block`}>
          <Contacts page={selectedAccount} onContactClick={handleContactClick} />
        </div>
        <div className={`mid-messages w-full lg:w-2/3 h-full relative ${selectedChat ? 'block' : 'hidden'}`} style={{ backgroundImage: `url(${BgImage})`, backgroundSize: 'cover' }}>
          {selectedChat && <Messages chatId={selectedChat} isDarkMode={isDarkMode} />}
          {!selectedChat && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
              Select a contact to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
