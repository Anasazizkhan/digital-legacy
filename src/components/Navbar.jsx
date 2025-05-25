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

const navigation = [
  { name: 'Home', href: '/', icon: <FaHome className="w-4 h-4" /> },
  { name: 'Dashboard', href: '/dashboard', protected: true, icon: <FaChartBar className="w-4 h-4" /> },
  { name: 'Messages', href: '/messages', protected: true, icon: <FaInbox className="w-4 h-4" /> },
  { name: 'Create Message', href: '/message-templates', protected: true, icon: <FaEnvelope className="w-4 h-4" /> },
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
    <nav className="nav">
      <div className="nav-brand">
        <a href="/" onClick={(e) => handleNavigation('/', e)}>
          <div className="flex items-center space-x-2">
            <FaLock className="w-5 h-5" />
            <span>Digital Legacy</span>
          </div>
        </a>
      </div>

      <div className="nav-links">
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