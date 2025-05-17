import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaClock, FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserMessages, deleteMessage } from '../services/messageService';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getUserMessages(currentUser.uid);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages: ' + (err.message || 'Unknown error'));
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError('Failed to delete message: ' + (err.message || 'Unknown error'));
      console.error('Error deleting message:', err);
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>My Messages</h1>
        <Link to="/message-templates" className="create-button">
          Create New Message
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages found</p>
          <Link to="/message-templates" className="create-first-button">
            Create Your First Message
          </Link>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <h3>{message.title}</h3>
                <span className={`status-badge ${message.status}`}>
                  {message.status}
                </span>
              </div>
              <p className="message-content">{message.content}</p>
              <div className="message-meta">
                <span className="scheduled-time">
                  Scheduled for: {new Date(message.scheduledFor).toLocaleString()}
                </span>
                <span className="recipient">
                  To: {message.recipientEmail}
                </span>
              </div>
              <div className="message-actions">
                <button 
                  onClick={() => handleDelete(message.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages; 