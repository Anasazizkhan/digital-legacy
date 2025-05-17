import React from 'react';
import { Link } from 'react-router-dom';
import './MessageTemplates.css';

const MessageTemplates = () => {
  const options = [
    {
      id: 'custom',
      title: 'Custom Message',
      description: 'Write your own personal message from scratch',
      icon: '✍️'
    },
    {
      id: 'template',
      title: 'Use Template',
      description: 'Choose from our pre-written message templates',
      icon: '📝'
    }
  ];

  return (
    <div className="templates-page">
      <h1>How would you like to create your message?</h1>
      <div className="templates-grid">
        {options.map(option => (
          <Link 
            key={option.id}
            to={option.id === 'custom' ? '/create-message' : '/message-templates-list'}
            className="template-card"
          >
            <div className="template-icon">{option.icon}</div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplates; 