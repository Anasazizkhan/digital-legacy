import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/userService';
import './VerifyEmail.css';

const spinner = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '1rem'}}>
    <circle cx="24" cy="24" r="20" stroke="#4F46E5" strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" from="0 24 24" to="360 24 24"/>
    </circle>
  </svg>
);

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying...');
  const [success, setSuccess] = useState(null); // null = loading, true = success, false = error
  const hasVerified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('No verification token found.');
      setSuccess(false);
      return;
    }
    if (hasVerified.current) return; // Prevent double call
    hasVerified.current = true;
    verifyEmail(token)
      .then(res => {
        setMessage(res.message || 'Email verified successfully!');
        setSuccess(true);
        window.history.replaceState({}, document.title, '/verify-email');
        setTimeout(() => navigate('/profile'), 3000);
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Verification failed.');
        setSuccess(false);
      });
    // eslint-disable-next-line
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', fontFamily: 'inherit',
      background: 'white', borderRadius: 12, boxShadow: '0 2px 16px #0001', maxWidth: 400, margin: '4rem auto', padding: '2.5rem 2rem'
    }}>
      {success === null && (
        <>
          {spinner}
          <h2 style={{color: '#4F46E5', marginBottom: 0}}>Verifying...</h2>
        </>
      )}
      {success === true && (
        <>
          <span style={{fontSize: 48, color: 'green', marginBottom: 12}}>✅</span>
          <h2 style={{color: 'green', marginBottom: 0}}>{message}</h2>
          <p style={{marginTop: 8, color: '#333'}}>Redirecting to your profile...</p>
        </>
      )}
      {success === false && (
        <>
          <span style={{fontSize: 48, color: '#e53e3e', marginBottom: 12}}>❌</span>
          <h2 style={{color: '#e53e3e', marginBottom: 0}}>{message}</h2>
        </>
      )}
    </div>
  );
};

export default VerifyEmail; 