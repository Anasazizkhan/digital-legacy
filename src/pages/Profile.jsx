import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaBell, FaExclamationCircle, FaSignOutAlt, FaCheckCircle, FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BackButton from '../components/BackButton';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: currentUser?.photoURL || '',
    twoFactorEnabled: false,
    notificationPreferences: {
      email: true,
      sms: false,
      inApp: true
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(prevProfile => ({
            ...prevProfile,
            name: userData.name || currentUser.displayName || '',
            email: userData.email || currentUser.email || '',
            phone: userData.phone || '',
            photoURL: userData.photoURL || currentUser.photoURL || '',
            notificationPreferences: userData.notificationPreferences || prevProfile.notificationPreferences,
            twoFactorEnabled: userData.twoFactorEnabled || false
          }));
        } else {
          // If no profile exists, create one with auth data
          const newProfile = {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            phone: '',
            photoURL: currentUser.photoURL || '',
            notificationPreferences: {
              email: true,
              sms: false,
              inApp: true
            },
            twoFactorEnabled: false
          };
          
          await setDoc(doc(db, 'users', currentUser.uid), newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
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
        setSuccess('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      setError('Failed to log out. Please try again.');
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      setError('');
      
      // Here you would typically upload the file to Firebase Storage
      // and get the download URL. For now, we'll use a placeholder
      const photoURL = URL.createObjectURL(file);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        photoURL
      });

      setProfile(prev => ({
        ...prev,
        photoURL
      }));

      setSuccess('Profile picture updated successfully');
    } catch (err) {
      setError('Failed to update profile picture');
      console.error('Error updating profile picture:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <BackButton />
        <div className="profile-container">
          <div className="skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-text"></div>
            <div className="profile-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <BackButton />
      <div className="profile-container">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error"
          >
            <p className="flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-success"
          >
            <p className="flex items-center">
              <FaCheckCircle className="mr-2" />
              {success}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header"
        >
          <div className="profile-picture-container">
            <div className="profile-picture">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" />
              ) : (
                <div className="profile-picture-placeholder">
                  <FaUser />
                </div>
              )}
              <label className="profile-picture-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={saving}
                />
                <FaCamera />
              </label>
            </div>
          </div>
          <h1>Profile Settings</h1>
          <p>Manage your account settings and preferences</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSave}
          className="profile-grid"
        >
          {/* Personal Information */}
          <div className="profile-card">
            <div className="card-header">
              <FaUser />
              <h2>Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="flex items-center gap-4">
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="form-input"
                  />
                  <span className="status-badge status-verified">
                    Verified
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Security & Notifications */}
          <div className="profile-card">
            <div className="card-header">
              <FaShieldAlt />
              <h2>Security & Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label">Two-Factor Authentication</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Add an extra layer of security to your account
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="twoFactorEnabled"
                      checked={profile.twoFactorEnabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notification Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Email Notifications</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.email"
                        checked={profile.notificationPreferences.email}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">SMS Notifications</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.sms"
                        checked={profile.notificationPreferences.sms}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">In-App Notifications</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.inApp"
                        checked={profile.notificationPreferences.inApp}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.form>

        <div className="action-buttons">
          <button
            type="submit"
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="btn-logout"
          >
            <FaSignOutAlt className="mr-2 inline" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 