import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createMessage } from '../services/messageService';
import { sendMessageToCohere } from '../services/claudeService';
import { FaPaperPlane, FaRobot, FaUser, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import './CreateMessage.css';

const templateIcons = {
  love: '❤️',
  wisdom: '🎓',
  memories: '📸',
  gratitude: '🙏',
  advice: '💡',
  farewell: '👋'
};

const templateColors = {
  love: '#ff0066',
  wisdom: '#4b0082',
  memories: '#008080',
  gratitude: '#ffd700',
  advice: '#00ff00',
  farewell: '#808080'
};

const templatePlaceholders = {
  love: {
    title: 'Express your deepest feelings...',
    content: 'Share your love and affection...'
  },
  wisdom: {
    title: 'Share your life lessons...',
    content: 'Pass on your valuable insights and wisdom...'
  },
  memories: {
    title: 'Capture a special moment...',
    content: 'Describe the memories you want to preserve...'
  },
  gratitude: {
    title: 'Express your thankfulness...',
    content: 'Share your appreciation and gratitude...'
  },
  advice: {
    title: 'Offer guidance and support...',
    content: 'Share your advice and life experiences...'
  },
  farewell: {
    title: 'Say your heartfelt goodbye...',
    content: 'Express your final thoughts and wishes...'
  }
};

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get('template');
    
    if (templateId) {
      const template = getTemplateContent(templateId);
      if (template) {
        setSelectedTemplate(templateId);
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
      love: {
        title: 'Love Letter',
        content: 'Dear [Recipient],\n\nI wanted to take a moment to express my deepest feelings for you...',
        prompts: [
          'What do you love most about this person?',
          'What special memories do you share?',
          'How has this person impacted your life?'
        ]
      },
      wisdom: {
        title: 'Life Wisdom',
        content: 'Here are some lessons I\'ve learned throughout my life that I hope will guide you...',
        prompts: [
          'What life experiences have taught you the most?',
          'What advice would you give to someone younger?',
          'What principles have guided you through life?'
        ]
      },
      memories: {
        title: 'Special Memories',
        content: 'Let me share with you some of my most cherished memories...',
        prompts: [
          'What are your most precious memories?',
          'What moments have shaped who you are?',
          'What stories do you want to preserve?'
        ]
      },
      gratitude: {
        title: 'Gratitude Message',
        content: 'I want to express my deepest gratitude for everything you\'ve done...',
        prompts: [
          'What are you most thankful for?',
          'How has this person positively influenced your life?',
          'What specific moments are you grateful for?'
        ]
      },
      advice: {
        title: 'Life Advice',
        content: 'Here\'s some advice I wish someone had given me when I was younger...',
        prompts: [
          'What important life lessons have you learned?',
          'What mistakes taught you the most?',
          'What guidance would you give to others?'
        ]
      },
      farewell: {
        title: 'Farewell Message',
        content: 'As I write this message, I want to say goodbye in a way that truly expresses...',
        prompts: [
          'What would you like to say before saying goodbye?',
          'What memories would you like to share?',
          'What wishes do you have for the future?'
        ]
      }
    };
    return templates[templateId];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const scheduledDateTime = new Date(`${messageDetails.scheduledDate}T${messageDetails.scheduledTime}`);
      
      if (scheduledDateTime <= new Date()) {
        throw new Error('Scheduled time must be in the future');
      }

      const messageData = {
        title: messageDetails.title,
        content: messageDetails.content,
        scheduledFor: scheduledDateTime.toISOString(),
        recipientEmail: messageDetails.recipientEmail,
        type: selectedTemplate || 'custom',
        status: 'scheduled'
      };

      await createMessage(messageData);
      navigate('/messages');
    } catch (err) {
      setError(err.message || 'Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = {
      content: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setChatLoading(true);

    try {
      const response = await sendMessageToCohere(userInput, selectedTemplate);
      const assistantMessage = {
        content: response,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const currentTemplate = selectedTemplate ? getTemplateContent(selectedTemplate) : null;

  const onBack = () => {
    navigate('/message-templates-list');
  };

  return (
    <div className="page-wrapper has-navbar-spacing">
      <div className="page-container">
        <div className="content-container">
          <div className="page-header" data-template={selectedTemplate}>
            <div className="gradient-overlay"></div>
            <div className="gradient-radial"></div>
            <div className="page-header-content">
              <h1 className="page-title">{selectedTemplate ? currentTemplate.title : 'Create New Message'}</h1>
              <p className="page-description">
                {selectedTemplate ? templatePlaceholders[selectedTemplate].title : "Enter message title"}
              </p>
            </div>
          </div>

          <div className="message-form-container" data-template={selectedTemplate}>
            <div className="content-grid">
              <div className="message-form-section">
                {currentTemplate && (
                  <div className="prompts-section">
                    <h2>
                      <span>Writing Prompts</span>
                      <span className="template-icon">💭</span>
                    </h2>
                    <div className="prompts-grid">
                      {currentTemplate.prompts.map((prompt, index) => (
                        <div key={index} className="prompt-card">
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">
                      <span>📝 Message Title</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={messageDetails.title}
                      onChange={(e) => setMessageDetails({ ...messageDetails, title: e.target.value })}
                      className="form-input"
                      required
                      placeholder={selectedTemplate ? templatePlaceholders[selectedTemplate].title : "Enter message title"}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">
                      <span>✍️ Message Content</span>
                    </label>
                    <textarea
                      id="content"
                      value={messageDetails.content}
                      onChange={(e) => setMessageDetails({ ...messageDetails, content: e.target.value })}
                      className="form-textarea"
                      required
                      placeholder={selectedTemplate ? templatePlaceholders[selectedTemplate].content : "Write your message here..."}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduledDate">
                      <span>📅 Schedule Date</span>
                    </label>
                    <input
                      type="date"
                      id="scheduledDate"
                      value={messageDetails.scheduledDate}
                      onChange={(e) => setMessageDetails({ ...messageDetails, scheduledDate: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduledTime">
                      <span>⏰ Schedule Time</span>
                    </label>
                    <input
                      type="time"
                      id="scheduledTime"
                      value={messageDetails.scheduledTime}
                      onChange={(e) => setMessageDetails({ ...messageDetails, scheduledTime: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientEmail">
                      <span>📧 Recipient Email</span>
                    </label>
                    <input
                      type="email"
                      id="recipientEmail"
                      value={messageDetails.recipientEmail}
                      onChange={(e) => setMessageDetails({ ...messageDetails, recipientEmail: e.target.value })}
                      className="form-input"
                      required
                      placeholder="Enter recipient's email"
                    />
                  </div>

                  {error && (
                    <div className="error-message">
                      ⚠️ {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? '⏳ Creating...' : `${selectedTemplate ? templateIcons[selectedTemplate] : '✉️'} Create Message`}
                  </button>
                </form>
              </div>

              <div className="chat-section">
                <div className="chat-header">
                  <FaRobot className="chat-icon" />
                  <h2>Message Assistant</h2>
                </div>

                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    >
                      <div className="message-content">
                        {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                        {msg.content}
                      </div>
                      <div className="message-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="chat-message bot">
                      <div className="message-content">
                        <FaRobot /> Thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={selectedTemplate ? `Ask for ${selectedTemplate} writing suggestions...` : "Ask for writing suggestions..."}
                    disabled={chatLoading}
                  />
                  <button type="submit" disabled={chatLoading || !userInput.trim()}>
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>

            <div className="bottom-actions">
              <button onClick={() => navigate('/message-templates-list')} className="back-button">
                <FaArrowLeft /> Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMessage; 