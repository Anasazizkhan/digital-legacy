import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaCalendarAlt, FaSync } from 'react-icons/fa';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const connectGoogleCalendar = async () => {
    setLoading(true);
    try {
      // TODO: Implement Google Calendar OAuth
      // This is where you'll add the Google Calendar API integration
      setIsGoogleCalendarConnected(true);
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCalendar = async () => {
    setLoading(true);
    try {
      // TODO: Implement calendar sync logic
      // This is where you'll fetch events from Google Calendar
    } catch (error) {
      console.error('Error syncing calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Upcoming Events</h2>
        {!isGoogleCalendarConnected ? (
          <button 
            className="connect-calendar-btn"
            onClick={connectGoogleCalendar}
            disabled={loading}
          >
            <FaGoogle className="icon" />
            Connect Google Calendar
          </button>
        ) : (
          <button 
            className="sync-calendar-btn"
            onClick={syncCalendar}
            disabled={loading}
          >
            <FaSync className="icon" />
            Sync Calendar
          </button>
        )}
      </div>

      <div className="calendar-content">
        {events.length === 0 ? (
          <div className="no-events">
            <FaCalendarAlt className="icon" />
            <p>No upcoming events</p>
            {!isGoogleCalendarConnected && (
              <p className="connect-prompt">
                Connect your Google Calendar to see your events here
              </p>
            )}
          </div>
        ) : (
          <div className="events-list">
            {events.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-date">
                  <span className="day">{new Date(event.start).getDate()}</span>
                  <span className="month">{new Date(event.start).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="event-details">
                  <h3>{event.summary}</h3>
                  <p>{event.description}</p>
                  <span className="event-time">
                    {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
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