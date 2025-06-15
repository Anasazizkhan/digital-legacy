import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaKey, FaCheckCircle, FaFingerprint, FaArrowRight } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import './Security.css';

const Security = () => {
  const securityFeatures = [
    {
      icon: <FaShieldAlt />,
      title: "End-to-End Encryption",
      description: "Your data is encrypted before it leaves your device and can only be decrypted by authorized recipients.",
      details: [
        "256-bit AES encryption",
        "Zero-knowledge architecture",
        "Secure key management"
      ]
    },
    {
      icon: <FaLock />,
      title: "Secure Storage",
      description: "Your digital assets are stored in our highly secure, redundant cloud infrastructure.",
      details: [
        "Multiple data centers",
        "Regular backups",
        "Disaster recovery"
      ]
    },
    {
      icon: <FaUserShield />,
      title: "Access Control",
      description: "Granular control over who can access your digital legacy and when.",
      details: [
        "Role-based access",
        "Time-based permissions",
        "Multi-factor authentication"
      ]
    },
    {
      icon: <FaKey />,
      title: "Authentication",
      description: "Multiple layers of security to ensure only authorized access to your account.",
      details: [
        "2FA support",
        "Biometric authentication",
        "Secure password policies"
      ]
    }
  ];

  const securityPractices = [
    {
      title: "Regular Security Audits",
      description: "Our systems undergo continuous security assessments and penetration testing.",
      icon: <FaCheckCircle />
    },
    {
      title: "Compliance Standards",
      description: "We adhere to industry-leading security standards and regulations.",
      icon: <FaCheckCircle />
    },
    {
      title: "Privacy First",
      description: "Your data privacy is our top priority. We never share your information with third parties.",
      icon: <FaCheckCircle />
    }
  ];

  return (
    <div className="security-page">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="security-hero"
      >
        <h1>Security at Digital Legacy</h1>
        <p>Your digital legacy is protected by state-of-the-art security measures</p>
      </motion.div>

      <div className="security-features">
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="security-feature-card"
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <ul className="feature-details">
              {feature.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="security-practices"
      >
        <h2>Our Security Practices</h2>
        <div className="practices-grid">
          {securityPractices.map((practice, index) => (
            <div key={index} className="practice-card">
              <div className="practice-icon">{practice.icon}</div>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="security-cta"
      >
        <h2>Ready to Secure Your Digital Legacy?</h2>
        <p>Join thousands of users who trust us with their digital assets</p>
        <button className="cta-button">Get Started</button>
      </motion.div>
    </div>
  );
};

export default Security; 