import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebase';

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  // Get messages for a user
  const getMessages = async (userId) => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  };

  // Create a new message
  const createMessage = async (messageData) => {
    try {
      const messagesRef = collection(db, 'messages');
      const docRef = await addDoc(messagesRef, {
        ...messageData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  };

  // Update a message
  const updateMessage = async (messageId, messageData) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        ...messageData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDocs(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userId, profileData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value = {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    getUserProfile,
    updateUserProfile
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseContext; 