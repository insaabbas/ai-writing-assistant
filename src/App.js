import React, { useState, useEffect } from "react";

function App() {
  const [category, setCategory] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/chats");
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  const loadChatById = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/chats/${id}`);
      if (!res.ok) throw new Error("Chat not found");
      const data = await res.json();

      setMessages(data.messages || []);
      setCurrentChatId(id);
      setPrompt("");
    } catch (error) {
      console.error("Failed to load chat", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const fullPrompt =
        category === "Simple Chat" ? prompt : `[Category: ${category}] ${prompt}`;

      const bodyData = { prompt: fullPrompt };
      if (currentChatId) {
        bodyData.chatId = currentChatId;
      }

      const response = await fetch("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      setCurrentChatId(data.id);

      await loadChatById(data.id);
      await fetchChats();

      setPrompt("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setPrompt("");
    setCategory(null);
  };

  const handleClearChats = async () => {
    if (!window.confirm("Are you sure you want to delete all chats?")) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/chats", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear chats");
      setChats([]);
      setMessages([]);
      setCurrentChatId(null);
      setPrompt("");
      setCategory(null);
    } catch (error) {
      console.error(error);
      alert("Failed to clear chats");
    } finally {
      setLoading(false);
    }
  };

  // Some reusable styles
  const buttonBase = {
    padding: "12px 28px",
    fontSize: 17,
    cursor: "pointer",
    borderRadius: 8,
    fontWeight: "600",
    border: "none",
    transition: "background-color 0.3s ease",
  };

  if (!category) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f9fafb",
          color: "#333",
          padding: 20,
        }}
      >
        <h1 style={{ marginBottom: 30, fontSize: 36, fontWeight: "700" }}>
          Select a category
        </h1>
        <div style={{ display: "flex", gap: 24 }}>
          {["Email", "Blog", "Resume", "Simple Chat"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...buttonBase,
                backgroundColor: "#2563eb",
                color: "white",
                boxShadow:
                  "0 4px 6px rgba(37, 99, 235, 0.4), 0 1px 3px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 28, fontSize: 16, color: "#666" }}>
          You can switch category anytime by clicking "New Chat".
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#eef2f7",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid #ddd",
          padding: 20,
          overflowY: "auto",
          boxSizing: "border-box",
          backgroundColor: "white",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            ...buttonBase,
            width: "100%",
            marginBottom: 20,
            backgroundColor: "#ef4444",
            color: "white",
            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.4)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
          disabled={loading}
        >
          NEW CHAT
        </button>
        <h3
          style={{
            fontWeight: "700",
            fontSize: 20,
            marginBottom: 14,
            color: "#374151",
            borderBottom: "1px solid #ddd",
            paddingBottom: 8,
          }}
        >
          Your Chats
        </h3>
        {chats.length === 0 && (
          <p style={{ color: "#6b7280", fontStyle: "italic" }}>No chats yet</p>
        )}
        <ul style={{ listStyleType: "none", padding: 0, flexGrow: 1, overflowY: "auto" }}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => loadChatById(chat.id)}
              style={{
                padding: "12px 14px",
                cursor: "pointer",
                backgroundColor: chat.id === currentChatId ? "#dbeafe" : "transparent",
                borderRadius: 8,
                marginBottom: 8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: chat.id === currentChatId ? "700" : "500",
                color: chat.id === currentChatId ? "#1e40af" : "#374151",
                boxShadow: chat.id === currentChatId ? "0 0 8px #bfdbfe" : "none",
                userSelect: "none",
                transition: "background-color 0.25s ease",
              }}
              title={`${new Date(chat.lastTimestamp).toLocaleString()}\n${chat.lastPrompt}`}
            >
              {chat.lastPrompt.length > 50
                ? chat.lastPrompt.substring(0, 50) + "..."
                : chat.lastPrompt}
            </li>
          ))}
        </ul>
        <button
          onClick={handleClearChats}
          style={{
            ...buttonBase,
            width: "100%",
            marginTop: "auto",
            backgroundColor: "#ef4444",
            color: "white",
            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.4)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
          disabled={loading}
        >
          Clear All Chats
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontWeight: "800",
            fontSize: 32,
            color: "#111827",
            marginBottom: 24,
          }}
        >
          AI Writing Assistant - {category}
        </h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: 25 }}>
          <textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Enter your ${
              category === "Simple Chat" ? "message" : category.toLowerCase()
            } command...`}
            style={{
              width: "100%",
              marginBottom: 14,
              fontSize: 18,
              padding: 15,
              borderRadius: 10,
              border: "1px solid #d1d5db",
              resize: "vertical",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.1)",
              transition: "border-color 0.3s ease",
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonBase,
              backgroundColor: "#2563eb",
              color: "white",
              alignSelf: "flex-start",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        <h2
          style={{
            fontWeight: "700",
            fontSize: 22,
            marginBottom: 16,
            color: "#374151",
          }}
        >
          Conversation
        </h2>
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            minHeight: 250,
            maxHeight: 440,
            overflowY: "auto",
            borderRadius: 12,
            fontSize: 17,
            color: "#1f2937",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              No messages yet. Start chatting!
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 18,
                padding: 12,
                backgroundColor: "#f3f4f6",
                borderRadius: 10,
                boxShadow: "inset 0 0 6px rgb(0 0 0 / 0.05)",
                userSelect: "text",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: 6,
                  color: "#111827",
                  fontSize: 16,
                }}
              >
                You:
              </div>
              <div style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
                {msg.prompt}
              </div>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: 6,
                  color: "#2563eb",
                  fontSize: 16,
                }}
              >
                AI:
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.response}</div>
              <small style={{ color: "#6b7280", marginTop: 10, display: "block" }}>
                {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
