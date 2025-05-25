import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaCalendarAlt, FaSync } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Handle OAuth callback
  useEffect(() => {
    if (location.pathname === '/oauth-callback') {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('OAuth error:', error);
        setError(error);
        navigate('/calendar', { replace: true });
        return;
      }

      if (code) {
        // Exchange the code for tokens
        exchangeCodeForTokens(code);
      } else {
        navigate('/calendar', { replace: true });
      }
    }
  }, [location, navigate]);

  const exchangeCodeForTokens = async (code) => {
    try {
      const response = await fetch('http://localhost:5000/api/calendar/oauth2callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to exchange code for tokens');
      }

      const { tokens } = await response.json();
      localStorage.setItem('googleCalendarTokens', JSON.stringify(tokens));
      setIsGoogleCalendarConnected(true);
      await syncCalendar();
      navigate('/calendar', { replace: true });
    } catch (error) {
      console.error('Error exchanging code:', error);
      setError(error.message);
      setIsGoogleCalendarConnected(false);
      localStorage.removeItem('googleCalendarTokens');
      navigate('/calendar', { replace: true });
    }
  };

  // Check if calendar is connected on component mount
  useEffect(() => {
    const tokens = localStorage.getItem('googleCalendarTokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        if (parsedTokens && parsedTokens.access_token) {
          setIsGoogleCalendarConnected(true);
          syncCalendar();
        }
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
        localStorage.removeItem('googleCalendarTokens');
        setIsGoogleCalendarConnected(false);
      }
    }
  }, []);

  const connectGoogleCalendar = async () => {
    if (!currentUser) {
      setError('Please log in to connect your calendar');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/calendar/auth-url', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get authorization URL');
      }
      
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setError(error.message);
      setIsGoogleCalendarConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const syncCalendar = async () => {
    if (!currentUser) {
      setError('Please log in to sync your calendar');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const storedTokens = localStorage.getItem('googleCalendarTokens');
      if (!storedTokens) {
        throw new Error('No calendar tokens found');
      }

      const tokens = JSON.parse(storedTokens);
      if (!tokens.access_token) {
        throw new Error('Invalid token data');
      }

      // Get events from the next 30 days
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await fetch(
        `http://localhost:5000/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=50`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch calendar events');
      }

      const fetchedEvents = await response.json();
      if (!Array.isArray(fetchedEvents)) {
        throw new Error('Received invalid events data from server');
      }

      setEvents(fetchedEvents);
      setError(null);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      setError(error.message);
      if (error.message.includes('auth') || error.message.includes('unauthorized') || error.message.includes('invalid')) {
        localStorage.removeItem('googleCalendarTokens');
        setIsGoogleCalendarConnected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatEventTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Upcoming Events</h2>
        {!isGoogleCalendarConnected ? (
          <button 
            className="connect-calendar-btn"
            onClick={connectGoogleCalendar}
            disabled={loading || !currentUser}
          >
            <FaGoogle className="icon" />
            Connect Google Calendar
          </button>
        ) : (
          <button 
            className="sync-calendar-btn"
            onClick={syncCalendar}
            disabled={loading || !currentUser}
          >
            <FaSync className={`icon ${loading ? 'spinning' : ''}`} />
            Sync Calendar
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!currentUser && (
        <div className="error-message">
          Please log in to access your calendar
        </div>
      )}

      <div className="calendar-content">
        {events.length === 0 ? (
          <div className="no-events">
            <FaCalendarAlt className="icon" />
            <p>No upcoming events</p>
            {!isGoogleCalendarConnected && currentUser && (
              <p className="connect-prompt">
                Connect your Google Calendar to see your events here
              </p>
            )}
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-date">
                  <span className="day">{new Date(event.start.dateTime || event.start.date).getDate()}</span>
                  <span className="month">
                    {new Date(event.start.dateTime || event.start.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="event-details">
                  <h3>{event.summary}</h3>
                  {event.description && <p>{event.description}</p>}
                  <span className="event-time">
                    {event.start.dateTime ? (
                      `${formatEventTime(event.start.dateTime)} - ${formatEventTime(event.end.dateTime)}`
                    ) : (
                      'All day'
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar; 