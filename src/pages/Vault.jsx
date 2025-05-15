import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const unlockedMessages = [
  {
    id: 1,
    sender: 'You',
    date: '2023-12-25',
    content: 'Merry Christmas to my future self! Remember the joy of this moment...',
    type: 'text',
  },
  {
    id: 2,
    sender: 'Mom',
    date: '2024-01-01',
    content: 'New Year memories collection',
    type: 'media',
    mediaCount: 5,
  },
];

const Vault = () => {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="has-navbar-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Secure Vault</h1>
            <p className="text-gray-400">
              Access your unlocked messages and manage security settings
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-500">
            <FaShieldAlt className="w-5 h-5" />
            <span className="text-sm">End-to-End Encrypted</span>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        {['messages', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {unlockedMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    From: {message.sender}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Unlocked on: {message.date}
                  </p>
                </div>
                <span className="text-sm text-gray-400 capitalize">
                  {message.type}
                </span>
              </div>

              {message.type === 'text' ? (
                <p className="text-gray-300">{message.content}</p>
              ) : (
                <div className="border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 mb-2">{message.content}</p>
                  <p className="text-sm text-gray-400">
                    {message.mediaCount} media items
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card" data-aos="fade-up">
            <div className="flex items-center space-x-4 mb-4">
              <FaKey className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Encryption Keys</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Manage your encryption keys and security settings
            </p>
            <button className="btn-primary">
              Download Backup Keys
            </button>
          </div>

          <div className="card" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center space-x-4 mb-4">
              <FaLock className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Access Control</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Manage devices and sessions with access to your vault
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Current Device</h4>
                  <p className="text-sm text-gray-400">Last access: Just now</p>
                </div>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault; 