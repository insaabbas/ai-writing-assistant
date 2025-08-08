 AI Writing Assistant:

This is a simple AI writing assistant web application built with React and Node.js, integrated with Google Gemini API.

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

Screenshots:

![Homepage](pics-and-video/ai-assistant-pic-01.png)


![Chat](pics-and-video/ai-assistant-pic-02.png)


 Demo Video:

[Watch here](Pics-And-Video\video.mp4)



This project was completed by Insa Abbas on 8-9-2025.

