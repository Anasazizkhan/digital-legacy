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
  FaInstagram
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '/security' },
    { name: 'How It Works', href: '#how-it-works' },
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
    <div className="page-wrapper">
      <div className="page-container">
        <div className="content-container">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative py-20 sm:py-32 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1614064642639-e398cf05badb?auto=format&fit=crop&w=1920&q=80"
                alt="Digital Legacy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-4xl mx-auto px-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-tight">
                Secure Your Digital Legacy
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Protect and preserve your digital assets for future generations. Schedule messages, secure important files, and ensure your digital legacy lives on.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {currentUser ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaShieldAlt className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="py-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need to secure your digital future
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group cursor-pointer"
                  onClick={() => navigate(feature.link)}
                >
                  <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white/70 group-hover:scale-110 transition-transform duration-500">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    <span>Learn more</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="py-20 bg-white/5 rounded-2xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Securing your digital legacy is simple and straightforward
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="py-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-lg">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="py-20 bg-gradient-to-b from-white/5 to-transparent rounded-2xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Bank-Grade Security</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Your digital legacy deserves the highest level of protection. Our platform employs multiple layers of security to keep your data safe.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-12 h-12 mb-4 bg-white/10 rounded-lg flex items-center justify-center text-white/70">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="py-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about our digital legacy platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="py-20 text-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-emerald-500/20"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <img
                src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80"
                alt="Digital Security"
                className="w-full h-full object-cover opacity-30 scale-105"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Secure Your Digital Legacy Today</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Join thousands of users who trust us with their digital legacy. Start preserving your memories and important documents for future generations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {currentUser ? (
                  <button
                    onClick={() => navigate('/create-message')}
                    className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaEnvelope className="w-5 h-5" />
                    <span>Create Your First Message</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaShieldAlt className="w-5 h-5" />
                      <span>Start Your Legacy</span>
                    </button>
                    <button
                      onClick={() => navigate('/create-message')}
                      className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaEnvelope className="w-5 h-5 mr-2" />
                      <span>Create Message</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Footer Section */}
          <footer className="mt-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
                {/* Company Info */}
                <div className="col-span-2 md:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Digital Legacy</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Secure your digital future and preserve your memories for generations to come.
                  </p>
                  <div className="flex space-x-4">
                    {footerLinks.social.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        <span className="sr-only">{item.name}</span>
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Product Links */}
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                    Product
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources Links */}
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                    Legal
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-white/10 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Digital Legacy. All rights reserved.
                  </p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                    {footerLinks.legal.slice(0, 2).map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home; 