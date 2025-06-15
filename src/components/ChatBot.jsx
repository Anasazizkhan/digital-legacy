import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaComments, FaUser, FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { sendMessageToCohere } from '../services/claudeService';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis
    speechRef.current = window.speechSynthesis;
    
    // Cleanup on unmount
    return () => {
      if (speechRef.current) {
        speechRef.current.cancel();
      }
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const getInitialMessage = () => {
    return {
      content: "Hello! I'm your Digital Legacy Assistant. I can help you with:\n\n" +
        "• Creating and managing legacy messages\n" +
        "• Understanding our message templates\n" +
        "• Scheduling message deliveries\n" +
        "• Managing recipients\n" +
        "• Privacy and security questions\n\n" +
        "How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date().toISOString()
    };
  };

  const speakText = (text) => {
    if (isMuted || !speechRef.current) return;

    // Cancel any ongoing speech
    speechRef.current.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a female voice
    const voices = speechRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('female') || 
      voice.name.includes('Samantha')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak the text
    speechRef.current.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speechRef.current) {
      speechRef.current.cancel();
    }
  };

  const startRecording = () => {
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser.');
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      // Handle results
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };

      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        const errorMessage = {
          content: `I encountered an error with voice recognition: ${event.error}. Please try typing your message instead.`,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, errorMessage]);
        stopRecording();
      };

      // Handle end of recognition
      recognitionRef.current.onend = () => {
        if (isRecording) {
          // If we're still supposed to be recording, restart
          recognitionRef.current.start();
        }
      };

      // Start recording
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscription('');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      const errorMessage = {
        content: 'I apologize, but speech recognition is not supported in your browser. Please type your message instead.',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      // If we have transcription, send it
      if (transcription.trim()) {
        setUserInput(transcription);
        handleSendMessage(new Event('submit'), transcription);
      }
    }
  };

  const handleSendMessage = async (e, transcribedText = null) => {
    e.preventDefault();
    const messageToSend = transcribedText || userInput;
    if (!messageToSend.trim()) return;

    const newMessage = {
      content: messageToSend,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setTranscription('');
    setChatLoading(true);

    try {
      const contextPrompt = `You are a Digital Legacy Assistant. The user is asking about digital legacy messages, scheduling, or related topics. 
      Provide helpful, empathetic responses focused on digital legacy preservation. 
      User query: ${messageToSend}`;

      const response = await sendMessageToCohere(contextPrompt);
      const assistantMessage = {
        content: response,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(response);
    } catch (err) {
      console.error('Error getting AI response:', err);
      const errorMessage = {
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.content);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <div className="chatbot-title">
                <FaRobot className="chatbot-icon" />
                <h3>Digital Legacy Assistant</h3>
              </div>
              <div className="header-buttons">
                <button
                  onClick={toggleMute}
                  className={`mute-button ${isMuted ? 'muted' : ''}`}
                  title={isMuted ? "Unmute voice" : "Mute voice"}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button onClick={toggleChat} className="close-button">
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="chatbot-messages">
              {chatMessages.length === 0 && (
                <div className="message bot">
                  <FaRobot className="message-icon" />
                  <div className="message-content">
                    <p>{getInitialMessage().content}</p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.sender === 'user' ? <FaUser className="message-icon" /> : <FaRobot className="message-icon" />}
                  <div className="message-content">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="message bot">
                  <FaRobot className="message-icon" />
                  <div className="message-content">
                    <p>Thinking about your digital legacy question...</p>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="chatbot-input">
              <input
                type="text"
                value={isRecording ? transcription : userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Ask about digital legacy messages..."}
                className="message-input"
                disabled={chatLoading || isRecording}
              />
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`voice-button ${isRecording ? 'recording' : ''}`}
                disabled={chatLoading}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
              <button 
                type="submit" 
                className="send-button" 
                disabled={chatLoading || (!userInput.trim() && !transcription.trim()) || isRecording}
              >
                <FaComments />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-button"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot className="chatbot-icon" />
      </motion.button>
    </div>
  );
};

export default ChatBot; 