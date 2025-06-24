import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as vaultService from '../services/vaultService';
import './AcceptCollaboration.css';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const AcceptCollaboration = () => {
  const [status, setStatus] = useState('Verifying invitation...');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [invitationData, setInvitationData] = useState(null);
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
        setStatus('Authentication Required');
        setError('Please log in or create an account to accept this invitation.');
        // Redirect to login with return URL
        setTimeout(() => {
          navigate('/login', { state: { from: location.pathname + location.search } });
        }, 3000);
        return;
      }

      const token = new URLSearchParams(location.search).get('token');

      if (!token) {
        setStatus('Invalid Invitation');
        setError('No invitation token was found. This link may be broken or expired.');
        return;
      }

      // Validate token format (64 character hex string)
      if (!/^[a-f0-9]{64}$/.test(token)) {
        setStatus('Invalid Token Format');
        setError('The invitation token format is invalid. Please check your invitation link.');
        return;
      }

      // Show invitation details and action buttons
      setStatus('Collaboration Invitation');
      setInvitationData({ token });
      setShowActions(true);
    };

    processInvitation();
  }, [currentUser, authLoading, location, navigate]);

  const handleAccept = async () => {
    if (!invitationData?.token) return;

    setIsProcessing(true);
    setStatus('Processing invitation...');
    setError('');

    try {
      console.log('Processing collaboration invitation for user:', currentUser.email);
      console.log('Token:', invitationData.token);
      
      const response = await vaultService.acceptInviteByToken(invitationData.token);
      
      if (response.success) {
        setStatus('Invitation Accepted!');
        setError('');
        setShowActions(false);
        
        // Redirect to the vault page after a short delay
        setTimeout(() => {
          navigate('/vault');
        }, 2000);
      } else {
        setStatus('Invitation Failed');
        setError(response.message || 'Failed to accept invitation. Please try again.');
        setShowActions(true);
      }

    } catch (err) {
      console.error('Invitation processing error:', err);
      
      setStatus('Invitation Failed');
      setShowActions(true);
      
      // Handle specific error cases based on API documentation
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        switch (status) {
          case 404:
            setError('Collaboration request not found or invalid. The invitation may have expired or been already processed.');
            break;
          case 400:
            setError('Request already processed. This invitation has already been accepted or declined.');
            break;
          case 401:
            setError('Authentication failed. Please log in again and try accepting the invitation.');
            break;
          case 403:
            setError('Access denied. You may not have permission to accept this invitation.');
            break;
          case 500:
            setError('Server error. Please try again later or contact support.');
            break;
          default:
            setError(errorData?.message || 'There was an error processing your invitation. Please try again.');
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to server. Please check your connection and try again.');
      } else {
        setError(err.message || 'There was an error processing your invitation. It may be invalid or expired.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!invitationData?.token) return;

    setIsProcessing(true);
    setStatus('Processing rejection...');
    setError('');

    try {
      console.log('Rejecting collaboration invitation for user:', currentUser.email);
      console.log('Token:', invitationData.token);
      
      const response = await vaultService.rejectInviteByToken(invitationData.token);
      
      if (response.success) {
        setStatus('Invitation Rejected');
        setError('');
        setShowActions(false);
        
        // Redirect to the vault page after a short delay
        setTimeout(() => {
          navigate('/vault');
        }, 2000);
      } else {
        setStatus('Rejection Failed');
        setError(response.message || 'Failed to reject invitation. Please try again.');
        setShowActions(true);
      }

    } catch (err) {
      console.error('Invitation rejection error:', err);
      
      setStatus('Rejection Failed');
      setShowActions(true);
      
      // Handle specific error cases
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        switch (status) {
          case 404:
            setError('Collaboration request not found or invalid. The invitation may have expired.');
            break;
          case 400:
            setError('Request already processed. This invitation has already been accepted or declined.');
            break;
          case 401:
            setError('Authentication failed. Please log in again and try rejecting the invitation.');
            break;
          case 403:
            setError('Access denied. You may not have permission to reject this invitation.');
            break;
          case 500:
            setError('Server error. Please try again later or contact support.');
            break;
          default:
            setError(errorData?.message || 'There was an error processing your rejection. Please try again.');
        }
      } else if (err.request) {
        setError('Network error: Unable to connect to server. Please check your connection and try again.');
      } else {
        setError(err.message || 'There was an error processing your rejection. It may be invalid or expired.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout>
      <Navbar />
      <div className="accept-collaboration-container">
        <div className="status-card">
          <h1>{status}</h1>
          
          {error ? (
            <div className="error-section">
              <div className="error-message">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
              {status === 'Authentication Required' && (
                <p className="redirect-info">Redirecting to login page...</p>
              )}
            </div>
          ) : showActions ? (
            <div className="invitation-actions">
              <div className="invitation-info">
                <p>You have been invited to collaborate on a vault.</p>
                <p className="invitation-details">Please choose whether to accept or reject this invitation.</p>
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="accept-invitation-btn"
                >
                  <FaCheck />
                  Accept Invitation
                </button>
                
                <button 
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="reject-invitation-btn"
                >
                  <FaTimes />
                  Reject Invitation
                </button>
              </div>
            </div>
          ) : (
            <div className="processing-section">
              {isProcessing && (
                <div className="loading-spinner"></div>
              )}
              <p>Please wait while we process your collaboration invitation.</p>
            </div>
          )}
          
          {status === 'Invitation Accepted!' && (
            <div className="success-section">
              <p className="success-message">Your collaboration invitation has been successfully accepted!</p>
              <p className="redirect-info">Redirecting you to your vaults...</p>
            </div>
          )}
          
          {status === 'Invitation Rejected' && (
            <div className="rejection-section">
              <p className="rejection-message">Your collaboration invitation has been rejected.</p>
              <p className="redirect-info">Redirecting you to your vaults...</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AcceptCollaboration; 