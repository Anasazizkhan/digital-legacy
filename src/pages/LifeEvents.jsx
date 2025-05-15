import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaStar, FaGraduationCap, FaHeart, FaBriefcase, FaHome, 
  FaBaby, FaPlane, FaTrophy, FaPlus, FaEdit, FaTrash,
  FaCalendarAlt, FaEnvelope, FaClock
} from 'react-icons/fa';

const LifeEvents = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'College Graduation',
      type: 'education',
      date: '2024-06-15',
      description: 'Graduating with a Bachelor\'s degree in Computer Science',
      icon: <FaGraduationCap />,
      color: 'blue',
      messages: 2
    },
    {
      id: 2,
      title: 'Wedding Day',
      type: 'relationship',
      date: '2024-09-20',
      description: 'Getting married to Sarah',
      icon: <FaHeart />,
      color: 'pink',
      messages: 3
    },
    {
      id: 3,
      title: 'New Job',
      type: 'career',
      date: '2025-01-10',
      description: 'Starting position as Senior Developer at Tech Corp',
      icon: <FaBriefcase />,
      color: 'purple',
      messages: 1
    }
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventColor = (type) => {
    switch (type) {
      case 'education':
        return 'from-blue-500/20 to-indigo-500/20 border-blue-500/50 text-blue-400';
      case 'relationship':
        return 'from-pink-500/20 to-rose-500/20 border-pink-500/50 text-pink-400';
      case 'career':
        return 'from-purple-500/20 to-violet-500/20 border-purple-500/50 text-purple-400';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const eventTypes = [
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'relationship', label: 'Relationship', icon: <FaHeart /> },
    { id: 'career', label: 'Career', icon: <FaBriefcase /> },
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'family', label: 'Family', icon: <FaBaby /> },
    { id: 'travel', label: 'Travel', icon: <FaPlane /> },
    { id: 'achievement', label: 'Achievement', icon: <FaTrophy /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FaStar className="text-yellow-400" />
              Life Events
            </h1>
            <p className="text-gray-400">
              Track important milestones and schedule messages for life's special moments
            </p>
          </motion.div>
          
          <button
            onClick={() => setShowAddEvent(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Timeline View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-12 pl-8"
        >
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50"></div>
          
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative mb-8 last:mb-0`}
            >
              <div className="absolute -left-8 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20 border-2 border-black"></div>
              
              <div className={`group bg-black/30 p-6 rounded-xl border border-white/10 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm ml-4 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] ${
                selectedEvent?.id === event.id ? 'border-blue-500/50 bg-black/40' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`p-2 rounded-lg bg-gradient-to-br ${getEventColor(event.type)}`}>
                        {event.icon}
                      </span>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-4">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="w-3 h-3" />
                        {event.messages} message{event.messages !== 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  {event.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaClock className="w-3 h-3" />
                    <span>
                      {new Date(event.date) > new Date() 
                        ? `In ${Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))} days`
                        : 'Past event'}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                    <FaEnvelope className="w-4 h-4" />
                    <span>Create Message</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Event Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {eventTypes.map((type) => (
            <div
              key={type.id}
              className="bg-black/30 p-4 rounded-xl border border-white/10 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm hover:border-blue-500/50 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-lg bg-gradient-to-br ${getEventColor(type.id)}`}>
                  {type.icon}
                </span>
                <div>
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-sm text-gray-400">
                    {events.filter(e => e.type === type.id).length} events
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LifeEvents; 