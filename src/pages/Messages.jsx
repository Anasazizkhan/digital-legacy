import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaClock, FaEye, FaTrash, FaEdit, FaMicrophone, FaVideo, FaImage, FaFile, FaTimes, FaSave, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserMessages, deleteMessage, deleteMessageMedia, updateMessage } from '../services/messageService';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: '',
    content: '',
    scheduledFor: '',
    recipientEmail: ''
  });
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
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      console.log('Deleting message:', messageId);
      await deleteMessage(messageId);
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError('Failed to delete message: ' + (err.message || 'Unknown error'));
      console.error('Error deleting message:', err);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setEditForm({
      subject: message.title || '',
      content: message.content || '',
      scheduledFor: message.scheduledFor ? new Date(message.scheduledFor).toISOString().slice(0, 16) : '',
      recipientEmail: message.recipientEmail || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        subject: editForm.subject,
        content: editForm.content,
        scheduledFor: new Date(editForm.scheduledFor).toISOString(),
        recipientEmail: editForm.recipientEmail
      };

      console.log('Updating message:', editingMessage.id, 'with data:', updateData);
      await updateMessage(editingMessage.id, updateData);
      
      // Update the message in the local state
      setMessages(messages.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, ...updateData, title: editForm.subject }
          : msg
      ));
      
      setEditingMessage(null);
      setEditForm({
        subject: '',
        content: '',
        scheduledFor: '',
        recipientEmail: ''
      });
    } catch (err) {
      setError('Failed to update message: ' + (err.message || 'Unknown error'));
      console.error('Error updating message:', err);
    }
  };

  const handleDeleteMedia = async (messageId, mediaType, fileName) => {
    try {
      await deleteMessageMedia(messageId, mediaType, fileName);
      // Reload messages to get updated data
      await loadMessages();
    } catch (err) {
      setError('Failed to delete media: ' + (err.message || 'Unknown error'));
      console.error('Error deleting media:', err);
    }
  };

  const getMessageTypeIcon = (messageType, media) => {
    if (messageType === 'audio' || media?.audio) {
      return <FaMicrophone className="message-type-icon audio" />;
    } else if (messageType === 'video' || media?.video) {
      return <FaVideo className="message-type-icon video" />;
    } else if (messageType === 'image' || (media?.images && media.images.length > 0)) {
      return <FaImage className="message-type-icon image" />;
    } else if (messageType === 'mixed') {
      return <FaFile className="message-type-icon mixed" />;
    }
    return <FaEnvelope className="message-type-icon text" />;
  };

  const getMessageTypeLabel = (messageType, media) => {
    if (messageType === 'audio' || media?.audio) {
      return 'Audio Message';
    } else if (messageType === 'video' || media?.video) {
      return 'Video Message';
    } else if (messageType === 'image' || (media?.images && media.images.length > 0)) {
      return 'Image Message';
    } else if (messageType === 'mixed') {
      return 'Mixed Media';
    }
    return 'Text Message';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                <div className="message-title-section">
                  {getMessageTypeIcon(message.messageType, message.media)}
                  <h3>{message.title}</h3>
                  <span className="message-type-label">
                    {getMessageTypeLabel(message.messageType, message.media)}
                  </span>
                </div>
                <span className={`status-badge ${message.status}`}>
                  {message.status}
                </span>
              </div>
              
              <p className="message-content">{message.content}</p>
              
              {/* Media Attachments Display */}
              {message.media && (
                <div className="media-attachments">
                  {message.media.audio && (
                    <div className="media-item audio-item">
                      <FaMicrophone className="media-icon" />
                      <audio controls src={message.media.audio.url} />
                      <div className="media-info">
                        <span>Audio: {formatFileSize(message.media.audio.size)}</span>
                        <button 
                          onClick={() => handleDeleteMedia(message.id, 'audio', message.media.audio.fileName)}
                          className="delete-media-button"
                          title="Delete audio"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {message.media.video && (
                    <div className="media-item video-item">
                      <FaVideo className="media-icon" />
                      <video controls src={message.media.video.url} />
                      <div className="media-info">
                        <span>Video: {formatFileSize(message.media.video.size)}</span>
                        <button 
                          onClick={() => handleDeleteMedia(message.id, 'video', message.media.video.fileName)}
                          className="delete-media-button"
                          title="Delete video"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {message.media.images && message.media.images.length > 0 && (
                    <div className="media-item images-item">
                      <FaImage className="media-icon" />
                      <div className="images-grid">
                        {message.media.images.map((image, index) => (
                          <div key={index} className="image-container">
                            <img 
                              src={image.url} 
                              alt={`Attachment ${index + 1}`}
                              className="message-image"
                            />
                            <button 
                              onClick={() => handleDeleteMedia(message.id, 'image', image.fileName)}
                              className="delete-media-button image-delete"
                              title="Delete image"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
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
                  onClick={() => handleEdit(message)}
                  className="edit-button"
                  title="Edit message"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(message.id)}
                  className="delete-button"
                  title="Delete message"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMessage && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Edit Message</h2>
              <button 
                onClick={() => setEditingMessage(null)}
                className="close-button"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                  placeholder="Message subject"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  placeholder="Message content"
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduledFor">Scheduled For:</label>
                <div className="datetime-input">
                  <FaCalendarAlt className="calendar-icon" />
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    value={editForm.scheduledFor}
                    onChange={(e) => setEditForm({...editForm, scheduledFor: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="recipientEmail">Recipient Email:</label>
                <input
                  type="email"
                  id="recipientEmail"
                  value={editForm.recipientEmail}
                  onChange={(e) => setEditForm({...editForm, recipientEmail: e.target.value})}
                  placeholder="recipient@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setEditingMessage(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                className="save-button"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 