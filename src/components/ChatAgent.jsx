import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaPaperPlane, FaTimes, FaHeadset } from 'react-icons/fa';
import { CohereClient } from 'cohere-ai';
import './ChatAgent.css';

const ChatAgent = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const agentName = "Anas"; // You can change this to "Tamanna" if preferred

  // Initialize Cohere client
  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY
  });

  const initialGreeting = {
    type: 'agent',
    text: `Hi! I'm ${agentName}, your Digital Legacy support agent. I'm here to help you manage your digital legacy and ensure your messages reach their intended recipients. How can I assist you today?`,
    timestamp: new Date()
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialGreeting]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = async (message) => {
    try {
      const response = await cohere.generate({
        prompt: `You are ${agentName}, a friendly and professional support agent for Digital Legacy. Your personality traits:
        - Warm and empathetic
        - Professional but conversational
        - Detail-oriented and thorough
        - Proactive in offering solutions
        - Patient and understanding
        
        You're helping users with Digital Legacy, a platform for managing digital assets and scheduling messages. The user has asked: "${message}"
        
        Provide a helpful, concise, and professional response that reflects your personality. Include relevant details about Digital Legacy's features when appropriate.`,
        max_tokens: 200,
        temperature: 0.8,
        k: 0,
        p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stop_sequences: ["\n\n"],
        return_likelihoods: "NONE"
      });

      return response.generations[0].text.trim();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Could you please try rephrasing your question? I'm here to help!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate response using Cohere
      const response = await generateResponse(inputMessage);
      
      const agentMessage = {
        type: 'agent',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = {
        type: 'agent',
        text: "I apologize, but I'm having trouble processing your request right now. Could you please try again? I'm here to help you!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-agent-container">
      <div className="chat-agent-header">
        <div className="agent-info">
          <FaHeadset className="agent-icon" />
          <div>
            <h3>{agentName}</h3>
            <span className="agent-status">Online</span>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user-message' : 'agent-message'}`}
          >
            <div className="message-content">
              {message.type === 'agent' && <FaHeadset className="message-icon" />}
              <div className="message-bubble">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              {message.type === 'user' && <FaUser className="message-icon" />}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message agent-message">
            <div className="message-content">
              <FaHeadset className="message-icon" />
              <div className="message-bubble typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !inputMessage.trim()}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatAgent; 