# Firebase Storage CORS Configuration

## Issue
You're experiencing CORS errors when trying to upload audio/video files to Firebase Storage. This is a common issue that requires configuring CORS settings for your Firebase Storage bucket.

## Solution

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Set CORS configuration**:
   ```bash
   gsutil cors set firebase-storage-cors.json gs://digital-legacy-1d205.firebasestorage.app
   ```

### Option 2: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project: `digital-legacy-1d205`
3. Navigate to **Cloud Storage** > **Browser**
4. Select your storage bucket: `digital-legacy-1d205.firebasestorage.app`
5. Go to **Settings** tab
6. Scroll down to **CORS configuration**
7. Click **Edit** and paste the configuration from `firebase-storage-cors.json`
8. Click **Save**

### Option 3: Using gsutil directly

1. **Install Google Cloud SDK** (if not already installed)
2. **Authenticate**:
   ```bash
   gcloud auth login
   ```
3. **Set CORS**:
   ```bash
   gsutil cors set firebase-storage-cors.json gs://digital-legacy-1d205.firebasestorage.app
   ```

## Alternative Solution (Already Implemented)

If you can't configure CORS immediately, the application now includes a fallback mechanism:

1. **Base64 Storage**: Files are stored as base64 strings in Firestore
2. **Automatic Fallback**: When Firebase Storage fails, it automatically uses base64 storage
3. **User Notification**: Users see a "Base64 Storage" indicator when this fallback is used

## Testing

After configuring CORS:

1. Restart your development server
2. Try uploading an audio or video file
3. Check the browser console for successful upload messages
4. Verify files are stored in Firebase Storage (not base64)

## Production Considerations

For production deployment:

1. Update the CORS configuration to include your production domain
2. Consider implementing file size limits
3. Set up proper Firebase Storage security rules
4. Monitor storage usage and costs

## Security Rules

Make sure your Firebase Storage security rules allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /messages/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

If you still experience issues:

1. **Check Firebase Console**: Verify the CORS configuration is applied
2. **Clear Browser Cache**: Hard refresh the page (Ctrl+F5)
3. **Check Network Tab**: Look for CORS preflight requests
4. **Verify Authentication**: Ensure user is properly authenticated
5. **Check File Size**: Large files might timeout

## Support

If you continue to have issues:
1. Check Firebase documentation on CORS
2. Verify your Firebase project settings
3. Ensure your storage bucket name is correct
4. Check that you have proper permissions 