import api from '../config/api';

// Create a new message
export const createMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

// Get a single message
export const getMessage = async (messageId) => {
  const response = await api.get(`/messages/${messageId}`);
  return response.data;
};

// Get all messages for a user
export const getUserMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

// Update a message
export const updateMessage = async (messageId, updateData) => {
  const response = await api.put(`/messages/${messageId}`, updateData);
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

// Get messages by status
export const getMessagesByStatus = async (status) => {
  const response = await api.get(`/messages/status/${status}`);
  return response.data;
}; 