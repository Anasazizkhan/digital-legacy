import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaBell } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    notificationPreferences: {
      email: true,
      sms: false,
      inApp: true
    },
    twoFactorEnabled: false
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setProfile(prevProfile => ({
              ...prevProfile,
              name: userData.name || currentUser.displayName || '',
              email: userData.email || currentUser.email || '',
              phone: userData.phone || '',
              notificationPreferences: userData.notificationPreferences || prevProfile.notificationPreferences,
              twoFactorEnabled: userData.twoFactorEnabled || false
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          name: profile.name,
          phone: profile.phone,
          notificationPreferences: profile.notificationPreferences,
          twoFactorEnabled: profile.twoFactorEnabled,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.startsWith('notifications.')) {
        const notificationType = name.split('.')[1];
        setProfile(prev => ({
          ...prev,
          notificationPreferences: {
            ...prev.notificationPreferences,
            [notificationType]: checked
          }
        }));
      } else if (name === 'twoFactorEnabled') {
        setProfile(prev => ({
          ...prev,
          twoFactorEnabled: checked
        }));
      }
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-2/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-40 bg-white/5 rounded-lg"></div>
              <div className="h-40 bg-white/5 rounded-lg"></div>
              <div className="h-40 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
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
                      name="email"
                      value={profile.email}
                      disabled
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
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
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
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
                    name="notifications.email"
                    checked={profile.notificationPreferences.email}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span>Email Notifications</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="notifications.sms"
                    checked={profile.notificationPreferences.sms}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span>SMS Notifications</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="notifications.inApp"
                    checked={profile.notificationPreferences.inApp}
                    onChange={handleInputChange}
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
                    name="twoFactorEnabled"
                    checked={profile.twoFactorEnabled}
                    onChange={handleInputChange}
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
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
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