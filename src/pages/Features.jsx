import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaClock, FaEnvelope, FaUserFriends, FaFileAlt, FaShieldAlt, FaBell, FaChartLine, FaArrowRight, FaStar, FaCalendarAlt, FaMobileAlt, FaGlobe, FaHeart } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './Features.css';

const features = [
  {
    icon: <FaLock className="text-white" />,
    title: "Secure Storage",
    description: "Your messages are encrypted and stored securely in the cloud, ensuring they remain private and protected.",
    color: "bg-blue-500"
  },
  {
    icon: <FaClock className="text-white" />,
    title: "Scheduled Delivery",
    description: "Set specific dates and times for your messages to be delivered, ensuring perfect timing.",
    color: "bg-green-500"
  },
  {
    icon: <FaEnvelope className="text-white" />,
    title: "Multiple Recipients",
    description: "Send messages to multiple recipients, with personalized content for each person.",
    color: "bg-purple-500"
  },
  {
    icon: <FaUserFriends className="text-white" />,
    title: "Family Sharing",
    description: "Share your digital legacy with family members and loved ones in a controlled manner.",
    color: "bg-pink-500"
  },
  {
    icon: <FaFileAlt className="text-white" />,
    title: "Rich Media Support",
    description: "Include photos, videos, and documents in your messages for a more personal touch.",
    color: "bg-yellow-500"
  },
  {
    icon: <FaShieldAlt className="text-white" />,
    title: "Privacy Controls",
    description: "Control who can access your messages and when they can be delivered.",
    color: "bg-red-500"
  }
];

const premiumFeatures = [
  {
    icon: <FaBell className="text-white" />,
    title: "Smart Notifications",
    description: "Get notified when your messages are delivered and accessed.",
    color: "bg-indigo-500"
  },
  {
    icon: <FaChartLine className="text-white" />,
    title: "Advanced Analytics",
    description: "Track message delivery and engagement with detailed analytics.",
    color: "bg-teal-500"
  },
  {
    icon: <FaStar className="text-white" />,
    title: "Priority Support",
    description: "Get priority access to our support team for any questions or concerns.",
    color: "bg-orange-500"
  }
];

const Features = () => {
  return (
    <div className="features-page">
      <div className="gradient-bg"></div>
      <BackButton />
      
      <motion.div 
        className="features-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-container">
          <FaStar className="text-4xl text-white" />
        </div>
        <h1>Features</h1>
        <p>Discover how our platform helps you preserve and share your digital legacy with your loved ones.</p>
      </motion.div>

      <motion.div 
        className="features-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="premium-features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>Premium Features</h2>
        <p>Unlock additional features with our premium plans</p>
        
        <div className="premium-features-grid">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="premium-feature-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <a href="/pricing" className="premium-cta-button">
          View Pricing
          <FaArrowRight className="text-white" />
        </a>
      </motion.div>

      <motion.div 
        className="features-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users who are already preserving their digital legacy</p>
        <a href="/signup" className="cta-button">
          Get Started
          <FaArrowRight className="text-white" />
        </a>
      </motion.div>
    </div>
  );
};

export default Features; 