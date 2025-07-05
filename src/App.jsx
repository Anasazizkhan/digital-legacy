import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMessage from './pages/CreateMessage';
import MessageTemplates from './pages/MessageTemplates';
import MessageTemplatesList from './pages/MessageTemplatesList';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Calendar from './components/Calendar';
import Vault from './pages/Vault';
import CreateVault from './pages/CreateVault';
import VaultDetail from './pages/VaultDetail';
import AcceptCollaboration from './pages/AcceptCollaboration';
import VerifyEmail from './pages/VerifyEmail';
import './App.css';

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  console.log('ProtectedRoute - currentUser:', currentUser, 'loading:', loading);
  
  // If still loading, show loading screen
  if (loading) {
    console.log('ProtectedRoute - still loading, showing loading screen');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        <div>Loading authentication...</div>
      </div>
    );
  }
  
  // If not loading and no user, redirect to login
  if (!currentUser) {
    console.log('ProtectedRoute - redirecting to login because no currentUser');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute - rendering children');
  return children;
}

// Public Route wrapper component (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Special route for OAuth callback - allows access even when not logged in
function OAuthRoute({ children }) {
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DatabaseProvider>
          <div className="app">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* OAuth Callback Route - Special handling */}
              <Route path="/oauth-callback" element={<OAuthRoute><Calendar /></OAuthRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/create-message" element={<ProtectedRoute><CreateMessage /></ProtectedRoute>} />
              <Route path="/message-templates" element={<ProtectedRoute><MessageTemplates /></ProtectedRoute>} />
              <Route path="/message-templates-list" element={<ProtectedRoute><MessageTemplatesList /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
              <Route path="/vault/create" element={<ProtectedRoute><CreateVault /></ProtectedRoute>} />
              <Route path="/vault/:vaultId" element={<ProtectedRoute><VaultDetail /></ProtectedRoute>} />
              <Route path="/accept-collaboration" element={<ProtectedRoute><AcceptCollaboration /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DatabaseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 