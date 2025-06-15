import { motion } from 'framer-motion';
import { 
  FaUserPlus, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaBell,
  FaClock,
  FaHeart,
  FaCheck,
  FaPlay,
  FaQuestionCircle
} from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './HowItWorks.css';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <FaUserPlus className="w-6 h-6" />,
    title: 'Create Your Account',
    description: 'Sign up for a free account and set up your profile. Choose your preferred notification settings and security options.',
    features: [
      'Quick and easy registration',
      'Secure authentication',
      'Customizable profile',
      'Notification preferences'
    ]
  },
  {
    icon: <FaEnvelope className="w-6 h-6" />,
    title: 'Create Your Messages',
    description: 'Write and schedule messages for your loved ones. Choose from various templates or create your own custom messages.',
    features: [
      'Multiple message templates',
      'Custom message creation',
      'Rich text formatting',
      'Media attachments'
    ]
  },
  {
    icon: <FaCalendarAlt className="w-6 h-6" />,
    title: 'Set Delivery Schedule',
    description: 'Choose when and how your messages should be delivered. Set specific dates or event-based triggers.',
    features: [
      'Flexible scheduling options',
      'Event-based triggers',
      'Multiple delivery methods',
      'Delivery confirmation'
    ]
  },
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: 'Secure Your Legacy',
    description: 'Rest easy knowing your messages are protected with enterprise-grade security and encryption.',
    features: [
      'End-to-end encryption',
      'Secure storage',
      'Access controls',
      'Activity monitoring'
    ]
  }
];

const benefits = [
  {
    icon: <FaLock className="w-6 h-6" />,
    title: 'Secure Storage',
    description: 'Your messages are encrypted and stored with military-grade security protocols.'
  },
  {
    icon: <FaBell className="w-6 h-6" />,
    title: 'Smart Notifications',
    description: 'Get notified about message status and delivery confirmations.'
  },
  {
    icon: <FaClock className="w-6 h-6" />,
    title: 'Flexible Timing',
    description: 'Schedule messages for specific dates or life events.'
  },
  {
    icon: <FaHeart className="w-6 h-6" />,
    title: 'Personal Touch',
    description: 'Add photos, videos, and personal touches to your messages.'
  }
];

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <BackButton />
      
      <div className="how-it-works-hero">
        <div className="icon-container">
          <FaQuestionCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h1>How It Works</h1>
        <p>Create and manage your digital legacy in four simple steps</p>
      </div>

      {/* Video Section */}
      <motion.div
        className="how-it-works-video-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Step-by-Step Tutorial</h2>
        <p>Follow along with our comprehensive tutorial to learn how to create, manage, and schedule your digital legacy messages with ease.</p>
        <div className="how-it-works-video-container">
          <iframe
            src="https://www.youtube.com/embed/xDMjh6wDL3g"
            title="Digital Legacy Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* Steps Section */}
      <div className="how-it-works-steps">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="how-it-works-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="how-it-works-step-number">{index + 1}</div>
            <div className="how-it-works-step-icon">
              {step.icon}
            </div>
            <h3>{step.title}</h3>
            <p className="how-it-works-step-description">{step.description}</p>
            <ul className="how-it-works-step-features">
              {step.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.2) + (i * 0.1) }}
                >
                  <FaCheck className="how-it-works-feature-icon" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="how-it-works-benefits">
        <h2>Why Choose Us</h2>
        <div className="how-it-works-benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="how-it-works-benefit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="how-it-works-benefit-icon">
                {benefit.icon}
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="how-it-works-cta">
        <h2>Ready to Start?</h2>
        <p>Begin creating your digital legacy today</p>
        <Link to="/signup" className="how-it-works-cta-button">
          Get Started
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks; 