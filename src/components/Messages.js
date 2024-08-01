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

/*{
"status": "success",
"status_code": 200,
"message": "User messages fetched successfully!",
"data": [
{
"id": 14022,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-04T09:41:48.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14023,
"sender_id": 3828,
"role_id": 4,
"message": "hi",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-04T09:41:48.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14024,
"sender_id": 1,
"role_id": 9,
"message": "Hello! \nHow can I assist you today?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-04T09:41:50.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14087,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:33:27.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14088,
"sender_id": 3828,
"role_id": 4,
"message": "cost",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:33:27.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14089,
"sender_id": 1,
"role_id": 9,
"message": "Our costs vary depending on the service you require. \nFor example, an online appraisal via video call is £399, while an express or urgent appraisal is £500 [[1]](https://medicalappraisals.org.uk/cost). \nAdditionally, routine appraisal is priced at £399 and express appraisal at £500 [[1]](https://medicalappraisals.org.uk/cost). \nFeel free to visit our website for further details on pricing. \nHow can I assist you further with this information?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:33:37.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14090,
"sender_id": 3828,
"role_id": 4,
"message": "myths",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:33:51.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14091,
"sender_id": 1,
"role_id": 9,
"message": "There are many myths surrounding medical appraisals, but one common misconception is that they are time-consuming and complicated. \nAt Medical Appraisals, we strive to make the process as efficient and straightforward as possible for doctors. \nWe offer a user-friendly platform and dedicated support to ensure a smooth experience. \nIs there any specific myth you'd like me to address or clarify further?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:33:54.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14092,
"sender_id": 3828,
"role_id": 4,
"message": "can you tell me some of the myths",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:34:14.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14093,
"sender_id": 1,
"role_id": 9,
"message": "One common myth about medical appraisals is that they are the main way to identify concerns about doctors [[1]](https://youtube.com/watch?v=-jPmZiMzHVA). \nHowever, issues related to performance, conduct, or health are usually discovered through separate clinical governance processes, not primarily during appraisals [724; 777]. \nAnother myth is that doctors can fail their medical appraisals, but in reality, it's not a pass or fail assessment; instead, it's a formative and developmental process [[2]](https://youtube.com/watch?v=100PU1CCv3E). \nThese myths often lead to misunderstandings about the purpose and outcomes of medical appraisals.",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T07:34:23.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14094,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:01:29.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14095,
"sender_id": 3828,
"role_id": 4,
"message": "What are the benefits of having a medical appraisal?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:01:29.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14096,
"sender_id": 1,
"role_id": 9,
"message": "Medical appraisals offer numerous benefits for doctors, their employing organizations, and appraisers. \nThey help doctors maintain professional standards, identify areas for improvement, ensure continuous learning, and enhance patient care quality [[1]](https://youtube.com/watch?v=n5UzUJAg-74). \nAdditionally, they contribute to maintaining public trust in the medical profession and upholding patient safety [[1]](https://youtube.com/watch?v=n5UzUJAg-74). \nKey insights: Quality improvement activities play a crucial role in enhancing the effectiveness of medical appraisals [[2]](https://youtube.com/watch?v=RJiH-9g8rZk) and the responsible officer ensures that the portfolio meets the GMC standards [[3]](https://youtube.com/watch?v=NNgb5l53gFg).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:01:43.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14097,
"sender_id": 3828,
"role_id": 4,
"message": "can i use paper-based evidance",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:04:13.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14098,
"sender_id": 1,
"role_id": 9,
"message": "I recommend using approved appraisal software like L2P, FourteenFish, or Clarity to compile your evidence digitally for a more organized and efficient process [923: can I use paper-based evidence] [924: can I use paper-based evidence] [922: can I use paper-based evidence] [920: can I use paper-based evidence]. \nKindly scan and upload all paper evidence such as certificates on the appraisal portfolio.",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:04:21.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14099,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:42:04.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14100,
"sender_id": 3828,
"role_id": 4,
"message": "What types of supporting information are required for revalidation?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:42:04.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14101,
"sender_id": 1,
"role_id": 9,
"message": "For revalidation, doctors need to provide six types of supporting information across their entire scope of practice [679; Supporting Information For A Medical Appraisal]. \nThese include Continuous Professional Development (CPD), Quality Improvement Activities (QIA), significant events, patient feedback, colleague feedback, and information about any complaints and compliments [[1]](https://youtube.com/watch?v=NNgb5l53gFg). \nIt's essential to maintain updated documentation that demonstrates fitness to practice in all areas [[1]](https://youtube.com/watch?v=NNgb5l53gFg). \nRemember to seek early confirmation from the Responsible Officer if there are unresolved queries [[1]](https://youtube.com/watch?v=NNgb5l53gFg).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:42:27.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14102,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:46:18.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14103,
"sender_id": 3828,
"role_id": 4,
"message": "What types of supporting information are required for revalidation?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:46:18.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14104,
"sender_id": 1,
"role_id": 9,
"message": "For revalidation, doctors need to provide six types of supporting information across their entire scope of practice [[1]](https://youtube.com/watch?v=NNgb5l53gFg). \nThey are required to submit: \n1. Continuous Professional Development (CPD) \n2. Quality Improvement Activities (QIA) \n3. Significant Events \n4. Patient Feedback \n5. Colleague Feedback \n6. Information about Complaints and Compliments. \nAdditional sources to consider include detailed guidance on declarations and documentation management [1; 760].",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T08:46:45.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14105,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:15:46.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14106,
"sender_id": 3828,
"role_id": 4,
"message": "What are the benefits of having a medical appraisal?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:15:46.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14107,
"sender_id": 3828,
"role_id": 4,
"message": "What are the benefits of having a medical appraisal?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:16:57.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14108,
"sender_id": 1,
"role_id": 9,
"message": "Medical appraisals play a crucial role in maintaining professional standards and promoting continuous learning among doctors [[1]](https://youtube.com/watch?v=n5UzUJAg-74). \nThese assessments encourage self-assessment in clinical practice, aligning doctors with regulatory body standards like the GMC [[1]](https://youtube.com/watch?v=n5UzUJAg-74). \nBy addressing performance issues promptly, appraisals uphold patient safety and public trust [[1]](https://youtube.com/watch?v=n5UzUJAg-74).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:17:05.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14109,
"sender_id": 3828,
"role_id": 4,
"message": "can i use paper-based evidance",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:17:21.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14110,
"sender_id": 1,
"role_id": 9,
"message": "I recommend using approved appraisal software like L2P, FourteenFish, or Clarity to compile your evidence digitally for a more organized and efficient process . \nKindly scan and upload all paper evidence such as certificates onto the appraisal portfolio for convenience and accessibility . \nAdditionally, it is essential to ensure that the documentation of supporting information remains up to date and comprehensive across all scopes of practice [[1]](https://youtube.com/watch?v=iHlBSV9nAo8).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:17:28.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14111,
"sender_id": 3828,
"role_id": 4,
"message": "What types of supporting information are required for revalidation?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:17:39.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14112,
"sender_id": 1,
"role_id": 9,
"message": "To fulfill revalidation requirements, doctors must provide all six types of supporting information across their scope of practice, including Continuous Professional Development (CPD), Quality Improvement Activities (QIA), significant events, patient feedback, colleague feedback, and data on complaints and compliments [[1]](https://youtube.com/watch?v=GDzkNk3E8HM). \nThis broader perspective ensures that they exhibit continued competency and professionalism across all facets of medical practice [[2]](https://youtube.com/watch?v=NNgb5l53gFg).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:17:51.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14113,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:23:41.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14114,
"sender_id": 3828,
"role_id": 4,
"message": "What role does the appraiser play in the process?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:23:41.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14115,
"sender_id": 1,
"role_id": 9,
"message": "The appraiser, as part of the process, guides you and supports your reporting of concerns in compliance with the GMC Duty of Care [[1]](https://youtube.com/watch?v=ZM8KYvAdLDw). \nIn addition to this, they assist in establishing a private, confidential setting conducive to reflection and discussion throughout the appraisal [[2]](https://youtube.com/watch?v=DqZw9a6DXeE).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:23:49.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14116,
"sender_id": 3828,
"role_id": 4,
"message": "Are there any benefits to having an external appraiser?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:23:56.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14117,
"sender_id": 1,
"role_id": 9,
"message": "Having an external appraiser can offer a fresh perspective and impartial feedback on your practice [[1]](https://youtube.com/watch?v=n5UzUJAg-74). \nThis external perspective enhances the quality of the appraisal process, ensuring objectivity and helping maintain professional standards in alignment with regulatory requirements.",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:24:02.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14118,
"sender_id": 3828,
"role_id": 4,
"message": "cost",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:24:13.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14119,
"sender_id": 1,
"role_id": 9,
"message": "Our appraisal costs are transparent and affordable, with routine appraisals priced at £399 [[1]](https://medicalappraisals.org.uk/cost) and express services at £500 [[1]](https://medicalappraisals.org.uk/cost). \nAdditionally, additional services such as completing the REV 12 form directly for GMC submission cost £100 [[1]](https://medicalappraisals.org.uk/cost), while pre-appraisal coaching and support are available for £200 [[1]](https://medicalappraisals.org.uk/cost).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:24:21.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14120,
"sender_id": 3828,
"role_id": 4,
"message": "Can supporting information from overseas be included?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:25:41.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14121,
"sender_id": 1,
"role_id": 9,
"message": "Supporting information from work overseas, if relevant to your UK practice, can indeed be included in your medical appraisal portfolio [[1]](https://youtube.com/watch?v=KaE7-JLg0iU). \nThis information should demonstrate reflective practice, improvements in work, and how feedback is acted upon [[1]](https://youtube.com/watch?v=KaE7-JLg0iU). \nWhen considering including overseas work information, discussions with your Responsible Officer (RO) for guidance are recommended [[1]](https://youtube.com/watch?v=KaE7-JLg0iU).",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-10T09:25:49.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14284,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T10:49:28.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14285,
"sender_id": 3828,
"role_id": 4,
"message": "cost of service",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T10:49:28.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14286,
"sender_id": 1,
"role_id": 9,
"message": "At BeyondChats, three different plans are available: the Individual Plan for Rs 1,000, the Startup Plan for Rs 8,000, and the Enterprise Plan tailored to your specific needs . \nSubscriptions can be made on a monthly or annual basis, with an annual plan including two free months.",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T10:49:36.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14287,
"sender_id": 3828,
"role_id": 4,
"message": "thanks this has been really helpful",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T11:20:34.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14288,
"sender_id": 1,
"role_id": 9,
"message": "I'm glad I could help! \nIf you have any more questions or need further assistance, feel free to ask . \nAnd remember, BeyondChats is here to make your website chatbot experience seamless and effective!",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T11:20:42.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14289,
"sender_id": 3828,
"role_id": 4,
"message": "ok bye",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T11:21:06.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3828,
"name": "Shone Jogi",
"email": "asdfaefsdfgqwaeg@beyondexams.orgfasd",
"phone": "9130907456",
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-04T09:41:23.000000Z",
"updated_at": "2024-07-04T09:41:23.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14290,
"sender_id": 1,
"role_id": 9,
"message": "Is there anything else I can assist you with?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-12T11:21:07.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14297,
"sender_id": 1,
"role_id": 9,
"message": "Hi there! Welcome to BeyondChats\nWhat brings you here today?\nAsk me anything about BeyondChats",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-14T10:17:59.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14298,
"sender_id": 3859,
"role_id": 4,
"message": "tell me about cost",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-14T10:17:59.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3859,
"name": null,
"email": "182.69.179.204",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-10T19:21:19.000000Z",
"updated_at": "2024-07-10T19:21:19.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14299,
"sender_id": 1,
"role_id": 9,
"message": "Absolutely!\nBeyondChats offers three different pricing plans to suit your needs: Individual Plan for Rs 1,000, Startup Plan for Rs 8,000, and Enterprise Plan tailored to your requirements.\nYou can choose a monthly or annual billing cycle.\nPlus, if you opt for an annual plan, you'll get 2 months free [[1]](https://beyondchats.com/#pricings).\nFeel free to explore more on our website!",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-14T10:18:18.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
},
{
"id": 14300,
"sender_id": 3859,
"role_id": 4,
"message": "features available",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-14T10:18:46.000000Z",
"updated_at": "2024-07-31T06:50:32.000000Z",
"sender": {
"id": 3859,
"name": null,
"email": "182.69.179.204",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": "2024-07-10T19:21:19.000000Z",
"updated_at": "2024-07-10T19:21:19.000000Z",
"device": "desktop",
"browser": "Chrome",
"os": "Mac",
"city": "Delhi",
"country": {
"id": 103,
"name": "India",
"code": "IN",
"phone_code": "91"
}
}
},
{
"id": 14301,
"sender_id": 1,
"role_id": 9,
"message": "BeyondChats offers a range of features to help you boost your business, including customizable chatbots that match your brand , AI that excites users to take actions like buying products , and analytics for valuable insights.\nWe also integrate with popular CRMs and support multiple languages for seamless communication.\nExciting, right?",
"unanswered": 0,
"vote": null,
"chat_id": 3888,
"action_id": null,
"is_corrected": 0,
"created_at": "2024-07-14T10:18:52.000000Z",
"updated_at": "2024-07-31T06:50:31.000000Z",
"sender": {
"id": 1,
"name": "BeyondChat",
"email": "contact@beyondchat.com",
"phone": null,
"email_verified_at": null,
"password_updated": 0,
"created_at": null,
"updated_at": "2023-04-26T12:43:24.000000Z",
"device": null,
"browser": null,
"os": null,
"city": null,
"country": null
}
}
]
}*/
