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
  {
    name: 'Messages',
    href: '/messages',
    protected: true,
    icon: <FaInbox className="w-4 h-4" />,
    submenu: [
      { name: 'Create Message', href: '/create-message', icon: <FaEnvelope className="w-4 h-4" /> },
      { name: 'View Messages', href: '/messages', icon: <FaInbox className="w-4 h-4" /> },
      { name: 'Time-Locked', href: '/time-locked', icon: <FaLock className="w-4 h-4" /> },
      { name: 'Life Events', href: '/life-events', icon: <FaChartBar className="w-4 h-4" /> },
    ]
  },
  {
    name: 'Vault',
    href: '/vault',
    protected: true,
    icon: <FaShieldAlt className="w-4 h-4" />,
    submenu: [
      { name: 'Secure Storage', href: '/vault', icon: <FaLock className="w-4 h-4" /> },
      { name: 'Encryption Settings', href: '/encryption-settings', icon: <FaKey className="w-4 h-4" /> },
      { name: 'Trusted Contacts', href: '/trusted-contacts', icon: <FaUserFriends className="w-4 h-4" /> },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    protected: true,
    icon: <FaCog className="w-4 h-4" />,
    submenu: [
      { name: 'Profile', href: '/profile', icon: <FaUser className="w-4 h-4" /> },
      { name: 'Notifications', href: '/notifications', icon: <FaBell className="w-4 h-4" /> },
      { name: 'Security', href: '/security', icon: <FaShieldAlt className="w-4 h-4" /> },
    ]
  }
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

  const handleNavigation = (href) => {
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

  const handleLogout = async () => {
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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')} 
            className="flex items-center space-x-3 group"
          >
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-xl overflow-hidden">
              <FaLock className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-shimmer" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Digital Legacy
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {filteredNavigation.map((item, index) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <button
                    onClick={(e) => toggleSubmenu(index, e)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-gray-400 transition-colors duration-200">{item.icon}</span>
                    <span>{item.name}</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeSubmenu === index ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-white/5 ${
                      location.pathname === item.href ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="transition-colors duration-200">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                )}
                
                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && activeSubmenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
                    >
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.href)}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-all duration-200 hover:bg-white/5 ${
                              location.pathname === subItem.href ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="transition-colors duration-200">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-all duration-200 rounded-lg"
              >
                <FaUser className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
          >
            {isOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-md border-t border-white/5"
          >
            <div className="px-2 py-3 space-y-1">
              {filteredNavigation.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === item.href ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                  {item.submenu && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => handleNavigation(subItem.href)}
                          className={`flex items-center space-x-2 w-full px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                            location.pathname === subItem.href ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{subItem.icon}</span>
                          <span>{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-all duration-200 rounded-lg"
                >
                  <FaUser className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 