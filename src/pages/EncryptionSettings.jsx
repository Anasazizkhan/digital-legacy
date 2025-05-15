import { motion } from 'framer-motion';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';

const EncryptionSettings = () => {
  const securityOptions = [
    {
      icon: <FaKey className="w-6 h-6" />,
      title: 'Encryption Keys',
      description: 'Manage your encryption keys and recovery phrases',
      content: (
        <button className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors duration-200">
          Generate New Keys
        </button>
      )
    },
    {
      icon: <FaLock className="w-6 h-6" />,
      title: 'Encryption Algorithm',
      description: 'View your current encryption settings',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Current Algorithm</span>
            <span className="text-white">AES-256-GCM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Key Size</span>
            <span className="text-white">256 bits</span>
          </div>
        </div>
      )
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Security Options',
      description: 'Configure additional security settings',
      content: (
        <div className="space-y-4">
          <label className="flex items-center space-x-3 group cursor-pointer">
            <input 
              type="checkbox" 
              defaultChecked 
              className="form-checkbox h-5 w-5 rounded border-white/10 bg-white/5 checked:bg-white checked:border-white focus:ring-white/20 transition-colors duration-200"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
              Enable WebCrypto API
            </span>
          </label>
          <label className="flex items-center space-x-3 group cursor-pointer">
            <input 
              type="checkbox" 
              defaultChecked 
              className="form-checkbox h-5 w-5 rounded border-white/10 bg-white/5 checked:bg-white checked:border-white focus:ring-white/20 transition-colors duration-200"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
              Auto-delete encryption keys after message delivery
            </span>
          </label>
          <label className="flex items-center space-x-3 group cursor-pointer">
            <input 
              type="checkbox" 
              defaultChecked 
              className="form-checkbox h-5 w-5 rounded border-white/10 bg-white/5 checked:bg-white checked:border-white focus:ring-white/20 transition-colors duration-200"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
              Enable secure key backup
            </span>
          </label>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title="Encryption Settings"
      description="Configure your encryption preferences and security settings"
      icon={FaShieldAlt}
      backgroundImage="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {securityOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 rounded-lg hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-white/5 text-white">
                  {option.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">{option.title}</h2>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              </div>
              <div className="mt-6">
                {option.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default EncryptionSettings; 