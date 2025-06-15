import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaUser, FaRobot } from 'react-icons/fa';
import './LiveChat.css';

const LiveChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        text: "Thank you for your message. Our support team will be with you shortly. In the meantime, is there anything specific you'd like to know about our services?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="live-chat-container">
      <div className="live-chat-header">
        <h3>Live Chat Support</h3>
        <button onClick={onClose} className="close-button">
          <FaTimes />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h4>Welcome to Live Chat Support!</h4>
            <p>Our team is ready to assist you. How can we help you today?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-icon">
                {message.sender === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default LiveChat; 