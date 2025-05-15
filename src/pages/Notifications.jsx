import { useState } from 'react';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Message Scheduled',
      message: 'Your message has been scheduled for delivery.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      title: 'Security Update',
      message: 'Your account security settings were updated.',
      time: '1 day ago',
      read: true,
    },
  ]);

  return (
    <div className="has-navbar-spacing">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <FaBell className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="space-y-6">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group flex items-start space-x-6 p-6 bg-black/40 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-lg transition-all duration-200"
            >
              <div className="flex-shrink-0 mt-1">
                {notification.read ? (
                  <FaCheck className="w-5 h-5 text-gray-400" />
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-white mb-2">
                  {notification.title}
                </p>
                <p className="text-base text-gray-300 mb-3">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.time}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FaTimes className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 