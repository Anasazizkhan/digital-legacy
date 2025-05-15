import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaLock, FaCalendarAlt, FaEye, FaHourglassHalf, FaEnvelope, FaPaperclip, FaChevronRight } from 'react-icons/fa';

const TimeLocked = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'Future Birthday Wishes',
      recipient: 'Sarah Johnson',
      unlockDate: '2025-03-15',
      type: 'date',
      status: 'locked',
      attachments: 2,
      preview: 'A special message filled with love and birthday wishes for your 30th birthday...',
      progress: 65
    },
    {
      id: 2,
      title: 'Career Milestone Message',
      recipient: 'Self',
      unlockDate: 'Job Change',
      type: 'event',
      status: 'pending',
      attachments: 1,
      preview: 'Reflections and advice for your next career move...',
      progress: 0
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'locked':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <FaLock className="text-blue-400" />
            Time-Locked Messages
          </h1>
          <p className="text-gray-400">
            Messages scheduled for future delivery based on dates or events
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 p-6 rounded-lg border border-white/10 mb-8"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
              <div className="text-3xl font-bold text-blue-400 mb-2">{messages.length}</div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/5">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {messages.filter(m => m.status === 'locked').length}
              </div>
              <div className="text-sm text-gray-400">Time-Locked</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/5">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {messages.filter(m => m.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-400">Event-Based</div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`group bg-black/30 p-6 rounded-xl border border-white/10 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] cursor-pointer ${
                selectedMessage?.id === message.id ? 'border-blue-500/50 bg-black/40' : ''
              }`}
              onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{message.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)} flex items-center gap-2`}>
                      {message.status === 'locked' ? <FaLock className="w-3 h-3" /> : <FaHourglassHalf className="w-3 h-3" />}
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <FaEnvelope className="w-3 h-3" />
                      To: <span className="text-gray-300">{message.recipient}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="w-3 h-3" />
                      Unlock: <span className="text-gray-300">{message.unlockDate}</span>
                    </span>
                  </p>
                </div>
                
                {message.status === 'locked' && (
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-blue-400">{message.progress}%</div>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${message.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <p className={`text-gray-400 text-sm mb-4 transition-all duration-300 ${
                  selectedMessage?.id === message.id ? '' : 'line-clamp-2'
                }`}>
                  {message.preview}
                </p>
                {message.preview.length > 150 && selectedMessage?.id !== message.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-sm text-gray-400">
                    <FaPaperclip className="w-3 h-3" />
                    {message.attachments} attachment{message.attachments !== 1 && 's'}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-400">
                    <FaClock className="w-3 h-3" />
                    {message.type === 'date' ? 'Time-based' : 'Event-based'}
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                  <FaEye className="w-4 h-4" />
                  <span>Preview</span>
                  <FaChevronRight className={`w-3 h-3 transition-transform duration-300 ${
                    selectedMessage?.id === message.id ? 'rotate-90' : ''
                  }`} />
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