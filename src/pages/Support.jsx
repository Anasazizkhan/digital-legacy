import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaEnvelope, 
  FaBook, 
  FaChevronDown, 
  FaChevronUp,
  FaPhone,
  FaComments,
  FaPaperPlane,
  FaClock,
  FaUser,
  FaExclamationCircle
} from 'react-icons/fa';
import ChatAgent from '../components/ChatAgent';
import './Support.css';

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });

  const faqs = [
    {
      question: "What is Digital Legacy?",
      answer: "Digital Legacy is a platform that helps you secure and manage your digital assets, create scheduled messages, and ensure your digital presence is properly handled for future generations."
    },
    {
      question: "How do I schedule a message?",
      answer: "You can schedule a message by going to the Dashboard, clicking on 'Create New Message', and following the step-by-step process to compose and schedule your message for future delivery."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security very seriously. All your data is encrypted, and we use industry-standard security measures to protect your information. We never share your data with third parties."
    },
    {
      question: "How can I recover my account?",
      answer: "If you've forgotten your password, you can use the 'Forgot Password' option on the login page. For other account recovery issues, please contact our support team."
    },
    {
      question: "What types of messages can I schedule?",
      answer: "You can schedule various types of messages including text, images, videos, and documents. Each message can be customized with different delivery dates and recipients."
    },
    {
      question: "How long are my messages stored?",
      answer: "Your messages are stored securely until their scheduled delivery date. After delivery, they remain accessible to recipients for 30 days unless specified otherwise."
    }
  ];

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      alert('Your support ticket has been submitted successfully. We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your ticket. Please try again.');
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@digitallegacy.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+1234567890';
  };

  return (
    <div className="support-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="support-container"
      >
        <h1>Support Center</h1>
        <p className="support-intro">
          We're here to help you with any questions or concerns you may have.
          Choose from the options below to get the assistance you need.
        </p>

        {/* Contact Options Section */}
        <div className="contact-options">
          <div className="contact-card" onClick={handleEmailClick}>
            <FaEnvelope className="contact-icon" />
            <h3>Email Support</h3>
            <p>Get in touch with our support team</p>
            <a href="mailto:support@digitallegacy.com" className="contact-link">
              support@digitallegacy.com
            </a>
            <span className="response-time">Response within 24 hours</span>
          </div>

          <div className="contact-card" onClick={handlePhoneClick}>
            <FaPhone className="contact-icon" />
            <h3>Phone Support</h3>
            <p>Speak with our support team directly</p>
            <a href="tel:+1234567890" className="contact-link">
              +1 (234) 567-890
            </a>
            <span className="response-time">Mon-Fri, 9AM-6PM EST</span>
          </div>

          <div className="contact-card">
            <FaComments className="contact-icon" />
            <h3>Live Chat</h3>
            <p>Chat with our support team in real-time</p>
            <button 
              className="chat-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsChatOpen(true);
              }}
            >
              Start Live Chat
            </button>
            <span className="response-time">Available 24/7</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="support-section faq-section">
          <h2><FaQuestionCircle /> Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => handleFaqClick(index)}
                >
                  <h3>{faq.question}</h3>
                  {activeFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="support-section contact-section">
          <h2><FaPaperPlane /> Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Your email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  <FaBook /> Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Issue</option>
                  <option value="security">Security Concern</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">
                  <FaExclamationCircle /> Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please provide detailed information about your issue"
              />
            </div>

            <button type="submit" className="submit-button">
              <FaPaperPlane /> Submit Ticket
            </button>
          </form>
        </div>
      </motion.div>

      {/* Live Chat Component */}
      <ChatAgent isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Support; 