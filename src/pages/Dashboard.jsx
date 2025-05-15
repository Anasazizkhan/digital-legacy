import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLock, 
  FaUnlock, 
  FaClock, 
  FaSearch, 
  FaFilter, 
  FaPlus,
  FaEnvelope,
  FaUserFriends,
  FaFileAlt,
  FaShieldAlt,
  FaBell,
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const messages = [
  {
    id: 1,
    type: 'text',
    recipient: 'Self',
    unlockDate: '2025-01-01',
    status: 'locked',
    preview: 'A message to my future self...',
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    type: 'media',
    recipient: 'john@example.com',
    unlockDate: '2024-12-25',
    status: 'pending',
    preview: 'Christmas memories collection',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    type: 'text',
    recipient: 'Self',
    unlockDate: 'When I graduate',
    status: 'unlocked',
    preview: 'Congratulations on graduating!',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
  },
];

const statusIcons = {
  locked: <FaLock className="w-5 h-5 text-red-500" />,
  pending: <FaClock className="w-5 h-5 text-yellow-500" />,
  unlocked: <FaUnlock className="w-5 h-5 text-green-500" />,
};

const statusColors = {
  locked: 'bg-red-500/10 text-red-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  unlocked: 'bg-green-500/10 text-green-500',
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Messages Created',
      value: '12',
      icon: <FaEnvelope className="w-4 h-4" />,
      color: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      link: '/messages'
    },
    {
      label: 'Files Secured',
      value: '34',
      icon: <FaFileAlt className="w-4 h-4" />,
      color: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      link: '/vault'
    },
    {
      label: 'Trusted Contacts',
      value: '5',
      icon: <FaUserFriends className="w-4 h-4" />,
      color: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      link: '/trusted-contacts'
    },
    {
      label: 'Scheduled Deliveries',
      value: '8',
      icon: <FaClock className="w-4 h-4" />,
      color: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      link: '/messages'
    }
  ];

  const quickActions = [
    {
      title: 'Create Message',
      description: 'Write a new time-capsule message for your loved ones',
      icon: <FaEnvelope className="w-6 h-6" />,
      link: '/create-message',
      color: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Digital Vault',
      description: 'Secure your important files and documents',
      icon: <FaLock className="w-6 h-6" />,
      link: '/vault',
      color: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Trusted Contacts',
      description: 'Manage your network of trusted individuals',
      icon: <FaUserFriends className="w-6 h-6" />,
      link: '/trusted-contacts',
      color: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/20'
    }
  ];

  const recentActivity = [
    {
      title: 'New Message Created',
      description: 'You created a new time-capsule message',
      icon: <FaEnvelope className="w-4 h-4" />,
      time: '2h ago',
      color: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      title: 'Security Check Completed',
      description: 'Your account security was verified',
      icon: <FaShieldAlt className="w-4 h-4" />,
      time: '1d ago',
      color: 'bg-emerald-500/10',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Reminder Set',
      description: 'Message delivery scheduled for next week',
      icon: <FaBell className="w-4 h-4" />,
      time: '2d ago',
      color: 'bg-amber-500/10',
      textColor: 'text-amber-400'
    }
  ];

  return (
    <PageLayout
      title="Dashboard"
      description="Manage your digital legacy and monitor your secure content"
      icon={FaChartLine}
      backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.button
            key={stat.label}
            onClick={() => navigate(stat.link)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-gray-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-lg hover:border-white/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} ${stat.textColor}`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => navigate(action.link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className={`bg-gray-900/50 backdrop-blur-sm border ${action.borderColor} p-6 rounded-lg text-left hover:border-white/10 transition-all duration-200`}
            >
              <div className={`p-4 rounded-lg ${action.color} ${action.textColor} mb-4 inline-block`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{action.description}</p>
              <div className={`flex items-center text-sm ${action.textColor} opacity-75 hover:opacity-100 transition-opacity duration-200`}>
                <span>Get Started</span>
                <FaArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-gray-900/50 backdrop-blur-sm border border-white/5 p-4 rounded-lg flex items-center gap-4 hover:border-white/10 transition-all duration-200"
            >
              <div className={`p-3 rounded-lg ${activity.color} ${activity.textColor}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Dashboard; 