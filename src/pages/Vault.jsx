import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLock, FaKey, FaShieldAlt, FaFingerprint, FaUserShield, 
  FaFileAlt, FaImage, FaVideo, FaEnvelope, FaEye, FaDownload,
  FaFolder, FaEllipsisH, FaPlus
} from 'react-icons/fa';

const unlockedMessages = [
  {
    id: 1,
    sender: 'You',
    date: '2023-12-25',
    content: 'Merry Christmas to my future self! Remember the joy of this moment...',
    type: 'text',
  },
  {
    id: 2,
    sender: 'Mom',
    date: '2024-01-01',
    content: 'New Year memories collection',
    type: 'media',
    mediaCount: 5,
  },
];

const Vault = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [selectedFile, setSelectedFile] = useState(null);

  const vaultStats = [
    { 
      icon: <FaFileAlt />,
      label: 'Documents',
      count: 24,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400'
    },
    {
      icon: <FaImage />,
      label: 'Photos',
      count: 156,
      color: 'from-green-500/20 to-emerald-500/20 text-green-400'
    },
    {
      icon: <FaVideo />,
      label: 'Videos',
      count: 8,
      color: 'from-purple-500/20 to-violet-500/20 text-purple-400'
    },
    {
      icon: <FaEnvelope />,
      label: 'Messages',
      count: 12,
      color: 'from-pink-500/20 to-rose-500/20 text-pink-400'
    }
  ];

  const securityFeatures = [
    {
      icon: <FaFingerprint className="w-6 h-6" />,
      title: 'Biometric Authentication',
      description: 'Secure access with fingerprint and face recognition'
    },
    {
      icon: <FaKey className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'Military-grade encryption for all your stored data'
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: 'Access Control',
      description: 'Granular permissions and trusted contacts management'
    }
  ];

  const recentFiles = [
    {
      id: 1,
      name: 'Last Will.pdf',
      type: 'document',
      size: '2.4 MB',
      lastModified: '2024-02-15',
      icon: <FaFileAlt />
    },
    {
      id: 2,
      name: 'Family Photos 2023',
      type: 'folder',
      items: 45,
      lastModified: '2024-02-10',
      icon: <FaFolder />
    },
    {
      id: 3,
      name: 'Insurance Policies',
      type: 'folder',
      items: 8,
      lastModified: '2024-02-01',
      icon: <FaFolder />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-black py-20 mb-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                <FaLock className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure Digital Vault</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your encrypted sanctuary for confidential files, memories, and digital legacy
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20">
                <FaPlus className="w-4 h-4" />
                <span>Add Files</span>
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm">
                <FaShieldAlt className="w-4 h-4" />
                <span>Security Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {vaultStats.map((stat, index) => (
              <div
                key={index}
                className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
              >
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.count}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Recent Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/30 rounded-xl border border-white/10 backdrop-blur-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Files</h2>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            <div className="grid gap-4">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-blue-400 group-hover:text-blue-300 transition-colors">
                      {file.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{file.name}</h3>
                      <p className="text-sm text-gray-400">
                        {file.type === 'folder' 
                          ? `${file.items} items` 
                          : file.size} · Modified {new Date(file.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <FaDownload className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <FaEllipsisH className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Vault; 