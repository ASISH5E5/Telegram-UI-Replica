import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './contact.css';

const Contacts = ({ page, onContactClick, isDarkMode }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`https://devapi.beyondchats.com/api/get_all_chats?page=${page}`);
        if (response.data && response.data.data) {
          setChats(response.data.data.data);
        } else {
          console.error('Invalid API response:', response);
          setError('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to fetch chats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [page]);

  const handleContactClick = (chatId) => {
    setActiveChatId(chatId);
    onContactClick(chatId);
  };

  return (
    <div className={`contacts h-full overflow-y-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-xl font-bold mb-4">Contacts List</h2>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {chats.length === 0 && !loading && !error && <p>No chats found.</p>}
      {chats.length > 0 && (
        <div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`contact flex text-left py-2 px-1 cursor-pointer ${activeChatId === chat.id ? 'active bg-blue-500 text-black' : ''}`}
              onClick={() => handleContactClick(chat.id)}
            >
              <FontAwesomeIcon icon={faUser} className="text-gray-600 mr-2" />
              <span className="truncate">
                <span className="text-lg">{chat.creator.name || `User: ${chat.creator.id}`}</span>
                <br />
                <span className="text-sm ml-2">{chat.creator.phone && `(${chat.creator.phone})`}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
