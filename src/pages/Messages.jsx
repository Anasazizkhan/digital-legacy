import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaLock, FaClock, FaEye, FaTrash, FaEdit, 
  FaFilter, FaSearch, FaSort, FaCalendar, FaPaperclip,
  FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'Family Legacy Letter',
      recipient: 'My Children',
      createdAt: '2024-02-15',
      deliveryDate: '2025-01-01',
      status: 'locked',
      type: 'time-locked',
      attachments: 3,
      preview: 'A collection of life lessons, memories, and advice for future generations...'
    },
    {
      id: 2,
      title: 'Life Advice Collection',
      recipient: 'Sarah Johnson',
      createdAt: '2024-02-10',
      deliveryDate: 'On graduation',
      status: 'draft',
      type: 'event-based',
      attachments: 1,
      preview: 'Personal guidance and congratulations for achieving this milestone...'
    },
    {
      id: 3,
      title: 'Personal Memories',
      recipient: 'Self',
      createdAt: '2024-02-01',
      deliveryDate: '2024-12-31',
      status: 'pending',
      type: 'time-capsule',
      attachments: 5,
      preview: 'Reflections on personal growth and memorable moments from the year...'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredMessages = messages
    .filter(message => 
      filterStatus === 'all' ? true : message.status === filterStatus
    )
    .filter(message =>
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.title.localeCompare(b.title);
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'locked':
        return 'bg-blue-500/20 text-blue-400';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-lg"
          >
            <FaEnvelope className="w-4 h-4" />
            <span>New Message</span>
          </Link>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-2">{messages.length}</div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FaEnvelope />
              Total Messages
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-2">
              {messages.filter(m => m.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FaEdit />
              Drafts
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-2">
              {messages.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FaHourglassHalf />
              Pending
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold mb-2">
              {messages.filter(m => m.status === 'locked').length}
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FaLock />
              Locked
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-6 bg-black/30 p-4 rounded-lg backdrop-blur-sm"
        >
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Drafts</option>
            <option value="pending">Pending</option>
            <option value="locked">Locked</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </motion.div>

        {/* Messages List */}
        <div className="grid gap-4">
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group bg-black/30 p-6 rounded-xl border border-white/10 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{message.title}</h3>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)} flex items-center gap-1`}>
                      {message.status === 'locked' && <FaLock className="w-3 h-3" />}
                      {message.status === 'draft' && <FaEdit className="w-3 h-3" />}
                      {message.status === 'pending' && <FaHourglassHalf className="w-3 h-3" />}
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="w-3 h-3" /> 
                      <span className="font-medium text-gray-300">{message.recipient}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendar className="w-3 h-3" /> 
                      <span>
                        Delivery: <span className="font-medium text-gray-300">{message.deliveryDate}</span>
                      </span>
                    </span>
                  </p>
                </div>
                
                {/* Delivery Progress Indicator */}
                {message.status === 'locked' && (
                  <div className="hidden group-hover:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, Math.max(0, 
                            ((new Date(message.deliveryDate) - new Date()) / 
                            (new Date(message.deliveryDate) - new Date(message.createdAt))) * 100
                          ))}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">Time until delivery</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {message.preview}
                </p>
                {message.preview.length > 150 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent group-hover:hidden" />
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                  <FaClock className="w-3 h-3" />
                  Created: {message.createdAt}
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                  <FaPaperclip className="w-3 h-3" />
                  {message.attachments} attachment{message.attachments !== 1 && 's'}
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                  <FaLock className="w-3 h-3" />
                  {message.type}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                    <FaEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaEnvelope className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No messages found</h3>
            <p className="text-gray-400">
              {searchTerm 
                ? "No messages match your search criteria" 
                : "Start by creating your first message"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Messages; 