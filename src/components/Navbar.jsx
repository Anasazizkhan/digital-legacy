import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaLock, 
  FaEnvelope, 
  FaCog, 
  FaUser, 
  FaSignOutAlt,
  FaHome,
  FaChartBar,
  FaInbox,
  FaShieldAlt,
  FaUserFriends,
  FaBell,
  FaKey,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const navigation = [
  { name: 'Home', href: '/', icon: <FaHome className="w-4 h-4" /> },
  { name: 'Dashboard', href: '/dashboard', protected: true, icon: <FaChartBar className="w-4 h-4" /> },
  { name: 'Messages', href: '/messages', protected: true, icon: <FaInbox className="w-4 h-4" /> },
  { name: 'Create Message', href: '/message-templates', protected: true, icon: <FaEnvelope className="w-4 h-4" /> },
  { name: 'Vault', href: '/vault', protected: true, icon: <FaShieldAlt className="w-4 h-4" /> },
  { name: 'Profile', href: '/profile', protected: true, icon: <FaUser className="w-4 h-4" /> }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, [location.pathname]);

  const handleNavigation = (href, event) => {
    if (event) {
      event.preventDefault();
    }
    navigate(href);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const filteredNavigation = navigation.filter(item => 
    !item.protected || (item.protected && currentUser)
  );

  return (
    <nav className="nav navbar-legacy">
      <div className="nav-brand">
        <a href="/" onClick={(e) => handleNavigation('/', e)}>
          <div className="flex items-center space-x-2">
            <span className="lock-3d-container">
              <svg className="lock-3d" width="32" height="32" viewBox="0 0 64 64" fill="none">
                {/* Shackle (animated) */}
                <g className="lock-shackle">
                  <path d="M20 28v-8a12 12 0 1 1 24 0v8" stroke="#fff" strokeWidth="4" fill="none"/>
                </g>
                {/* Body */}
                <rect x="16" y="28" width="32" height="28" rx="8" fill="#fff" fillOpacity="0.98" stroke="#e5e7eb" strokeWidth="2" filter="url(#lockBodyShadow)"/>
                {/* Keyhole base */}
                <ellipse cx="32" cy="48" rx="3" ry="4" fill="#bbb"/>
                {/* Keyhole stem */}
                <rect x="30.5" y="50" width="3" height="7" rx="1.5" fill="#bbb"/>
                <defs>
                  <filter id="lockBodyShadow" x="0" y="28" width="64" height="40" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.10"/>
                  </filter>
                </defs>
              </svg>
            </span>
            <span>Digital Legacy</span>
          </div>
        </a>
      </div>

      {/* Hamburger menu for mobile */}
      <button
        className="nav-hamburger"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="nav-links"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div
        className={`nav-links${isOpen ? ' open' : ''}`}
        id="nav-links"
        aria-hidden={!isOpen && window.innerWidth <= 768}
      >
        {filteredNavigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => handleNavigation(item.href, e)}
            className={location.pathname === item.href ? 'active' : ''}
          >
            <div className="flex items-center space-x-2">
              {item.icon}
              <span>{item.name}</span>
            </div>
          </a>
        ))}

        {currentUser ? (
          <a href="#" onClick={handleLogout}>
            <div className="flex items-center space-x-2">
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </div>
          </a>
        ) : (
          <a href="/login" onClick={(e) => handleNavigation('/login', e)}>
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4" />
              <span>Login</span>
            </div>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 