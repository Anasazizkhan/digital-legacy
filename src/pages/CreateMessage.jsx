import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createMessage } from '../services/messageService';
import { sendMessageToCohere } from '../services/claudeService';
import { FaPaperPlane, FaRobot, FaUser, FaCalendar, FaClock, FaEnvelope } from 'react-icons/fa';
import './CreateMessage.css';

const CreateMessage = () => {
  const [messageDetails, setMessageDetails] = useState({
    title: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    recipientEmail: '',
    emailOption: 'own'
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if template was selected
    const params = new URLSearchParams(location.search);
    const templateId = params.get('template');
    
    if (templateId) {
      const template = getTemplateContent(templateId);
      if (template) {
        setMessageDetails(prev => ({
          ...prev,
          title: template.title,
          content: template.content
        }));
      }
    }
  }, [location]);

  const getTemplateContent = (templateId) => {
    const templates = {
      birthday: {
        title: 'Birthday Wishes',
        content: 'On this special day, I want to celebrate you and all the joy you bring to the world. May your birthday be filled with love, laughter, and wonderful memories...'
      },
      anniversary: {
        title: 'Anniversary Celebration',
        content: 'As we celebrate another year of our journey together, I want to express my deepest gratitude for all the beautiful moments we\'ve shared...'
      },
      wedding: {
        title: 'Wedding Congratulations',
        content: 'On this joyous occasion of your wedding, I want to share my heartfelt congratulations and best wishes for your new journey together...'
      },
      graduation: {
        title: 'Graduation Celebration',
        content: 'Congratulations on this remarkable achievement! Your graduation marks the beginning of an exciting new chapter in your life...'
      },
      love: {
        title: 'Love Letter',
        content: 'Dear [Recipient],\n\nI wanted to take a moment to express my deepest feelings for you...'
      },
      wisdom: {
        title: 'Life Wisdom',
        content: 'Here are some lessons I\'ve learned throughout my life that I hope will guide you...'
      },
      memories: {
        title: 'Special Memories',
        content: 'Let me share with you some of my most cherished memories...'
      },
      gratitude: {
        title: 'Gratitude Message',
        content: 'I want to express my deepest gratitude for everything you\'ve done...'
      },
      advice: {
        title: 'Life Advice',
        content: 'Here\'s some advice I wish someone had given me when I was younger...'
      },
      farewell: {
        title: 'Farewell Message',
        content: 'As I write this message, I want to say goodbye in a way that truly expresses...'
      }
    };
    return templates[templateId];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const scheduledDateTime = new Date(`${messageDetails.scheduledDate}T${messageDetails.scheduledTime}`);
      
      if (scheduledDateTime <= new Date()) {
        setError('Please select a future date and time');
        return;
      }

      const messageData = {
        title: messageDetails.title,
        content: messageDetails.content,
        scheduledFor: scheduledDateTime.toISOString(),
        recipientEmail: messageDetails.emailOption === 'own' ? currentUser.email : messageDetails.recipientEmail,
        userId: currentUser.uid
      };

      await createMessage(messageData);
      navigate('/messages');
    } catch (err) {
      setError(err.message || 'Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = {
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setChatLoading(true);

    try {
      const response = await sendMessageToCohere(userInput);
      const botMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response from AI. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="create-message-container">
      <div className="message-form-section">
        <h1>Create New Message</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={messageDetails.title}
              onChange={(e) => setMessageDetails({ ...messageDetails, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Message</label>
            <textarea
              id="content"
              value={messageDetails.content}
              onChange={(e) => setMessageDetails({ ...messageDetails, content: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="scheduledDate">Schedule Date</label>
            <input
              type="date"
              id="scheduledDate"
              value={messageDetails.scheduledDate}
              onChange={(e) => setMessageDetails({ ...messageDetails, scheduledDate: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="scheduledTime">Schedule Time</label>
            <input
              type="time"
              id="scheduledTime"
              value={messageDetails.scheduledTime}
              onChange={(e) => setMessageDetails({ ...messageDetails, scheduledTime: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipientEmail">Recipient Email</label>
            <input
              type="email"
              id="recipientEmail"
              value={messageDetails.recipientEmail}
              onChange={(e) => setMessageDetails({ ...messageDetails, recipientEmail: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Message'}
          </button>
        </form>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <span className="chat-icon">💬</span>
          <h2>Message Assistant</h2>
        </div>
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="chat-message bot">
              <div className="message-content">Thinking...</div>
            </div>
          )}
        </div>
        <form onSubmit={handleChatSubmit} className="chat-input-form">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask for help with your message..."
            disabled={chatLoading}
          />
          <button type="submit" disabled={chatLoading || !userInput.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMessage; 