import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaLock, FaClock, FaCalendarAlt, FaSearch,
  FaFilter, FaPaperclip, FaEye, FaTrash, FaEdit
} from 'react-icons/fa';

const ViewMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const messages = [
    {
      id: 1,
      title: 'Future Birthday Wishes',
      recipient: 'Sarah Johnson',
      date: '2025-03-15',
      type: 'time-locked',
      status: 'locked',
      attachments: 2,
      preview: 'A special message filled with love and birthday wishes for your 30th birthday...',
      category: 'personal'
    },
    {
      id: 2,
      title: 'Wedding Anniversary Video',
      recipient: 'David & Emma',
      date: '2024-12-25',
      type: 'event-based',
      status: 'pending',
      attachments: 5,
      preview: 'Congratulations on your 25th wedding anniversary! Here are some memories...',
      category: 'celebration'
    },
    {
      id: 3,
      title: 'Career Advice',
      recipient: 'Self',
      date: 'Next Job Change',
      type: 'event-based',
      status: 'draft',
      attachments: 1,
      preview: 'Some thoughts and advice for your next career move...',
      category: 'professional'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'locked':
        return 'from-blue-500/10 to-blue-500/10 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'from-blue-500/10 to-blue-500/10 text-blue-400 border-blue-500/50';
      case 'draft':
        return 'from-yellow-500/10 to-orange-500/10 text-yellow-400 border-yellow-500/50';
      default:
        return 'from-gray-500/10 to-gray-600/10 text-gray-400 border-gray-500/50';
    }
  };

  const filters = [
    { label: 'All Messages', value: 'all' },
    { label: 'Time-Locked', value: 'time-locked' },
    { label: 'Event-Based', value: 'event-based' },
    { label: 'Drafts', value: 'draft' }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || message.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-black py-16 mb-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-white/10">
                <FaEnvelope className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Messages</h1>
            <p className="text-xl text-gray-300 mb-8">
              View and manage your time-locked and event-based messages
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-3 rounded-xl border transition-all whitespace-nowrap ${
                      selectedFilter === filter.value
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-black/30 border-white/10 text-gray-400 hover:bg-black/40'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Messages Grid */}
          <div className="grid gap-6">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group bg-black/30 p-6 rounded-xl border border-white/10 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{message.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-br ${getStatusColor(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-4">
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="w-3 h-3" />
                        To: {message.recipient}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3" />
                        {message.date}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {message.preview}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <FaPaperclip className="w-3 h-3" />
                      {message.attachments} attachment{message.attachments !== 1 && 's'}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <FaClock className="w-3 h-3" />
                      {message.type === 'time-locked' ? 'Time-based' : 'Event-based'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      message.category === 'personal' ? 'bg-blue-500/20 text-blue-400' :
                      message.category === 'celebration' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMessages; 