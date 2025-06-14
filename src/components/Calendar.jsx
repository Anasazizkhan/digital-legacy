import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaCalendarAlt, FaSync, FaCalendarDay, FaCalendarWeek, FaCalendarPlus, FaSignOutAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Auto-sync when view mode or date range changes
  useEffect(() => {
    if (isGoogleCalendarConnected && !isAutoSyncing) {
      setIsAutoSyncing(true);
      syncCalendar().finally(() => setIsAutoSyncing(false));
    }
  }, [viewMode, startDate, endDate]);

  // Update date range when view mode changes
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (viewMode) {
      case 'day':
        setStartDate(now);
        setEndDate(now);
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setStartDate(weekStart);
        setEndDate(weekEnd);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(monthStart);
        setEndDate(monthEnd);
        break;
      default:
        break;
    }
  }, [viewMode]);

  // Auto-sync when date range changes
  useEffect(() => {
    if (isGoogleCalendarConnected && !isAutoSyncing) {
      syncCalendar();
    }
  }, [startDate, endDate, viewMode]);

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
          syncCalendar();
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
          syncCalendar();
        }
      } catch (error) {
        console.error('Error parsing stored tokens:', error);
        localStorage.removeItem('googleCalendarTokens');
        setIsGoogleCalendarConnected(false);
      }
    }
  }, []);

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

      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      
      const response = await fetch(
        `${API_URL}/api/calendar/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100`,
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

      const validEvents = fetchedEvents.filter(event => {
        const isValid = event && 
                       (event.start?.dateTime || event.start?.date) && 
                       event.summary;
        if (!isValid) {
          console.warn('Invalid event structure:', event);
        }
        return isValid;
      });

      setEvents(validEvents);
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
    if (!dateString) return '';
    try {
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return new Date(dateString).toLocaleTimeString(undefined, options);
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getEventDate = (event) => {
    try {
      if (!event?.start) return new Date();
      
      // Handle different event formats
      const dateTime = event.start.dateTime || event.start.date;
      if (!dateTime) return new Date();
      
      return new Date(dateTime);
    } catch (error) {
      console.error('Error getting event date:', error);
      return new Date();
    }
  };

  const getEventTimeDisplay = (event) => {
    try {
      if (!event?.start) return 'Time not specified';
      
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
              <h3>{event.summary || 'Untitled Event'}</h3>
              {event.isTask && (
                <span className={`task-status ${event.completed ? 'completed' : 'pending'}`}>
                  {event.completed ? '✓ Completed' : '○ Pending'}
                </span>
              )}
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

  // Memoize day view rendering
  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="day-view">
        <div className="day-header">
          <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="day-events">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : dayEvents.length === 0 ? (
            <div className="no-events">
              <p>No events or tasks for this day</p>
            </div>
          ) : (
            dayEvents.map(event => renderEventCard(event))
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
        const eventDate = new Date(event.start?.dateTime || event.start?.date || event.due);
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      days.push(
        <div key={i} className="week-day-events">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : dayEvents.length === 0 ? (
            <div className="no-events">
              <p>No events</p>
            </div>
          ) : (
            dayEvents.map(event => renderEventCard(event))
          )}
        </div>
      );
    }

    return (
      <div className="week-view">
        <div className="week-header">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return (
              <div key={i} className="week-day-header">
                <div className="week-day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="week-day-date">{date.getDate()}</div>
              </div>
            );
          })}
        </div>
        <div className="week-events">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="calendar-controls">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              <FaCalendarDay /> Day
            </button>
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              <FaCalendarWeek /> Week
            </button>
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              <FaCalendarAlt /> Month
            </button>
            <button
              className={`view-btn ${viewMode === 'custom' ? 'active' : ''}`}
              onClick={() => setViewMode('custom')}
            >
              <FaCalendarPlus /> Custom
            </button>
          </div>

          {viewMode === 'custom' && (
            <div className="date-range-picker">
              <div className="date-picker-group">
                <label>Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="date-picker-input"
                />
              </div>
              <div className="date-picker-group">
                <label>End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="date-picker-input"
                />
              </div>
            </div>
          )}

          <div className="calendar-actions">
            {!isGoogleCalendarConnected ? (
              <button className="connect-calendar-btn" onClick={connectGoogleCalendar}>
                Connect Google Calendar
              </button>
            ) : (
              <>
                <button 
                  className="sync-calendar-btn" 
                  onClick={syncCalendar}
                  disabled={loading || isAutoSyncing}
                >
                  <FaSync className={loading || isAutoSyncing ? 'spinning' : ''} /> 
                  {loading || isAutoSyncing ? 'Syncing...' : 'Sync Calendar'}
                </button>
                <button className="disconnect-calendar-btn" onClick={disconnectGoogleCalendar}>
                  <FaSignOutAlt /> Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!currentUser && (
        <div className="error-message">
          Please log in to access your calendar
        </div>
      )}

      <div className="calendar-content">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && (
          <div className="events-list">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="no-events">
                <p>No events or tasks for this period</p>
              </div>
            ) : (
              events.map(event => renderEventCard(event))
            )}
          </div>
        )}
        {viewMode === 'custom' && (
          <div className="events-list">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="no-events">
                <p>No events or tasks for this period</p>
              </div>
            ) : (
              events.map(event => renderEventCard(event))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar; 