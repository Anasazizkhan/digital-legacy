import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMessage from './pages/CreateMessage';
import MessageTemplates from './pages/MessageTemplates';
import MessageTemplatesList from './pages/MessageTemplatesList';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import './App.css';

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DatabaseProvider>
          <div className="app">
            <nav className="nav">
              <div className="nav-brand">
                <Link to="/">Digital Legacy</Link>
              </div>
              <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/create-message">Create Message</Link>
                <Link to="/messages">Messages</Link>
                <Link to="/profile">Profile</Link>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-message" element={<ProtectedRoute><CreateMessage /></ProtectedRoute>} />
              <Route path="/message-templates" element={<ProtectedRoute><MessageTemplates /></ProtectedRoute>} />
              <Route path="/message-templates-list" element={<ProtectedRoute><MessageTemplatesList /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </div>
        </DatabaseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
