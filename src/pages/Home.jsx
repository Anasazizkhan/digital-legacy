import { motion } from 'framer-motion';
import { 
  FaLock, 
  FaEnvelope, 
  FaShieldAlt, 
  FaUserFriends, 
  FaClock, 
  FaKey,
  FaArrowRight,
  FaCheckCircle,
  FaQuestionCircle,
  FaHeartbeat,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaBell
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatBot from '../components/ChatBot';
import './Home.css';

const features = [
  {
    icon: <FaEnvelope className="w-6 h-6" />,
    title: 'Time-Capsule Messages',
    description: 'Create and schedule messages to be delivered to your loved ones at specific moments in the future.',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80',
    link: '/create-message'
  },
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: 'Secure Digital Vault',
    description: 'Store and protect your most important digital assets with military-grade encryption.',
    image: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80',
    link: '/vault'
  },
  {
    icon: <FaUserFriends className="w-6 h-6" />,
    title: 'Trusted Contacts',
    description: 'Designate trusted individuals to manage and distribute your digital legacy.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    link: '/trusted-contacts'
  }
];

const howItWorks = [
  {
    icon: <FaLock className="w-8 h-8" />,
    title: 'Create Your Account',
    description: 'Sign up and set up your secure digital legacy vault.'
  },
  {
    icon: <FaEnvelope className="w-8 h-8" />,
    title: 'Add Your Content',
    description: 'Upload messages, documents, and memories you want to preserve.'
  },
  {
    icon: <FaClock className="w-8 h-8" />,
    title: 'Set Conditions',
    description: 'Choose when and how your content will be shared.'
  },
  {
    icon: <FaHeartbeat className="w-8 h-8" />,
    title: 'Peace of Mind',
    description: 'Rest assured your digital legacy is secure and will be delivered as intended.'
  }
];

const testimonials = [
  {
    quote: "This platform gave me peace of mind knowing my digital legacy is secure.",
    author: "Sarah M.",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The time-capsule messages feature is incredible. I've prepared messages for my children's future milestones.",
    author: "Michael R.",
    role: "Parent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The security features are top-notch. I feel confident my sensitive information is protected.",
    author: "David L.",
    role: "IT Professional",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];

const faqs = [
  {
    question: "How secure is my data?",
    answer: "We use military-grade encryption and secure cloud storage to protect your data. All information is encrypted end-to-end, and only you and your designated trusted contacts can access it."
  },
  {
    question: "What happens to my digital legacy?",
    answer: "Your digital assets are securely stored and will be distributed according to your specific instructions and conditions. You have full control over who receives what and when."
  },
  {
    question: "Can I update my legacy plan?",
    answer: "Yes, you can modify your digital legacy plan at any time. Add new messages, update documents, or change your trusted contacts whenever you need."
  },
  {
    question: "How do time-capsule messages work?",
    answer: "You can write messages now and schedule them to be delivered to specific people at future dates or after certain conditions are met. Perfect for birthdays, anniversaries, or life milestones."
  }
];

const securityFeatures = [
  {
    icon: <FaKey className="w-6 h-6" />,
    title: "End-to-End Encryption",
    description: "Your data is encrypted before it leaves your device and can only be decrypted by authorized recipients."
  },
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: "Secure Authentication",
    description: "Multi-factor authentication and biometric security options to protect your account."
  },
  {
    icon: <FaCheckCircle className="w-6 h-6" />,
    title: "Regular Security Audits",
    description: "Our systems undergo regular security assessments to ensure your data remains protected."
  },
  {
    icon: <FaQuestionCircle className="w-6 h-6" />,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help with any security concerns."
  }
];

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Security', href: '/security' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' }
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/support' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Partners', href: '/partners' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' }
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com', icon: <FaTwitter /> },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: <FaLinkedin /> },
    { name: 'GitHub', href: 'https://github.com', icon: <FaGithub /> },
    { name: 'Instagram', href: 'https://instagram.com', icon: <FaInstagram /> }
  ]
};

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        className="hero-section"
          >
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Home_hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Secure Your Digital Legacy</h1>
          <p>
            Protect and preserve your digital assets for future generations. 
            Schedule messages, secure important files, and ensure your digital legacy lives on.
              </p>
                  <button
            className="cta-button"
            onClick={() => navigate(currentUser ? '/dashboard' : '/register')}
                    >
            Get Started <FaArrowRight />
                    </button>
              </div>
          </motion.div>

          {/* Features Grid */}
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="feature-card"
                  onClick={() => navigate(feature.link)}
                >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>

      {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        className="how-it-works-section"
      >
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Securing your digital legacy is simple and straightforward</p>
        <div className="steps-grid">
              {howItWorks.map((step, index) => (
                <motion.div
              key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="step-card"
                >
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Users</div>
                      </div>
        <div className="stat-card">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Messages Sent</div>
                      </div>
        <div className="stat-card">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
                    </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
                    </div>
                  </div>

          {/* Security Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
        className="security-section"
          >
        <h2 className="section-title">Bank-Grade Security</h2>
        <p className="section-subtitle">
                Your digital legacy deserves the highest level of protection. Our platform employs multiple layers of security to keep your data safe.
              </p>
        <div className="security-grid">
              {securityFeatures.map((feature, index) => (
                <motion.div
              key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="security-card"
                >
              <div className="security-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="testimonial-card"
            >
              <p className="testimonial-content">{testimonial.quote}</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
        className="faq-section"
      >
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Find answers to common questions about our digital legacy platform</p>
        <div className="faq-grid">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="faq-card"
                >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
        className="cta-section"
      >
        <h2>Secure Your Digital Legacy Today</h2>
        <p>
                Join thousands of users who trust us with their digital legacy. Start preserving your memories and important documents for future generations.
              </p>
        <div className="cta-buttons">
                {currentUser ? (
                  <button
                    onClick={() => navigate('/create-message')}
              className="cta-button"
                  >
              <FaEnvelope /> Create Your First Message
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                className="cta-button"
                    >
                <FaShieldAlt /> Start Your Legacy
                    </button>
                    <button
                      onClick={() => navigate('/create-message')}
                className="cta-button secondary"
                    >
                <FaEnvelope /> Create Message
                    </button>
                  </>
                )}
            </div>
          </motion.div>

          {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
                {/* Company Info */}
          <div className="footer-company">
            <h3>Digital Legacy</h3>
            <p>Secure your digital future and preserve your memories for generations to come.</p>
            <div className="social-links">
                    {footerLinks.social.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                  className="social-link"
                      >
                        <span className="sr-only">{item.name}</span>
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>

          {/* Footer Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                    {footerLinks.product.map((item) => (
                      <li key={item.name}>
                    <a href={item.href}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                    {footerLinks.resources.map((item) => (
                      <li key={item.name}>
                    <a href={item.href}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                    {footerLinks.company.map((item) => (
                      <li key={item.name}>
                    <a href={item.href}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                    {footerLinks.legal.map((item) => (
                      <li key={item.name}>
                    <a href={item.href}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
            </div>
                </div>
              </div>

              {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Digital Legacy. All rights reserved.</p>
          <div className="footer-legal">
                    {footerLinks.legal.slice(0, 2).map((item) => (
              <a key={item.name} href={item.href}>
                        {item.name}
                      </a>
                    ))}
              </div>
            </div>
          </footer>

      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
};

export default Home; 