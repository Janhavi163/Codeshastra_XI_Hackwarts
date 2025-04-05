import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Toggle state
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
      const botText = res.data.reply;
      setMessages([...newMessages, { sender: "Bot", text: botText }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: "Bot", text: "Oops! Something went wrong." }]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="chat-toggle-button" style={{borderRadius : "8px"}} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close Chat" : "Chat with Us"}
      </button>

      {/* Chatbot Container (shown only when isOpen is true) */}
      {isOpen && (
        <div className="chatbot-container">
          <h3>Travel Assistant</h3>
          <div className="chatbox">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender === "You" ? "user" : "bot"}`}>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Ask me anything about travel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

