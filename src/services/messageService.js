import api from './api';

// Upload media file using backend API (recommended approach)
export const uploadMedia = async (file, mediaType = 'audio') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType);

    console.log('Uploading file via backend API:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      mediaType: mediaType
    });

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Backend upload successful:', response.data);

    return response.data.data;
  } catch (error) {
    console.error('Error uploading media via backend:', error);
    
    // Fallback to base64 if backend fails
    console.warn('Backend upload failed, falling back to base64 storage');
    return await uploadMediaAsBase64(file);
  }
};

// Upload audio file specifically
export const uploadAudio = async (file) => {
  return uploadMedia(file, 'audio');
};

// Upload video file specifically
export const uploadVideo = async (file) => {
  return uploadMedia(file, 'video');
};

// Upload image file specifically
export const uploadImage = async (file) => {
  return uploadMedia(file, 'image');
};

// Alternative upload method using base64 (fallback)
export const uploadMediaAsBase64 = async (file, folder = 'messages') => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const timestamp = Date.now();
          const fileName = `${folder}/${timestamp}_${file.name}`;
          
          // For now, we'll store the base64 data in the message itself
          // In production, you might want to use a different storage solution
          const mediaData = {
            url: base64Data,
            fileName: fileName,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            isBase64: true
          };
          
          resolve(mediaData);
        } catch (error) {
          reject(new Error(`Failed to process file: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error in base64 upload:', error);
    throw new Error(`Failed to upload media file: ${error.message}`);
  }
};

// Delete media file
export const deleteMedia = async (fileName) => {
  try {
    const response = await api.delete(`/media/delete/${fileName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting media:', error);
    throw new Error(`Failed to delete media file: ${error.message}`);
  }
};

// Get media file info
export const getMediaInfo = async (fileName) => {
  try {
    const response = await api.get(`/media/info/${fileName}`);
    return response.data;
  } catch (error) {
    console.error('Error getting media info:', error);
    throw new Error(`Failed to get media info: ${error.message}`);
  }
};

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
  console.log('messageService.updateMessage called with:', { messageId, updateData });
  const response = await api.put(`/messages/${messageId}`, updateData);
  console.log('messageService.updateMessage response:', response.data);
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  console.log('messageService.deleteMessage called with:', { messageId });
  const response = await api.delete(`/messages/${messageId}`);
  console.log('messageService.deleteMessage response:', response.data);
  return response.data;
};

// Delete specific media from a message
export const deleteMessageMedia = async (messageId, mediaType, fileName) => {
  try {
    const response = await api.delete(`/messages/${messageId}/media/${mediaType}/${fileName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message media:', error);
    throw new Error(`Failed to delete message media: ${error.message}`);
  }
};

// Get messages by status
export const getMessagesByStatus = async (status) => {
  const response = await api.get(`/messages/status/${status}`);
  return response.data;
}; 