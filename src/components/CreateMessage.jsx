import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createMessage } from '../services/messageService';
import './CreateMessage.css';

const CreateMessage = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState({
    title: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    recipientEmail: currentUser?.email || '',
    emailOption: 'own' // 'own' or 'custom'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine date and time into a single timestamp
      const scheduledDateTime = new Date(`${message.scheduledDate}T${message.scheduledTime}`);
      
      // Validate scheduled time
      if (scheduledDateTime <= new Date()) {
        throw new Error('Scheduled time must be in the future');
      }

      const messageData = {
        title: message.title,
        content: message.content,
        scheduledFor: scheduledDateTime.toISOString(),
        recipientEmail: message.emailOption === 'own' ? currentUser.email : message.recipientEmail,
        senderEmail: currentUser.email,
        status: 'scheduled'
      };

      await createMessage(messageData);
      // Reset form
      setMessage({
        title: '',
        content: '',
        scheduledDate: '',
        scheduledTime: '',
        recipientEmail: currentUser?.email || '',
        emailOption: 'own'
      });
      alert('Message scheduled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to schedule message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMessage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="create-message-container">
      <h2>Schedule a Message</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="title">Subject</label>
          <input
            type="text"
            id="title"
            name="title"
            value={message.title}
            onChange={handleChange}
            placeholder="Enter message subject"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            name="content"
            value={message.content}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduledDate">Date</label>
          <input
            type="date"
            id="scheduledDate"
            name="scheduledDate"
            value={message.scheduledDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduledTime">Time</label>
          <input
            type="time"
            id="scheduledTime"
            name="scheduledTime"
            value={message.scheduledTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailOption">Recipient Email</label>
          <select
            id="emailOption"
            name="emailOption"
            value={message.emailOption}
            onChange={handleChange}
            className="email-select"
          >
            <option value="own">My Email ({currentUser?.email})</option>
            <option value="custom">Custom Email</option>
          </select>
        </div>

        {message.emailOption === 'custom' && (
          <div className="form-group">
            <label htmlFor="recipientEmail">Custom Email Address</label>
            <input
              type="email"
              id="recipientEmail"
              name="recipientEmail"
              value={message.recipientEmail}
              onChange={handleChange}
              placeholder="Enter recipient email"
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Message'}
        </button>
      </form>
    </div>
  );
};

export default CreateMessage; 