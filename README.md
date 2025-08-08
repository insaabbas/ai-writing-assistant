 AI Writing Assistant:

This is a simple AI writing assistant web application built with React and Node.js, integrated with Google Gemini API.

## Setup

1. Create a `.env` file inside the backend folder.
2. Add your Google API key like this:

   GOOGLE_API_KEY=your_actual_google_api_key_here

3. Run the backend server as usual.


*Note:* The `.env` file is not included in the repository for security reasons. Please get the API key separately.




 Features:

 Users can select chat type: Email, Blog, Resume, or Simple Chat
 Maintain chat history saved on server
 Load previous chats and continue conversations
 Clear all chats from history
 Responsive and clean UI

 Technologies Used:

 React (Frontend)
 Node.js + Express (Backend)
 Google Gemini API for AI responses
 File system for chat storage

 Setup and Installation:

 Backend:

1. Navigate to backend folder (or root if both are together)
2. Run `npm install` to install dependencies
3. Add your Google Gemini API key inside `index.js` (replace the placeholder)
4. Run `node index.js` to start backend on port 4000

Frontend:

1. Navigate to frontend folder
2. Run `npm install` to install dependencies
3. Run `npm start` to launch React app on port 3000
4. Make sure backend is running before interacting with the app

How it works:

The React app allows users to select chat types first, then input prompts.
The backend receives prompts, sends requests to Gemini API, and saves conversations as JSON files.
Users can load previous chats from the sidebar.
Chats are stored on disk under the `chat-history` folder.
Users can clear all chat history using the button at the bottom of the sidebar.

 **watch demo video and screechots in pics and video folder**



This project was completed by Insa Abbas on 8-9-2025.

