import { motion } from 'framer-motion';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const EncryptionSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Encryption Settings</h1>
          <p className="text-gray-400">
            Configure your encryption preferences and security settings
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FaKey className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold">Encryption Keys</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Manage your encryption keys and recovery phrases
            </p>
            <button className="btn-primary">Generate New Keys</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FaLock className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold">Encryption Algorithm</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Algorithm</span>
                <span>AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Key Size</span>
                <span>256 bits</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FaShieldAlt className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold">Security Options</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" defaultChecked />
                <span>Enable WebCrypto API</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" defaultChecked />
                <span>Auto-delete encryption keys after message delivery</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" defaultChecked />
                <span>Enable secure key backup</span>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EncryptionSettings; 