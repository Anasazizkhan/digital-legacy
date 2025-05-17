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
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar';
import './Dashboard.css';

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
  const { currentUser } = useAuth();

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
      description: 'Schedule a new message for the future',
      icon: '📝',
      link: '/message-templates'
    },
    {
      title: 'View Messages',
      description: 'Check your scheduled messages',
      icon: '📬',
      link: '/messages'
    },
    {
      title: 'Profile Settings',
      description: 'Update your account information',
      icon: '⚙️',
      link: '/profile'
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
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {currentUser?.displayName || 'User'}</h1>
          <p>Manage your digital legacy messages and settings</p>
        </div>

        <div className="dashboard-grid">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <Link to={action.link} key={index} className="action-card">
                  <span className="action-icon">{action.icon}</span>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="calendar-section">
            <Calendar />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard; 