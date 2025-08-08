import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
const PORT = 4000;

const apiKey = process.env.GOOGLE_API_KEY;  // Load your key from .env


const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

const CHAT_STORAGE_DIR = path.resolve("./chat-history");

if (!fs.existsSync(CHAT_STORAGE_DIR)) {
  fs.mkdirSync(CHAT_STORAGE_DIR);
}

app.use(cors());
app.use(express.json());

// POST: Generate AI response and save chat message
app.post("/api/generate", async (req, res) => {
  const { prompt, chatId } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Call Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: "No response from Gemini API" });
    }

    const aiText = data.candidates[0].content.parts[0].text;

    let chatData;
    let id = chatId;

    if (chatId) {
     
      const filePath = path.join(CHAT_STORAGE_DIR, `${chatId}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        chatData = JSON.parse(content);
        if (!chatData.messages) chatData.messages = [];

        chatData.messages.push({
          prompt,
          response: aiText,
          timestamp: new Date().toISOString(),
        });

        chatData.timestamp = new Date().toISOString(); // Update chat last modified
      } else {
        
        id = Date.now().toString();
        chatData = {
          id,
          messages: [
            {
              prompt,
              response: aiText,
              timestamp: new Date().toISOString(),
            },
          ],
          timestamp: new Date().toISOString(),
        };
      }

      fs.writeFileSync(filePath, JSON.stringify(chatData, null, 2));
    } else {
 
      id = Date.now().toString();
      chatData = {
        id,
        messages: [
          {
            prompt,
            response: aiText,
            timestamp: new Date().toISOString(),
          },
        ],
        timestamp: new Date().toISOString(),
      };

      const filePath = path.join(CHAT_STORAGE_DIR, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(chatData, null, 2));
    }

    res.json({ text: aiText, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to call Gemini API" });
  }
});


app.get("/api/chats", (req, res) => {
  try {
    if (!fs.existsSync(CHAT_STORAGE_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(CHAT_STORAGE_DIR);
    const chats = files.map((file) => {
      const content = fs.readFileSync(path.join(CHAT_STORAGE_DIR, file), "utf-8");
      const chat = JSON.parse(content);
      const lastMessage = chat.messages && chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1]
        : null;

      return {
        id: chat.id,
        lastPrompt: lastMessage ? lastMessage.prompt : "",
        lastTimestamp: chat.timestamp || (lastMessage ? lastMessage.timestamp : ""),
      };
    });
    // Sort newest first
    chats.sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read chat files" });
  }
});

// GET: Get a single chat by id (full messages)
app.get("/api/chats/:id", (req, res) => {
  const id = req.params.id;
  try {
    const filePath = path.join(CHAT_STORAGE_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Chat not found" });
    }
    const content = fs.readFileSync(filePath, "utf-8");
    const chat = JSON.parse(content);
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read chat file" });
  }
});

// DELETE: Clear all chat files
app.delete("/api/chats", (req, res) => {
  console.log("DELETE /api/chats called");
  try {
    if (!fs.existsSync(CHAT_STORAGE_DIR)) {
      return res.json({ message: "No chats to delete" });
    }
    const files = fs.readdirSync(CHAT_STORAGE_DIR);
    files.forEach(file => {
      fs.unlinkSync(path.join(CHAT_STORAGE_DIR, file));
    });
    res.json({ message: "All chats cleared" });
  } catch (error) {
    console.error("Failed to clear chats", error);
    res.status(500).json({ error: "Failed to clear chats" });
  }
});

// GET: Test route to check if chat-history folder exists and list files
app.get("/api/test-files", (req, res) => {
  try {
    if (!fs.existsSync(CHAT_STORAGE_DIR)) {
      return res.json({ exists: false });
    }
    const files = fs.readdirSync(CHAT_STORAGE_DIR);
    res.json({ exists: true, files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start server AFTER all routes are defined
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
