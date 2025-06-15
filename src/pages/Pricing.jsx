import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaTimes,
  FaRocket,
  FaCrown,
  FaGem,
  FaArrowRight
} from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './Pricing.css';

const pricingTiers = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started with digital legacy planning',
    icon: <FaRocket className="w-6 h-6" />,
    features: [
      { text: 'Up to 5 time-capsule messages', included: true },
      { text: 'Basic message templates', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Standard security features', included: true },
      { text: 'Custom message templates', included: false },
      { text: 'Priority support', included: false },
      { text: 'Advanced security features', included: false },
      { text: 'Unlimited messages', included: false }
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Enhanced features for comprehensive digital legacy planning',
    icon: <FaGem className="w-6 h-6" />,
    features: [
      { text: 'Up to 50 time-capsule messages', included: true },
      { text: 'All message templates', included: true },
      { text: 'Email & SMS notifications', included: true },
      { text: 'Advanced security features', included: true },
      { text: 'Custom message templates', included: true },
      { text: 'Priority support', included: true },
      { text: 'Two-factor authentication', included: true },
      { text: 'Unlimited messages', included: false }
    ],
    cta: 'Upgrade Now',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'month',
    description: 'Complete solution for extensive digital legacy management',
    icon: <FaCrown className="w-6 h-6" />,
    features: [
      { text: 'Unlimited time-capsule messages', included: true },
      { text: 'All message templates', included: true },
      { text: 'All notification channels', included: true },
      { text: 'Enterprise-grade security', included: true },
      { text: 'Custom message templates', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Advanced security features', included: true },
      { text: 'Unlimited messages', included: true }
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const Pricing = () => {
  return (
    <div className="pricing-page">
      <BackButton />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pricing-hero"
      >
        <h1>Simple, Transparent Pricing</h1>
        <p>
          Choose the perfect plan for your digital legacy needs. 
          All plans include our core security features and basic functionality.
        </p>
      </motion.div>

      {/* Pricing Tiers */}
      <div className="pricing-grid">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`pricing-card ${tier.popular ? 'popular' : ''}`}
          >
            {tier.popular && (
              <div className="popular-badge">Most Popular</div>
            )}
            <div className="tier-icon">{tier.icon}</div>
            <h3>{tier.name}</h3>
            <div className="price">
              <span className="amount">{tier.price}</span>
              {tier.period && <span className="period">/{tier.period}</span>}
            </div>
            <p className="description">{tier.description}</p>
            <ul className="features-list">
              {tier.features.map((feature, i) => (
                <li key={i} className={feature.included ? 'included' : 'excluded'}>
                  {feature.included ? (
                    <FaCheck className="feature-icon included" />
                  ) : (
                    <FaTimes className="feature-icon excluded" />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <button className="tier-cta">
              {tier.cta} <FaArrowRight />
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="pricing-faq"
      >
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="faq-item">
            <h3>What happens if I exceed my message limit?</h3>
            <p>You'll be notified when you're close to your limit. You can upgrade your plan at any time to increase your limit.</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="pricing-cta"
      >
        <h2>Ready to Secure Your Digital Legacy?</h2>
        <p>Start with our free plan and upgrade as your needs grow.</p>
        <button className="cta-button">
          Get Started <FaArrowRight />
        </button>
      </motion.div>
    </div>
  );
};

export default Pricing; 