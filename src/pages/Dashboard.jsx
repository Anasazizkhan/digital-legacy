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
      color: 'from-blue-500/20 to-purple-500/20',
      link: '/messages'
    },
    {
      label: 'Files Secured',
      value: '34',
      icon: <FaFileAlt className="w-4 h-4" />,
      color: 'from-green-500/20 to-emerald-500/20',
      link: '/vault'
    },
    {
      label: 'Trusted Contacts',
      value: '5',
      icon: <FaUserFriends className="w-4 h-4" />,
      color: 'from-yellow-500/20 to-orange-500/20',
      link: '/trusted-contacts'
    },
    {
      label: 'Scheduled Deliveries',
      value: '8',
      icon: <FaClock className="w-4 h-4" />,
      color: 'from-pink-500/20 to-rose-500/20',
      link: '/messages'
    }
  ];

  const quickActions = [
    {
      title: 'Create Message',
      description: 'Write a new time-capsule message for your loved ones',
      icon: <FaEnvelope className="w-6 h-6" />,
      link: '/create-message',
      color: 'from-blue-500/20 to-purple-500/20',
      image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Digital Vault',
      description: 'Secure your important files and documents',
      icon: <FaLock className="w-6 h-6" />,
      link: '/vault',
      color: 'from-green-500/20 to-emerald-500/20',
      image: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Trusted Contacts',
      description: 'Manage your network of trusted individuals',
      icon: <FaUserFriends className="w-6 h-6" />,
      link: '/trusted-contacts',
      color: 'from-yellow-500/20 to-orange-500/20',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const recentActivity = [
    {
      title: 'New Message Created',
      description: 'You created a new time-capsule message',
      icon: <FaEnvelope className="w-4 h-4" />,
      time: '2h ago',
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      title: 'Security Check Completed',
      description: 'Your account security was verified',
      icon: <FaShieldAlt className="w-4 h-4" />,
      time: '1d ago',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Reminder Set',
      description: 'Message delivery scheduled for next week',
      icon: <FaBell className="w-4 h-4" />,
      time: '2d ago',
      color: 'from-yellow-500/20 to-orange-500/20'
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
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="card card-hover text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`icon-container bg-gradient-to-br ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-400">{stat.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid-cards">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => navigate(action.link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card card-hover text-left w-full overflow-hidden"
            >
              <div className="relative h-40 -mx-6 -mt-6 mb-6 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90`} />
                <img
                  src={action.image}
                  alt={action.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="icon-container-lg bg-white/10 backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{action.title}</h3>
                </div>
              </div>
              <p className="text-gray-400">{action.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200">
                <span>Get Started</span>
                <FaArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="section-title">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`icon-container bg-gradient-to-br ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
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