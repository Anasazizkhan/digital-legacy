import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaBell } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    notificationPreferences: {
      email: true,
      sms: false,
      inApp: true
    },
    twoFactorEnabled: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Handle profile update logic here
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSave}
            className="grid gap-6"
          >
            {/* Personal Information */}
            <div className="bg-black/50 p-6 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <FaUser className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.name}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="email"
                      defaultValue={profile.email}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                    <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={profile.phone}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-black/50 p-6 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <FaBell className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile.notificationPreferences.email}
                    className="form-checkbox"
                  />
                  <span>Email Notifications</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile.notificationPreferences.sms}
                    className="form-checkbox"
                  />
                  <span>SMS Notifications</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile.notificationPreferences.inApp}
                    className="form-checkbox"
                  />
                  <span>In-App Notifications</span>
                </label>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-black/50 p-6 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <FaShieldAlt className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={profile.twoFactorEnabled}
                    className="form-checkbox"
                  />
                  <span>Enable Two-Factor Authentication</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 