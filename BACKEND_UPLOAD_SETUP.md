# Backend Upload System Setup Guide

## Overview

This implementation uses Firebase Admin SDK on the backend to handle file uploads securely, avoiding CORS issues and providing better security.

## Architecture

```
Frontend (React) → Backend API (Node.js) → Firebase Storage (Admin SDK)
```

## Features

- ✅ **No CORS Issues**: Backend handles all Firebase interactions
- ✅ **Secure**: Files are uploaded through authenticated backend
- ✅ **Organized**: Files are stored in user-specific folders
- ✅ **Fallback**: Base64 storage if backend fails
- ✅ **File Management**: Upload, delete, and info endpoints
- ✅ **Type Safety**: Proper file type validation
- ✅ **Size Limits**: 50MB file size limit

## Backend Implementation

### 1. Media Upload Service (`src/services/mediaUploadService.js`)
- Handles file uploads to Firebase Storage
- Organizes files by user ID and media type
- Provides public URLs for file access
- Includes metadata tracking

### 2. Media Routes (`src/routes/mediaRoutes.js`)
- `/api/media/upload/audio` - Upload audio files
- `/api/media/upload/video` - Upload video files
- `/api/media/upload/image` - Upload image files
- `/api/media/upload` - Generic file upload
- `/api/media/delete/:fileName` - Delete files
- `/api/media/info/:fileName` - Get file information

### 3. File Organization
```
Firebase Storage Structure:
├── messages/
│   ├── audio/
│   │   └── {userId}/
│   │       └── {timestamp}_{filename}.wav
│   ├── video/
│   │   └── {userId}/
│   │       └── {timestamp}_{filename}.webm
│   └── images/
│       └── {userId}/
│           └── {timestamp}_{filename}.jpg
```

## Frontend Implementation

### 1. Updated Message Service (`src/services/messageService.js`)
- Uses backend API instead of direct Firebase Storage
- Includes fallback to base64 storage
- Provides specific upload methods for each media type

### 2. MediaUpload Component (`src/components/MediaUpload.jsx`)
- Records audio and video
- Uploads files via backend API
- Shows upload progress and errors
- Displays file information

## Setup Instructions

### 1. Backend Dependencies
```bash
cd legacy-backend/digital-legacy-backend
npm install multer
```

### 2. Firebase Admin SDK Configuration
Ensure your backend has proper Firebase Admin SDK configuration in `src/firebase.js`:

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    // Your service account credentials
  }),
  storageBucket: "digital-legacy-1d205.firebasestorage.app"
});
```

### 3. Environment Variables
Add to your `.env` file:
```env
# Firebase Admin SDK
FB_PROJECT_ID=digital-legacy-1d205
FB_CLIENT_EMAIL=your-service-account-email
FB_PRIVATE_KEY=your-private-key
```

### 4. Firebase Storage Rules
Deploy the storage rules:
```bash
firebase deploy --only storage
```

## API Endpoints

### Upload Audio
```http
POST /api/media/upload/audio
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- audio: [file]
```

### Upload Video
```http
POST /api/media/upload/video
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- video: [file]
```

### Upload Generic File
```http
POST /api/media/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: [file]
- mediaType: "audio" | "video" | "image"
```

### Delete File
```http
DELETE /api/media/delete/{fileName}
Authorization: Bearer {token}
```

### Get File Info
```http
GET /api/media/info/{fileName}
Authorization: Bearer {token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://storage.googleapis.com/bucket/path/file.wav",
    "fileName": "messages/audio/user123/1234567890_file.wav",
    "size": 2048576,
    "type": "audio/wav",
    "uploadedAt": "2024-01-15T08:30:00.000Z",
    "isBase64": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

### 1. Authentication
- All endpoints require valid JWT token
- User can only access their own files

### 2. File Validation
- File type validation (audio, video, image only)
- File size limits (50MB)
- User ownership verification

### 3. Storage Security
- Files organized by user ID
- Public read access for message sharing
- Private write access for file management

## Error Handling

### Frontend Fallback
If backend upload fails, the system automatically falls back to base64 storage:
1. File is converted to base64
2. Stored directly in Firestore
3. User sees "Base64 Storage" indicator

### Common Errors
- `File too large`: Exceeds 50MB limit
- `Invalid file type`: Not audio/video/image
- `Unauthorized`: Invalid or missing token
- `Upload failed`: Network or storage issues

## Testing

### 1. Test Audio Recording
1. Click "Start Recording"
2. Speak into microphone
3. Click "Stop"
4. Click "Upload Recording"

### 2. Test Video Recording
1. Click "Start Recording"
2. Allow camera access
3. Record video
4. Click "Stop"
5. Click "Upload Recording"

### 3. Test File Upload
1. Click "Upload Audio/Video"
2. Select file from device
3. Verify upload completes

### 4. Test File Display
1. Create message with media
2. View message in Messages page
3. Verify media plays correctly

## Troubleshooting

### Backend Issues
1. **Firebase Admin SDK Error**: Check service account credentials
2. **Storage Permission Error**: Verify storage rules
3. **File Upload Fails**: Check file size and type

### Frontend Issues
1. **Recording Not Working**: Check browser permissions
2. **Upload Fails**: Check network connection
3. **Media Not Playing**: Verify file URL accessibility

### Common Solutions
1. **Restart Backend**: `npm run dev`
2. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
3. **Check Console**: Look for error messages
4. **Verify Authentication**: Ensure user is logged in

## Performance Considerations

### File Size Limits
- Audio: Recommended < 10MB
- Video: Recommended < 50MB
- Images: Recommended < 5MB

### Storage Costs
- Monitor Firebase Storage usage
- Consider implementing file compression
- Set up usage alerts

### Caching
- Files are publicly accessible
- Browser caching improves performance
- CDN can be configured for better delivery

## Future Enhancements

1. **File Compression**: Automatic audio/video compression
2. **Thumbnail Generation**: Video thumbnails
3. **Transcription**: Audio-to-text conversion
4. **Format Conversion**: Automatic format optimization
5. **Batch Upload**: Multiple file uploads
6. **Progress Tracking**: Real-time upload progress 