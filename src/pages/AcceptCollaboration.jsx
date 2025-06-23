import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as vaultService from '../services/vaultService';
import './AcceptCollaboration.css';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';

const AcceptCollaboration = () => {
  const [status, setStatus] = useState('Verifying invitation...');
  const [error, setError] = useState('');
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processInvitation = async () => {
      // Don't do anything until auth state is confirmed
      if (authLoading) {
        return;
      }

      // User must be logged in to accept
      if (!currentUser) {
        setStatus('Authentication required.');
        setError('Please log in or create an account to accept this invitation.');
        // Optional: Redirect to login with a redirect-back path
        // navigate('/login', { state: { from: location } });
        return;
      }

      const token = new URLSearchParams(location.search).get('token');

      if (!token) {
        setStatus('Invalid Invitation');
        setError('No invitation token was found. This link may be broken or expired.');
        return;
      }

      try {
        await vaultService.acceptInviteByToken(token);
        setStatus('Invitation Accepted!');
        
        // Redirect to the vault page after a short delay
        setTimeout(() => {
          navigate('/vault');
        }, 2000);

      } catch (err) {
        setStatus('Invitation Failed');
        setError(err.response?.data?.message || 'There was an error processing your invitation. It may be invalid or expired.');
        console.error(err);
      }
    };

    processInvitation();
  }, [currentUser, authLoading, location, navigate]);

  return (
    <PageLayout>
      <Navbar />
      <div className="accept-collaboration-container">
        <div className="status-card">
          <h1>{status}</h1>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p>Please wait while we process your collaboration invitation.</p>
          )}
          {status === 'Invitation Accepted!' && <p>Redirecting you to your vaults...</p>}
        </div>
      </div>
    </PageLayout>
  );
};

export default AcceptCollaboration; 