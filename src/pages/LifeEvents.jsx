import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaGoogle, FaPlus } from 'react-icons/fa';

const LifeEvents = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Job Change',
      date: '2024-12-31',
      type: 'manual',
      description: 'When I leave my current job',
      messages: 2
    },
    {
      id: 2,
      title: 'Birthday Milestone',
      date: '2025-06-15',
      type: 'calendar',
      description: 'When I turn 30',
      messages: 1
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
          <h1 className="text-3xl font-bold mb-4">Life Events</h1>
          <p className="text-gray-400">
            Link your messages to important life events and milestones
          </p>
        </motion.div>

        <div className="grid gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add New Event</h2>
              <button className="btn-primary flex items-center space-x-2">
                <FaPlus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                <FaCalendarPlus className="w-6 h-6" />
                <span>Manual Event</span>
              </button>
              <button className="flex items-center justify-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                <FaGoogle className="w-6 h-6" />
                <span>Connect Google Calendar</span>
              </button>
            </div>
          </motion.div>

          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-black/50 p-6 rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-400 text-sm">{event.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Target Date</div>
                  <div>{event.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {event.type === 'calendar' ? (
                    <FaGoogle className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FaCalendarPlus className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-400">
                    {event.type === 'calendar' ? 'Google Calendar' : 'Manual Event'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {event.messages} message{event.messages !== 1 && 's'} attached
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LifeEvents; 