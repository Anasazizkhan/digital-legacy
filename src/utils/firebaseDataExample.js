// Example of how media data is stored in Firebase Firestore
// This file shows the exact data structure for reference

export const sampleMessageWithMedia = {
  // Basic message fields
  id: "message_123",
  userId: "user_456",
  title: "My Audio Video Message",
  content: "This is a message with audio and video attachments",
  recipientEmail: "recipient@example.com",
  scheduledFor: "2024-12-25T10:00:00.000Z",
  status: "scheduled",
  type: "mixed",
  messageType: "mixed", // text, audio, video, image, mixed
  createdAt: "2024-01-15T08:30:00.000Z",
  updatedAt: "2024-01-15T08:30:00.000Z",
  
  // Media attachments structure
  media: {
    // Audio attachment
    audio: {
      url: "https://firebasestorage.googleapis.com/v0/b/digital-legacy-1d205.appspot.com/o/messages%2F1705312200000_audio-message.wav?alt=media&token=abc123",
      fileName: "messages/1705312200000_audio-message.wav",
      size: 2048576, // 2MB in bytes
      type: "audio/wav",
      uploadedAt: "2024-01-15T08:30:00.000Z"
    },
    
    // Video attachment
    video: {
      url: "https://firebasestorage.googleapis.com/v0/b/digital-legacy-1d205.appspot.com/o/messages%2F1705312200000_video-message.webm?alt=media&token=def456",
      fileName: "messages/1705312200000_video-message.webm",
      size: 15728640, // 15MB in bytes
      type: "video/webm",
      uploadedAt: "2024-01-15T08:30:00.000Z"
    },
    
    // Images array (for future use)
    images: []
  }
};

export const sampleAudioMessage = {
  id: "message_124",
  userId: "user_456",
  title: "Voice Message",
  content: "Just wanted to leave you a voice message",
  recipientEmail: "recipient@example.com",
  scheduledFor: "2024-12-25T10:00:00.000Z",
  status: "scheduled",
  type: "audio",
  messageType: "audio",
  createdAt: "2024-01-15T08:30:00.000Z",
  updatedAt: "2024-01-15T08:30:00.000Z",
  
  media: {
    audio: {
      url: "https://firebasestorage.googleapis.com/v0/b/digital-legacy-1d205.appspot.com/o/messages%2F1705312200000_voice-message.wav?alt=media&token=ghi789",
      fileName: "messages/1705312200000_voice-message.wav",
      size: 1048576, // 1MB
      type: "audio/wav",
      uploadedAt: "2024-01-15T08:30:00.000Z"
    },
    video: null,
    images: []
  }
};

export const sampleVideoMessage = {
  id: "message_125",
  userId: "user_456",
  title: "Video Message",
  content: "Here's a video message for you",
  recipientEmail: "recipient@example.com",
  scheduledFor: "2024-12-25T10:00:00.000Z",
  status: "scheduled",
  type: "video",
  messageType: "video",
  createdAt: "2024-01-15T08:30:00.000Z",
  updatedAt: "2024-01-15T08:30:00.000Z",
  
  media: {
    audio: null,
    video: {
      url: "https://firebasestorage.googleapis.com/v0/b/digital-legacy-1d205.appspot.com/o/messages%2F1705312200000_video-message.mp4?alt=media&token=jkl012",
      fileName: "messages/1705312200000_video-message.mp4",
      size: 20971520, // 20MB
      type: "video/mp4",
      uploadedAt: "2024-01-15T08:30:00.000Z"
    },
    images: []
  }
};

export const sampleTextMessage = {
  id: "message_126",
  userId: "user_456",
  title: "Text Only Message",
  content: "This is a text-only message without any media attachments",
  recipientEmail: "recipient@example.com",
  scheduledFor: "2024-12-25T10:00:00.000Z",
  status: "scheduled",
  type: "text",
  messageType: "text",
  createdAt: "2024-01-15T08:30:00.000Z",
  updatedAt: "2024-01-15T08:30:00.000Z",
  
  media: {
    audio: null,
    video: null,
    images: []
  }
};

// Firebase Storage structure
export const firebaseStorageStructure = {
  // Root bucket: digital-legacy-1d205.appspot.com
  messages: {
    // Audio files
    "1705312200000_audio-message.wav": {
      contentType: "audio/wav",
      size: 2048576,
      uploadedAt: "2024-01-15T08:30:00.000Z",
      metadata: {
        customMetadata: {
          userId: "user_456",
          messageId: "message_123",
          mediaType: "audio"
        }
      }
    },
    
    // Video files
    "1705312200000_video-message.webm": {
      contentType: "video/webm",
      size: 15728640,
      uploadedAt: "2024-01-15T08:30:00.000Z",
      metadata: {
        customMetadata: {
          userId: "user_456",
          messageId: "message_123",
          mediaType: "video"
        }
      }
    }
  }
};

// Firestore Collections structure
export const firestoreCollections = {
  messages: {
    // Document ID: message_123
    message_123: {
      // All the fields from sampleMessageWithMedia
    },
    message_124: {
      // All the fields from sampleAudioMessage
    },
    message_125: {
      // All the fields from sampleVideoMessage
    },
    message_126: {
      // All the fields from sampleTextMessage
    }
  },
  
  users: {
    user_456: {
      email: "user@example.com",
      displayName: "John Doe",
      createdAt: "2024-01-01T00:00:00.000Z",
      // Other user fields
    }
  }
};

// Security Rules validation
export const securityRulesValidation = {
  // Messages collection rules
  messages: {
    read: "User can read messages where they are sender, recipient, or owner",
    create: "User can create messages with their own userId/senderId",
    update: "User can update their own messages",
    delete: "User can delete their own messages",
    mediaValidation: "Media structure must be valid with required fields"
  }
};

export default {
  sampleMessageWithMedia,
  sampleAudioMessage,
  sampleVideoMessage,
  sampleTextMessage,
  firebaseStorageStructure,
  firestoreCollections,
  securityRulesValidation
}; 