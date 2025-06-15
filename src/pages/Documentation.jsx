import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaFileAlt, FaLightbulb, FaArrowRight, FaStar } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './Documentation.css';

const guides = [
  {
    icon: <FaBook />,
    title: "Getting Started",
    description: "Learn the basics of Digital Legacy and set up your first message.",
    link: "#getting-started"
  },
  {
    icon: <FaFileAlt />,
    title: "Message Types",
    description: "Explore different types of messages you can create and schedule.",
    link: "#message-types"
  },
  {
    icon: <FaLightbulb />,
    title: "Best Practices",
    description: "Tips and best practices for creating meaningful digital legacies.",
    link: "#best-practices"
  }
];

const apiSections = [
  {
    title: "Authentication",
    description: "Learn how to authenticate and manage user sessions.",
    endpoints: [
      { method: "POST", path: "/api/auth/login", description: "Authenticate a user" },
      { method: "POST", path: "/api/auth/register", description: "Register a new user" },
      { method: "POST", path: "/api/auth/logout", description: "Logout a user" }
    ]
  },
  {
    title: "Messages",
    description: "Manage your digital legacy messages.",
    endpoints: [
      { method: "GET", path: "/api/messages", description: "List all messages" },
      { method: "POST", path: "/api/messages", description: "Create a new message" },
      { method: "PUT", path: "/api/messages/:id", description: "Update a message" },
      { method: "DELETE", path: "/api/messages/:id", description: "Delete a message" }
    ]
  },
  {
    title: "Recipients",
    description: "Manage message recipients and delivery settings.",
    endpoints: [
      { method: "GET", path: "/api/recipients", description: "List all recipients" },
      { method: "POST", path: "/api/recipients", description: "Add a new recipient" },
      { method: "PUT", path: "/api/recipients/:id", description: "Update recipient details" }
    ]
  }
];

const Documentation = () => {
  return (
    <div className="documentation-page">
      <div className="gradient-bg"></div>
      <BackButton />
      
      <motion.div 
        className="documentation-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-container">
          <FaBook className="text-4xl text-white" />
        </div>
        <h1>Documentation</h1>
        <p>Comprehensive guides and API reference for Digital Legacy platform</p>
      </motion.div>

      <motion.div 
        className="guides-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Guides</h2>
        <div className="guides-grid">
          {guides.map((guide, index) => (
            <motion.a
              key={index}
              href={guide.link}
              className="guide-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="guide-icon">
                {guide.icon}
              </div>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <span className="guide-link">
                Read Guide
                <FaArrowRight />
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="api-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>API Reference</h2>
        <div className="api-grid">
          {apiSections.map((section, index) => (
            <motion.div
              key={index}
              className="api-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="api-header">
                <FaCode className="text-2xl text-white" />
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
        </div>
      </motion.div>

      <motion.div 
        className="documentation-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Need More Help?</h2>
        <p>Check out our support resources or contact our team</p>
        <a href="/support" className="cta-button">
          Get Support
          <FaArrowRight />
        </a>
      </motion.div>
    </div>
  );
};

export default Documentation; 