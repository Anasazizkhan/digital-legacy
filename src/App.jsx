import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMessage from './pages/CreateMessage';
import Messages from './pages/Messages';
import Vault from './pages/Vault';
import LifeEvents from './pages/LifeEvents';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Security from './pages/Security';
import EncryptionSettings from './pages/EncryptionSettings';
import TrustedContacts from './pages/TrustedContacts';
import TimeLocked from './pages/TimeLocked';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      delay: 100,
      easing: 'ease-out-cubic',
      mirror: true,
      anchorPlacement: 'top-bottom',
      disable: 'mobile'
    });

    // Refresh AOS when route changes
    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div className="page-wrapper">
      <ScrollToTop />
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-message" element={
            <ProtectedRoute>
              <CreateMessage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/vault" element={
            <ProtectedRoute>
              <Vault />
            </ProtectedRoute>
          } />
          <Route path="/life-events" element={
            <ProtectedRoute>
              <LifeEvents />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/security" element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          } />
          <Route path="/encryption-settings" element={
            <ProtectedRoute>
              <EncryptionSettings />
            </ProtectedRoute>
          } />
          <Route path="/trusted-contacts" element={
            <ProtectedRoute>
              <TrustedContacts />
            </ProtectedRoute>
          } />
          <Route path="/time-locked" element={
            <ProtectedRoute>
              <TimeLocked />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
