import api from './api';

export const saveUserToDatabase = async (user) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/auth/google', userData);
    return response.data;
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/users/send-verification-email', { email });
    return response.data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/users/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
}; 