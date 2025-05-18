import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { saveUserToDatabase } from '../services/userService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Firebase services
  const auth = getAuth(app);
  const db = getFirestore(app);

  async function register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        email: userCredential.user.email,
        createdAt: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(user, data) {
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.displayName
      });

      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: data.displayName,
        email: user.email,
        phone: data.phoneNumber || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async function getUserData(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        setCurrentUser({ ...user, ...userData });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    register,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 