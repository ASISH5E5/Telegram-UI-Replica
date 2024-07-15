import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Messages.css';

const Messages = ({ chatId, isDarkMode, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creator, setCreator] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`);
        if (response.data && response.data.data) {
          setMessages(response.data.data);
          setCreator(response.data.data[0]?.sender); // Assuming the first message sender is the creator
          if (response.data.data.length > 0) {
            setCurrentDate(formatDate(response.data.data[0].created_at));
          }
        } else {
          console.error('Invalid API response:', response);
          setError('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = formatDate(message.created_at);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const handleScroll = () => {
    const scrollTop = messagesEndRef.current.scrollTop;
    const childNodes = messagesEndRef.current.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.offsetTop <= scrollTop && node.offsetTop + node.clientHeight > scrollTop) {
        const newDate = node.getAttribute('data-date');
        if (newDate !== currentDate) {
          setCurrentDate(newDate);
        }
        break;
      }
    }
  };

  if (loading) {
    return <div className="messages">Loading messages...</div>;
  }

  if (error) {
    return <div className="messages">{error}</div>;
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={`h-[90vh] flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className={`navbar ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'} p-4 flex items-center`}>
        <FontAwesomeIcon icon={faArrowLeft} className="text-2xl mr-2 cursor-pointer" onClick={onBack} />
        <FontAwesomeIcon icon={faUserCircle} className="text-3xl mr-2" />
        <span className="text-xl">{creator?.name || `User: ${creator?.id}`}</span>
      </div>
      <div className="fixed-date-container bg-white flex justify-center items-center border-none w-full">
        <div className="fixed-date bg-gray-100 p-1 text-center w-[120px]">
          {currentDate}
        </div>
      </div>
      <div
        className="messages flex-1 overflow-auto p-4"
        onScroll={handleScroll}
        ref={messagesEndRef}
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="mb-4" data-date={date}>
            {groupedMessages[date].map((message, index) => (
              <div
                key={index}
                className={`message ${
                  isDarkMode
                    ? message.sender.name === 'BeyondChat'
                      ? 'bg-black text-white justify-right border-red-500 border-2 border-solid rounded-lg p-2 w-[80%] text-left'
                      : 'bg-black text-white justify-right border-red-500 border-2 border-solid rounded-lg p-2 w-[80%] text-left ml-[120px]'
                    : message.sender.name === 'BeyondChat'
                      ? 'bg-white justify-left border border-gray-300 rounded-lg p-2 w-[80%] text-left'
                      : 'bg-green-200 justify-right border border-gray-300 rounded-lg p-2 w-[80%] text-left ml-[120px]'
                } mb-2`}
              >
                <span className="text-left">
                  <strong>{message.sender.name || `User : ${message.sender.id}`}:</strong>
                  <br />
                  {message.message}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
