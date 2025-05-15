import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaLock, FaCalendarAlt, FaEye } from 'react-icons/fa';

const TimeLocked = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'Future Birthday Wishes',
      recipient: 'Sarah Johnson',
      unlockDate: '2025-03-15',
      type: 'date',
      status: 'locked',
      attachments: 2
    },
    {
      id: 2,
      title: 'Career Milestone Message',
      recipient: 'Self',
      unlockDate: 'Job Change',
      type: 'event',
      status: 'pending',
      attachments: 1
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Time-Locked Messages</h1>
          <p className="text-gray-400">
            Messages scheduled for future delivery based on dates or events
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <FaClock className="w-6 h-6 text-gray-400" />
                <div>
                  <h2 className="text-xl font-semibold">Message Status</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Overview of your time-locked messages
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">{messages.length}</div>
                <div className="text-sm text-gray-400">Total Messages</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'locked').length}
                </div>
                <div className="text-sm text-gray-400">Locked</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </motion.div>

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-black/50 p-6 rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{message.title}</h3>
                  <p className="text-gray-400 text-sm">To: {message.recipient}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    message.status === 'locked'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  {message.type === 'date' ? (
                    <FaCalendarAlt className="w-4 h-4" />
                  ) : (
                    <FaClock className="w-4 h-4" />
                  )}
                  <span>Unlock: {message.unlockDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaLock className="w-4 h-4" />
                  <span>{message.attachments} attachment{message.attachments !== 1 && 's'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <FaEye className="w-4 h-4" />
                  <span>Preview Message</span>
                </button>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Edit Settings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeLocked; 