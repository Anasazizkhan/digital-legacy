import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  createMessage, 
  getMessage, 
  getUserMessages, 
  updateMessage, 
  deleteMessage, 
  getMessagesByStatus 
} from '../services/messageService';
import api from '../config/api';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState({ title: '', content: '' });

  // Test connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        console.log('Backend connection successful:', response.data);
      } catch (err) {
        console.error('Backend connection failed:', err);
        setError('Failed to connect to backend: ' + err.message);
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getUserMessages();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const createdMessage = await createMessage(newMessage);
      setMessages([createdMessage, ...messages]);
      setNewMessage({ title: '', content: '' });
    } catch (err) {
      setError('Failed to create message: ' + (err.message || 'Unknown error'));
      console.error('Error creating message:', err);
    }
  };

  const handleUpdate = async (messageId, updatedData) => {
    try {
      const updatedMessage = await updateMessage(messageId, updatedData);
      setMessages(messages.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
    } catch (err) {
      setError('Failed to update message: ' + (err.message || 'Unknown error'));
      console.error('Error updating message:', err);
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
        <Link to="/create-message" className="create-button">
          Create New Message
        </Link>
      </div>
      
      {/* Create Message Form */}
      <form onSubmit={handleCreate} className="message-form">
        <input
          type="text"
          placeholder="Title"
          value={newMessage.title}
          onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Content"
          value={newMessage.content}
          onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
          required
        />
        <button type="submit">Create Message</button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Messages List */}
      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className="message-item">
              <h3>{message.title}</h3>
              <p>{message.content}</p>
              <div className="message-meta">
                <span>Scheduled for: {new Date(message.scheduledFor).toLocaleString()}</span>
                <span>Status: {message.status}</span>
              </div>
              <div className="message-actions">
                <button onClick={() => handleDelete(message.id)}>Delete</button>
                <button onClick={() => handleUpdate(message.id, { 
                  ...message, 
                  content: message.content + ' (edited)' 
                })}>
                  Edit
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