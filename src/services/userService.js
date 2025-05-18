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