import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaLock, FaEnvelope, FaUserFriends, FaArrowRight } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './ApiReference.css';

const apiSections = [
  {
    title: 'Authentication',
    description: 'Endpoints for user authentication and authorization',
    icon: <FaLock className="text-blue-500" />,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and get access token'
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account'
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout user and invalidate token'
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current user profile'
      }
    ]
  },
  {
    title: 'Messages',
    description: 'Endpoints for managing legacy messages',
    icon: <FaEnvelope className="text-blue-500" />,
    endpoints: [
      {
        method: 'GET',
        path: '/api/messages',
        description: 'Get all messages for current user'
      },
      {
        method: 'POST',
        path: '/api/messages',
        description: 'Create a new message'
      },
      {
        method: 'GET',
        path: '/api/messages/:id',
        description: 'Get a specific message'
      },
      {
        method: 'PUT',
        path: '/api/messages/:id',
        description: 'Update a message'
      },
      {
        method: 'DELETE',
        path: '/api/messages/:id',
        description: 'Delete a message'
      }
    ]
  },
  {
    title: 'Recipients',
    description: 'Endpoints for managing message recipients',
    icon: <FaUserFriends className="text-blue-500" />,
    endpoints: [
      {
        method: 'GET',
        path: '/api/recipients',
        description: 'Get all recipients for current user'
      },
      {
        method: 'POST',
        path: '/api/recipients',
        description: 'Add a new recipient'
      },
      {
        method: 'GET',
        path: '/api/recipients/:id',
        description: 'Get a specific recipient'
      },
      {
        method: 'PUT',
        path: '/api/recipients/:id',
        description: 'Update a recipient'
      },
      {
        method: 'DELETE',
        path: '/api/recipients/:id',
        description: 'Remove a recipient'
      }
    ]
  }
];

const ApiReference = () => {
  return (
    <div className="api-reference-page">
      <div className="gradient-bg" />
      <BackButton />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="api-reference-hero"
      >
        <div className="icon-container">
          <FaCode className="text-blue-500" />
        </div>
        <h1>API Reference</h1>
        <p>
          Comprehensive documentation for our RESTful API endpoints. Use these endpoints to integrate
          Digital Legacy into your applications.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="api-grid"
      >
        {apiSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="api-card"
          >
            <div className="api-header">
              {section.icon}
              <h3>{section.title}</h3>
            </div>
            <p>{section.description}</p>
            <div className="endpoints-list">
              {section.endpoints.map((endpoint, idx) => (
                <div key={idx} className="endpoint-item">
                  <span className={`method ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <span className="path">{endpoint.path}</span>
                  <span className="description">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="api-reference-cta"
      >
        <h2>Need Help?</h2>
        <p>
          Our team is here to help you integrate with our API. Contact us for support or
          check out our detailed documentation.
        </p>
        <a href="/docs" className="cta-button">
          View Documentation
          <FaArrowRight />
        </a>
      </motion.div>
    </div>
  );
};

export default ApiReference; 