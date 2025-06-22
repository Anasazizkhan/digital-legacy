import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Backend API URL from environment variable
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

// TODO: Replace with your Firebase project configuration
// Get these values from your Firebase Console:
// 1. Go to console.firebase.google.com
// 2. Select your project
// 3. Click on the gear icon (Project settings)
// 4. Scroll to "Your apps" section
// 5. Copy the configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDOhtTiGyjvl2QFsBc9A5a24qnY5x-QhgU",
    authDomain: "digital-legacy-1d205.firebaseapp.com",
    projectId: "digital-legacy-1d205",
    storageBucket: "digital-legacy-1d205.firebasestorage.app",
    messagingSenderId: "418295955130",
    appId: "1:418295955130:web:b511726de4188efb35cc83",
    measurementId: "G-8LDGRFLMRZ"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Firebase persistence not supported in this browser');
    }
});

export { app, auth, db, storage, BACKEND_API_URL }; 