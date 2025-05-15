import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaClock, FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'Family Legacy Letter',
      recipient: 'My Children',
      createdAt: '2024-02-15',
      status: 'locked',
      type: 'time-locked',
      attachments: 3
    },
    {
      id: 2,
      title: 'Life Advice Collection',
      recipient: 'Sarah Johnson',
      createdAt: '2024-02-10',
      status: 'draft',
      type: 'event-based',
      attachments: 1
    },
    {
      id: 3,
      title: 'Personal Memories',
      recipient: 'Self',
      createdAt: '2024-02-01',
      status: 'pending',
      type: 'time-capsule',
      attachments: 5
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-gray-400">
              Manage and track all your digital legacy messages
            </p>
          </motion.div>
          
          <Link
            to="/create-message"
            className="btn-primary flex items-center space-x-2"
          >
            <FaEnvelope className="w-4 h-4" />
            <span>New Message</span>
          </Link>
        </div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
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
                  {messages.filter(m => m.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-400">Drafts</div>
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
                      : message.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaClock className="w-4 h-4" />
                  <span>Created: {message.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaLock className="w-4 h-4" />
                  <span>{message.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaEnvelope className="w-4 h-4" />
                  <span>{message.attachments} attachment{message.attachments !== 1 && 's'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center space-x-4">
                  <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <FaEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <button className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2">
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages; 