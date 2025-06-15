import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaCalendarAlt, FaSync, FaCalendarDay, FaCalendarWeek, FaCalendarPlus, FaSignOutAlt, FaBell, FaBellSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Calendar.css';
import { auth } from '../firebase';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use refs to track sync state and prevent multiple simultaneous syncs
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef(null);
  const lastSyncParamsRef = useRef(null);

  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Helper function to check if dates and params have changed
  const hasParamsChanged = useCallback((newStartDate, newEndDate, newViewMode) => {
    const lastParams = lastSyncParamsRef.current;
    if (!lastParams) return true;
    
    return (
      lastParams.startDate.getTime() !== newStartDate.getTime() ||
      lastParams.endDate.getTime() !== newEndDate.getTime() ||
      lastParams.viewMode !== newViewMode
    );
  }, []);

  // Update date range when view mode changes
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let newStartDate, newEndDate;

    switch (viewMode) {
      case 'day':
        newStartDate = new Date(selectedDate);
        newStartDate.setHours(0, 0, 0, 0);
        newEndDate = new Date(selectedDate);
        newEndDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        newStartDate = weekStart;
        newEndDate = weekEnd;
        break;
      case 'month':
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        newStartDate = monthStart;
        newEndDate = monthEnd;
        break;
      default:
        // For custom view, don't auto-update dates
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [viewMode, selectedDate]);

  // Auto-sync when parameters change
  useEffect(() => {
    if (!isGoogleCalendarConnected || !currentUser || loading) {
      return;
    }

    // Check if parameters have actually changed
    if (!hasParamsChanged(startDate, endDate, viewMode)) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for sync
    syncTimeoutRef.current = setTimeout(() => {
      if (!isSyncingRef.current) {
        syncCalendar();
      }
    }, 300); // Reduced delay for better responsiveness

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [startDate, endDate, viewMode, isGoogleCalendarConnected, currentUser, loading, hasParamsChanged]);

  // Handle OAuth callback
  useEffect(() => {
    if (location.pathname === '/oauth-callback') {
      const params = new URLSearchParams(location.search);
      const tokens = params.get('tokens');
      const error = params.get('error');
      const message = params.get('message');

      if (error) {
        console.error('OAuth error:', error, message);
        setError(message || error);
        navigate('/calendar', { replace: true });
        return;
      }

      if (tokens) {
        try {
          const parsedTokens = JSON.parse(decodeURIComponent(tokens));
          localStorage.setItem('googleCalendarTokens', JSON.stringify(parsedTokens));
          setIsGoogleCalendarConnected(true);
          // Sync will be triggered by the useEffect above
          navigate('/calendar', { replace: true });
        } catch (error) {
          console.error('Error parsing tokens:', error);
          setError('Failed to process authentication tokens');
          navigate('/calendar', { replace: true });
        }
      } else {
        navigate('/calendar', { replace: true });
      }
    }
  }, [location, navigate]);

  const connectGoogleCalendar = async () => {
    if (!currentUser) {
      setError('Please log in to connect your calendar');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/calendar/auth-url`, {
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

  // Check if calendar is connected on component mount
  useEffect(() => {
    const tokens = localStorage.getItem('googleCalendarTokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        if (parsedTokens && parsedTokens.access_token) {
          setIsGoogleCalendarConnected(true);
          // Sync will be triggered by the auto-sync useEffect
        }
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
        localStorage.removeItem('googleCalendarTokens');
        setIsGoogleCalendarConnected(false);
      }
    }
  }, []);

  const syncCalendar = async () => {
    if (!currentUser || isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
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

      // Ensure we're using current date range
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      
      // Store current sync parameters
      lastSyncParamsRef.current = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        viewMode: viewMode
      };
      
      const response = await fetch(
        `${API_URL}/api/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=100`,
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
      console.log('Fetched events:', fetchedEvents);

      if (!Array.isArray(fetchedEvents)) {
        throw new Error('Received invalid events data from server');
      }

      // Filter out past events and validate events
      const validEvents = fetchedEvents.filter(event => {
        // Skip if we've already processed this event
        if (!event || !event.id) {
          console.warn('Invalid event:', event);
          return false;
        }

        console.log('Processing event:', {
          id: event.id,
          summary: event.summary,
          isTask: event.isTask,
          due: event.due,
          start: event.start
        });
        
        // Basic validation
        const isValid = event && 
                       (event.start?.dateTime || event.start?.date) && 
                       event.summary;
        
        if (!isValid) {
          console.warn('Invalid event structure:', event);
          return false;
        }

        // Get event dates
        const eventDate = getEventDate(event);
        const now = new Date();
        
        // Compare dates
        const shouldShow = compareDates(eventDate, now);
        
        console.log('Event visibility check:', {
          eventId: event.id,
          eventDate: eventDate.toLocaleString(),
          now: now.toLocaleString(),
          shouldShow,
          isTask: event.isTask,
          due: event.due,
          start: event.start
        });
        
        return shouldShow;
      });

      // Remove any duplicate events based on ID
      const uniqueEvents = validEvents.filter((event, index, self) =>
        index === self.findIndex((e) => e.id === event.id)
      );

      console.log('Filtered events:', uniqueEvents);
      setEvents(uniqueEvents);
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
      isSyncingRef.current = false;
    }
  };

  const formatEventTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Convert UTC to IST (UTC+5:30)
      const istHours = (date.getUTCHours() + 5) % 24;
      const istMinutes = date.getUTCMinutes() + 30;
      
      // Adjust hours if minutes exceed 60
      const finalHours = istMinutes >= 60 ? (istHours + 1) % 24 : istHours;
      const finalMinutes = istMinutes >= 60 ? istMinutes - 60 : istMinutes;
      
      const ampm = finalHours >= 12 ? 'PM' : 'AM';
      const displayHours = finalHours % 12 || 12;
      return `${displayHours}:${finalMinutes.toString().padStart(2, '0')} ${ampm} IST`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getEventDate = (event) => {
    try {
      if (!event?.start) {
        console.warn('Event missing start date:', event);
        return new Date();
      }
      
      // Handle different event formats
      let dateTime;
      if (event.isTask) {
        // For tasks, prefer due date, then start date
        dateTime = event.due || event.start.dateTime || event.start.date;
        
        // For tasks, if the time is midnight UTC, it means it's an all-day task
        if (dateTime.endsWith('T00:00:00.000Z')) {
          // Create a date object for the task's due date
          const taskDate = new Date(dateTime);
          
          // Convert to IST for logging
          const istHours = (taskDate.getUTCHours() + 5) % 24;
          const istMinutes = taskDate.getUTCMinutes() + 30;
          
          console.log('Task date handling:', {
            originalDateTime: dateTime,
            taskDate: taskDate.toISOString(),
            istTime: `${istHours}:${istMinutes} IST`,
            isAllDay: true,
            taskId: event.id
          });
          
          return taskDate;
        }
      } else {
        dateTime = event.start.dateTime || event.start.date;
      }
      
      if (!dateTime) {
        console.warn('No valid date found for event:', event);
        return new Date();
      }

      // Parse the date without any timezone conversion
      const date = new Date(dateTime);
      
      // Convert to IST for logging
      const istHours = (date.getUTCHours() + 5) % 24;
      const istMinutes = date.getUTCMinutes() + 30;
      
      console.log('Date handling:', {
        originalDateTime: dateTime,
        parsedDate: date.toISOString(),
        istTime: `${istHours}:${istMinutes} IST`,
        eventId: event.id
      });
      
      return date;
    } catch (error) {
      console.error('Error getting event date:', error);
      return new Date();
    }
  };

  // Helper function to compare dates
  const compareDates = (eventDate, now) => {
    // Compare dates first
    const eventDateStr = eventDate.toDateString();
    const nowDateStr = now.toDateString();
    
    if (eventDateStr !== nowDateStr) {
      // If dates are different, just compare the dates
      return eventDate > now;
    }
    
    // For same day, compare times using UTC
    const eventTime = eventDate.getUTCHours() * 60 + eventDate.getUTCMinutes();
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    // Convert to IST for logging
    const eventISTHours = (eventDate.getUTCHours() + 5) % 24;
    const eventISTMinutes = eventDate.getUTCMinutes() + 30;
    const nowISTHours = (now.getUTCHours() + 5) % 24;
    const nowISTMinutes = now.getUTCMinutes() + 30;
    
    console.log('Time comparison:', {
      eventTime,
      currentTime,
      eventTimeString: `${eventISTHours}:${eventISTMinutes} IST`,
      nowTimeString: `${nowISTHours}:${nowISTMinutes} IST`,
      eventDate: eventDate.toISOString(),
      nowDate: now.toISOString()
    });
    
    // For same day events, show if the event time is greater than or equal to current time
    return eventTime >= currentTime;
  };

  const getEventTimeDisplay = (event) => {
    try {
      if (!event?.start) return 'Time not specified';
      
      if (event.isTask) {
        // For tasks, show the due date in IST
        const dueDate = new Date(event.due || event.start.dateTime);
        // Convert UTC to IST (UTC+5:30)
        const istHours = (dueDate.getUTCHours() + 5) % 24;
        const istMinutes = dueDate.getUTCMinutes() + 30;
        
        // Adjust hours if minutes exceed 60
        const finalHours = istMinutes >= 60 ? (istHours + 1) % 24 : istHours;
        const finalMinutes = istMinutes >= 60 ? istMinutes - 60 : istMinutes;
        
        const ampm = finalHours >= 12 ? 'PM' : 'AM';
        const displayHours = finalHours % 12 || 12;
        return `${displayHours}:${finalMinutes.toString().padStart(2, '0')} ${ampm} IST`;
      }
      
      if (event.start.dateTime && event.end?.dateTime) {
        return `${formatEventTime(event.start.dateTime)} - ${formatEventTime(event.end.dateTime)}`;
      } else if (event.start.date) {
        return 'All day';
      }
      
      return 'Time not specified';
    } catch (error) {
      console.error('Error getting event time display:', error);
      return 'Time not specified';
    }
  };

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem('googleCalendarTokens');
    setIsGoogleCalendarConnected(false);
    setEvents([]);
    setError(null);
    lastSyncParamsRef.current = null;
  };

  // Memoize event filtering functions for better performance
  const getEventsForDate = useMemo(() => (date) => {
    return events.filter(event => {
      const eventDate = getEventDate(event);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);

  const getEventsForDateRange = useMemo(() => (start, end) => {
    return events.filter(event => {
      const eventDate = getEventDate(event);
      return eventDate >= start && eventDate <= end;
    });
  }, [events]);

  const handleNotificationSettings = async (eventId, settings) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_URL}/api/calendar/events/${eventId}/notifications`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify({
          notificationSettings: settings
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update notification settings');
      }

      // Update the event in the local state
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === eventId 
            ? { ...e, notificationSettings: settings }
            : e
        )
      );

      // Show confirmation message with email address
      setConfirmationMessage({
        type: 'success',
        message: settings.enabled 
          ? `Notifications enabled (${settings.reminderTime} before)\nNotifications will be sent to: ${currentUser.email}`
          : `Notifications disabled`
      });

      // Clear confirmation message after 5 seconds
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 5000);

      setNotificationModalOpen(false);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError(error.message);
    }
  };

  const NotificationSettingsModal = ({ event, onClose }) => {
    const [settings, setSettings] = useState(event.notificationSettings || {
      enabled: false,
      reminderTime: '15min'
    });

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Notification Settings</h2>
          <div className="notification-settings">
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                />
                Enable Notifications
              </label>
            </div>
            
            {settings.enabled && (
              <div className="setting-group">
                <label>Reminder Time</label>
                <select
                  value={settings.reminderTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                >
                  <option value="15min">15 minutes before</option>
                  <option value="30min">30 minutes before</option>
                  <option value="1hour">1 hour before</option>
                  <option value="1day">1 day before</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button onClick={() => handleNotificationSettings(event.id, settings)}>
              Save Settings
            </button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Memoize event card rendering for better performance
  const renderEventCard = useCallback((event) => {
    try {
      const eventDate = getEventDate(event);
      return (
        <div key={event.id || Math.random()} className={`event-card ${event.isTask ? 'task-card' : 'event-card-regular'}`}>
          <div className="event-date">
            <span className="day">{eventDate.getDate()}</span>
            <span className="month">
              {eventDate.toLocaleString('default', { month: 'short' })}
            </span>
          </div>
          <div className="event-details">
            <div className="event-header">
              <h3>{event.isTask ? event.title : (event.summary || 'Untitled Event')}</h3>
              <div className="event-actions">
                {event.isTask && (
                  <span className={`task-status ${event.completed ? 'completed' : 'pending'}`}>
                    {event.completed ? '✓ Completed' : '○ Pending'}
                  </span>
                )}
                <button
                  className="notification-btn"
                  onClick={() => {
                    setSelectedEvent(event);
                    setNotificationModalOpen(true);
                  }}
                  title={event.notificationSettings?.enabled ? 'Notification enabled' : 'Notification disabled'}
                >
                  {event.notificationSettings?.enabled ? <FaBell /> : <FaBellSlash />}
                </button>
              </div>
            </div>
            {event.description && <p>{event.description}</p>}
            <span className="event-time">
              {getEventTimeDisplay(event)}
            </span>
            {event.location && (
              <span className="event-location">
                📍 {event.location}
              </span>
            )}
            {event.calendarSummary && !event.isTask && (
              <span className="calendar-name">
                📅 {event.calendarSummary}
              </span>
            )}
            {event.isTask && (
              <span className="task-list-name">
                📋 {event.taskListName}
              </span>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering event:', error, event);
      return null;
    }
  }, []);

  // Navigation handlers
  const navigateDate = useCallback((direction, period) => {
    const newDate = new Date(selectedDate);
    
    switch (period) {
      case 'day':
        newDate.setDate(selectedDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(selectedDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + direction);
        break;
    }
    
    setSelectedDate(newDate);
  }, [selectedDate]);

  // Memoize day view rendering
  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="day-view">
        <div className="view-header">
          <div className="view-title">
            <h3>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
          </div>
          <div className="view-navigation">
            <button 
              className="nav-btn nav-btn-prev"
              onClick={() => navigateDate(-1, 'day')}
              aria-label="Previous day"
            >
              ← Previous
            </button>
            <button 
              className="nav-btn nav-btn-today"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </button>
            <button 
              className="nav-btn nav-btn-next"
              onClick={() => navigateDate(1, 'day')}
              aria-label="Next day"
            >
              Next →
            </button>
          </div>
        </div>
        <div className="view-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : dayEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <p>No events scheduled for this day</p>
            </div>
          ) : (
            <div className="events-grid">
              {dayEvents.map(event => renderEventCard(event))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Memoize week view rendering
  const renderWeekView = () => {
    const weekEvents = getEventsForDateRange(startDate, endDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayEvents = weekEvents.filter(event => {
        const eventDate = getEventDate(event);
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      days.push(
        <div key={i} className="week-day-column">
          <div className="week-day-header">
            <div className="week-day-name">
              {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="week-day-date">{currentDate.getDate()}</div>
          </div>
          <div className="week-day-events">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : dayEvents.length === 0 ? (
              <div className="no-events-week">
                <span>No events</span>
              </div>
            ) : (
              dayEvents.map(event => renderEventCard(event))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="week-view">
        <div className="view-header">
          <div className="view-title">
            <h3>
              {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
              {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
          <div className="view-navigation">
            <button 
              className="nav-btn nav-btn-prev"
              onClick={() => navigateDate(-1, 'week')}
              aria-label="Previous week"
            >
              ← Previous Week
            </button>
            <button 
              className="nav-btn nav-btn-today"
              onClick={() => setSelectedDate(new Date())}
            >
              This Week
            </button>
            <button 
              className="nav-btn nav-btn-next"
              onClick={() => navigateDate(1, 'week')}
              aria-label="Next week"
            >
              Next Week →
            </button>
          </div>
        </div>
        <div className="week-grid">
          {days}
        </div>
      </div>
    );
  };

  // Add this new component for the confirmation message
  const ConfirmationMessage = ({ message }) => {
    if (!message) return null;

    return (
      <div className={`confirmation-message ${message.type}`}>
        <div className="confirmation-icon">
          {message.type === 'success' ? '✓' : '⚠️'}
        </div>
        <div className="confirmation-content">
          {message.message.split('\n').map((line, index) => (
            <div key={index} className={index === 1 ? 'email-line' : ''}>
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleTestEmail = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setError('You must be logged in to test email notifications.');
        return;
      }
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(
        `${API_URL}/api/calendar/test-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      const data = await response.json();
      setConfirmationMessage({
        type: 'success',
        message: `Test email sent successfully to ${currentUser.email}`
      });

      setTimeout(() => {
        setConfirmationMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error sending test email:', error);
      setError(error.message);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-title">
          <h1>Calendar</h1>
          <div className="calendar-subtitle">
            Manage your schedule and stay organized
          </div>
        </div>
        
        <div className="calendar-controls">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
              aria-label="Day view"
            >
              <FaCalendarDay />
              <span>Day</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
              aria-label="Week view"
            >
              <FaCalendarWeek />
              <span>Week</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
              aria-label="Month view"
            >
              <FaCalendarAlt />
              <span>Month</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'custom' ? 'active' : ''}`}
              onClick={() => setViewMode('custom')}
              aria-label="Custom date range"
            >
              <FaCalendarPlus />
              <span>Custom</span>
            </button>
          </div>

          {viewMode === 'custom' && (
            <div className="date-range-picker">
              <div className="date-picker-group">
                <label htmlFor="start-date">Start Date</label>
                <DatePicker
                  id="start-date"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="date-picker-input"
                  placeholderText="Select start date"
                />
              </div>
              <div className="date-picker-group">
                <label htmlFor="end-date">End Date</label>
                <DatePicker
                  id="end-date"
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="date-picker-input"
                  placeholderText="Select end date"
                />
              </div>
            </div>
          )}

          <div className="calendar-actions">
            {!currentUser && (
              <div className="auth-warning">
                <span>Please log in to access calendar features</span>
              </div>
            )}
            
            {currentUser && !isGoogleCalendarConnected && (
              <button 
                className="connect-calendar-btn"
                onClick={connectGoogleCalendar}
                disabled={loading}
                aria-label="Connect Google Calendar"
              >
                <FaGoogle />
                <span>Connect Google Calendar</span>
              </button>
            )}
            
            {currentUser && isGoogleCalendarConnected && (
              <>
                <button 
                  className="sync-calendar-btn" 
                  onClick={syncCalendar}
                  disabled={loading}
                  aria-label={loading ? 'Syncing calendar...' : 'Sync calendar'}
                >
                  <FaSync className={loading ? 'spinning' : ''} />
                  <span>{loading ? 'Syncing...' : 'Sync Calendar'}</span>
                </button>
                <button 
                  className="disconnect-calendar-btn" 
                  onClick={disconnectGoogleCalendar}
                  aria-label="Disconnect Google Calendar"
                >
                  <FaSignOutAlt />
                  <span>Disconnect</span>
                </button>
              </>
            )}

            <button 
              className="test-email-btn"
              onClick={handleTestEmail}
              title="Test email notifications"
            >
              Test Email Notifications
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {confirmationMessage && (
        <ConfirmationMessage message={confirmationMessage} />
      )}

      <div className="calendar-content">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && (
          <div className="month-view">
            <div className="view-header">
              <div className="view-title">
                <h3>{selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}</h3>
              </div>
              <div className="view-navigation">
                <button 
                  className="nav-btn nav-btn-prev"
                  onClick={() => navigateDate(-1, 'month')}
                  aria-label="Previous month"
                >
                  ← Previous Month
                </button>
                <button 
                  className="nav-btn nav-btn-today"
                  onClick={() => setSelectedDate(new Date())}
                >
                  This Month
                </button>
                <button 
                  className="nav-btn nav-btn-next"
                  onClick={() => navigateDate(1, 'month')}
                  aria-label="Next month"
                >
                  Next Month →
                </button>
              </div>
            </div>
            <div className="view-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="no-events">
                  <div className="no-events-icon">📅</div>
                  <p>No events or tasks for this month</p>
                </div>
              ) : (
                <div className="events-grid">
                  {events.map(event => renderEventCard(event))}
                </div>
              )}
            </div>
          </div>
        )}
        {viewMode === 'custom' && (
          <div className="custom-view">
            <div className="view-header">
              <div className="view-title">
                <h3>
                  {startDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined
                  })} - {endDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h3>
              </div>
            </div>
            <div className="view-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="no-events">
                  <div className="no-events-icon">📅</div>
                  <p>No events or tasks for this period</p>
                </div>
              ) : (
                <div className="events-grid">
                  {events.map(event => renderEventCard(event))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {notificationModalOpen && selectedEvent && (
        <NotificationSettingsModal
          event={selectedEvent}
          onClose={() => {
            setNotificationModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;