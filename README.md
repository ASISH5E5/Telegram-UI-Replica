Telegram UI Replica
Introduction

This project is a pixel-perfect replica of the Telegram messaging application, created as part of an assignment for the position of Frontend React Developer at BeyondChats. The goal was to demonstrate my UI/UX skills and React expertise by replicating the Telegram mobile and desktop views.

Technologies Used

ReactJS: The core framework used for building the application.

Node Libraries: Various node libraries were used to support the development.

MUI: Used for UI components to ensure consistency and responsiveness.

Axios: For making HTTP requests to the provided APIs.

Features

Responsive Design: The UI adapts to both desktop and mobile views.

Dark Mode: Users can switch between light and dark modes.

Contacts and Messages: Displays a list of contacts and their messages using the provided APIs.

Navigation: Easy navigation between contacts and messages.

API Endpoints Used

Get All Chats:

URL: https://devapi.beyondchats.com/api/get_all_chats?page=1 Method: GET Description: Returns a list of chats (paginated).

Get Chat Messages:

URL: https://devapi.beyondchats.com/api/get_chat_messages?chat_id=3888 Method: GET Description: Returns a list of messages for a given chat ID.

How to Run the Project Clone the repository:

bash

Copy code

git clone https://github.com/yourusername/telegram-ui-replica.git

Navigate to the project directory:

bash Copy code cd telegram-ui-replica Install dependencies:

bash Copy code npm install Start the development server:

bash Copy code npm start Open your browser and go to http://localhost:3000 to view the application.

Deployment The project is deployed and can be accessed at: Live Demo

Project Structure

src/: Contains all the source code.

components/: Contains React components for Contacts, Messages, Header, and Home.

Images/: Contains images and other static assets.

public/: Contains the public assets and the index.html file.

Future Improvements

Implementing more features of the Telegram UI.

Enhancing performance and optimization.

Adding more detailed error handling and loading states.

Conclusion

This project was a great opportunity to showcase my skills in React and UI/UX design. I look forward to receiving feedback and improving based on it.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Contact

If you have any questions or need further information, please feel free to contact me via Asishkumarpydi@gmail.com.
