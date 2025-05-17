import React from 'react';
import { Link } from 'react-router-dom';
import './MessageTemplatesList.css';

const MessageTemplatesList = () => {
  const templates = [
    {
      id: 'love',
      title: 'Love Letter',
      description: 'Express your feelings with a heartfelt message',
      icon: '❤️'
    },
    {
      id: 'wisdom',
      title: 'Life Wisdom',
      description: 'Share your life lessons and experiences',
      icon: '📚'
    },
    {
      id: 'memories',
      title: 'Special Memories',
      description: 'Share your favorite memories and moments',
      icon: '🎞️'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Message',
      description: 'Express your appreciation and thanks',
      icon: '🙏'
    },
    {
      id: 'advice',
      title: 'Life Advice',
      description: 'Share your guidance and wisdom for the future',
      icon: '💡'
    },
    {
      id: 'farewell',
      title: 'Farewell Message',
      description: 'Say goodbye with a meaningful message',
      icon: '👋'
    }
  ];

  return (
    <div className="templates-list-page">
      <div className="templates-header">
        <h1>Choose a Template</h1>
        <Link to="/create-message" className="custom-link">
          Write Custom Message Instead
        </Link>
      </div>
      
      <div className="templates-grid">
        {templates.map(template => (
          <Link 
            key={template.id}
            to={`/create-message?template=${template.id}`}
            className="template-card"
          >
            <div className="template-icon">{template.icon}</div>
            <h3>{template.title}</h3>
            <p>{template.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplatesList; 