import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaVideo, FaPlay, FaPause, FaStop, FaTrash, FaUpload, FaExclamationTriangle, FaCamera, FaTimes, FaPaperclip, FaChevronDown, FaMusic } from 'react-icons/fa';
import { uploadAudio, uploadVideo, uploadMediaAsBase64, deleteMessageMedia } from '../services/messageService';
import './MediaUpload.css';

const MediaUpload = ({ onMediaUpload, onMediaRemove, existingMedia = {}, messageId = null }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState(null); // 'audio' or 'video'
  const [mediaPreview, setMediaPreview] = useState({
    audio: existingMedia.audio || null,
    video: existingMedia.video || null
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoChunksRef = useRef([]);
  const audioFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Debug video element initialization
  useEffect(() => {
    if (videoPreviewRef.current && (showVideoPreview || isVideoRecording)) {
      console.log('Video element ready:', videoPreviewRef.current);
      console.log('Video srcObject:', videoPreviewRef.current.srcObject);
    }
  }, [showVideoPreview, isVideoRecording]);

  // Initialize video element properties
  useEffect(() => {
    if (videoPreviewRef.current) {
      const videoElement = videoPreviewRef.current;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.autoplay = true;
    }
  }, []);

  // Set up video stream when video element is ready
  useEffect(() => {
    if (showVideoPreview && isVideoRecording && streamRef.current && videoPreviewRef.current) {
      const videoElement = videoPreviewRef.current;
      const stream = streamRef.current;
      
      console.log('Setting up video stream for preview');
      
      // Set srcObject
      videoElement.srcObject = stream;
      
      // Set up event handlers
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded, playing...');
        videoElement.play().catch(e => {
          console.error('Error playing video:', e);
        });
      };
      
      const handleCanPlay = () => {
        console.log('Video can play');
      };
      
      const handleError = (e) => {
        console.error('Video element error:', e);
      };
      
      // Remove existing event listeners to avoid duplicates
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      
      // Add event listeners
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);
      
      // Set video properties
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.autoplay = true;
    }
  }, [showVideoPreview, isVideoRecording]);

  // Audio recording functions
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setShowOptions(false);
      setSelectedMediaType(null);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Video recording functions with preview
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        }, 
        audio: true 
      });
      streamRef.current = stream;
      
      // Show video preview immediately
      setShowVideoPreview(true);
      setIsVideoRecording(true);
      setShowOptions(false);
      setSelectedMediaType(null);

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setShowVideoPreview(false);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // Clean up video element
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      mediaRecorderRef.current.start();
      
    } catch (error) {
      console.error('Error starting video recording:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isVideoRecording) {
      mediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    }
  };

  // File upload functions using backend API
  const handleAudioFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadedMedia = await uploadAudio(file);
      setMediaPreview(prev => ({ ...prev, audio: uploadedMedia }));
      onMediaUpload('audio', uploadedMedia);
      setSelectedMediaType(null);
    } catch (error) {
      console.error('Error uploading audio file:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadedMedia = await uploadVideo(file);
      setMediaPreview(prev => ({ ...prev, video: uploadedMedia }));
      onMediaUpload('video', uploadedMedia);
      setSelectedMediaType(null);
    } catch (error) {
      console.error('Error uploading video file:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadRecordedAudio = async () => {
    if (!audioBlob) return;

    setUploading(true);
    setUploadError(null);

    try {
      const file = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' });
      const uploadedMedia = await uploadAudio(file);
      
      setMediaPreview(prev => ({ ...prev, audio: uploadedMedia }));
      onMediaUpload('audio', uploadedMedia);
      setAudioBlob(null);
    } catch (error) {
      console.error('Error uploading recorded audio:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadRecordedVideo = async () => {
    if (!videoBlob) return;

    setUploading(true);
    setUploadError(null);

    try {
      const file = new File([videoBlob], 'recorded-video.webm', { type: 'video/webm' });
      const uploadedMedia = await uploadVideo(file);
      
      setMediaPreview(prev => ({ ...prev, video: uploadedMedia }));
      onMediaUpload('video', uploadedMedia);
      setVideoBlob(null);
    } catch (error) {
      console.error('Error uploading recorded video:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (type) => {
    try {
      // If we have a messageId and the media is already uploaded, delete from database
      if (messageId && mediaPreview[type] && mediaPreview[type].fileName) {
        await deleteMessageMedia(messageId, type, mediaPreview[type].fileName);
      }
      
      setMediaPreview(prev => ({ ...prev, [type]: null }));
      onMediaRemove(type);
      setUploadError(null);
    } catch (error) {
      console.error('Error removing media:', error);
      setUploadError('Failed to remove media: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasMedia = mediaPreview.audio || mediaPreview.video || audioBlob || videoBlob;

  return (
    <div className="media-upload-container">
      {uploadError && (
        <div className="upload-error">
          <FaExclamationTriangle />
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="error-dismiss">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Compact Media Section */}
      <div className="media-section-compact">
        {/* Attachment Button */}
        {!hasMedia && (
          <div className="attachment-container">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="attachment-button"
              disabled={uploading}
            >
              <FaPaperclip />
              <span>Add Media</span>
              <FaChevronDown className={`chevron ${showOptions ? 'rotated' : ''}`} />
            </button>

            {/* Options Dropdown */}
            {showOptions && (
              <div className="options-dropdown">
                <button
                  type="button"
                  onClick={() => setSelectedMediaType('audio')}
                  disabled={isRecording || isVideoRecording || uploading}
                  className="option-button audio-option"
                >
                  <FaMicrophone />
                  <span>Audio Message</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedMediaType('video')}
                  disabled={isVideoRecording || isRecording || uploading}
                  className="option-button video-option"
                >
                  <FaVideo />
                  <span>Video Message</span>
                </button>
              </div>
            )}

            {/* Audio Options */}
            {selectedMediaType === 'audio' && (
              <div className="media-options-dropdown">
                <div className="options-header">
                  <FaMicrophone />
                  <span>Audio Options</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMediaType(null)}
                    className="close-options"
                  >
                    <FaTimes />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={startAudioRecording}
                  disabled={isRecording || isVideoRecording || uploading}
                  className="media-option-button record-option"
                >
                  <FaMicrophone />
                  <span>Record Audio</span>
                </button>
                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  disabled={uploading}
                  className="media-option-button upload-option"
                >
                  <FaMusic />
                  <span>Upload Audio File</span>
                </button>
              </div>
            )}

            {/* Video Options */}
            {selectedMediaType === 'video' && (
              <div className="media-options-dropdown">
                <div className="options-header">
                  <FaVideo />
                  <span>Video Options</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMediaType(null)}
                    className="close-options"
                  >
                    <FaTimes />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={startVideoRecording}
                  disabled={isVideoRecording || isRecording || uploading}
                  className="media-option-button record-option"
                >
                  <FaCamera />
                  <span>Record Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoFileInputRef.current?.click()}
                  disabled={uploading}
                  className="media-option-button upload-option"
                >
                  <FaUpload />
                  <span>Upload Video File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className="recording-status-compact">
            <div className="recording-indicator"></div>
            <span>Recording audio...</span>
            <button
              type="button"
              onClick={stopAudioRecording}
              className="stop-button-compact"
            >
              <FaStop />
            </button>
          </div>
        )}

        {isVideoRecording && (
          <div className="recording-status-compact">
            <div className="recording-indicator"></div>
            <span>Recording video...</span>
            <button
              type="button"
              onClick={stopVideoRecording}
              className="stop-button-compact"
            >
              <FaStop />
            </button>
          </div>
        )}

        {/* Video Preview During Recording */}
        {(showVideoPreview || isVideoRecording) && (
          <div className="video-preview-container-compact">
            <video 
              ref={videoPreviewRef}
              muted 
              playsInline
              autoPlay
              className="video-preview-compact"
              style={{ 
                backgroundColor: '#000',
                width: '100%',
                height: 'auto',
                maxHeight: '200px',
                objectFit: 'cover'
              }}
            />
            <div className="video-preview-overlay-compact">
              <div className="recording-indicator"></div>
              <span>Recording...</span>
            </div>
          </div>
        )}

        {/* Media Previews */}
        {audioBlob && (
          <div className="media-preview-compact">
            <div className="media-preview-header">
              <FaMicrophone className="media-icon" />
              <span>Audio Recording</span>
            </div>
            <audio controls src={URL.createObjectURL(audioBlob)} className="media-player" />
            <div className="media-actions-compact">
              <button
                type="button"
                onClick={uploadRecordedAudio}
                disabled={uploading}
                className="save-button"
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setAudioBlob(null)}
                className="discard-button-compact"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )}

        {videoBlob && (
          <div className="media-preview-compact">
            <div className="media-preview-header">
              <FaVideo className="media-icon" />
              <span>Video Recording</span>
            </div>
            <video controls src={URL.createObjectURL(videoBlob)} className="media-player" />
            <div className="media-actions-compact">
              <button
                type="button"
                onClick={uploadRecordedVideo}
                disabled={uploading}
                className="save-button"
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setVideoBlob(null)}
                className="discard-button-compact"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )}

        {mediaPreview.audio && (
          <div className="media-preview-compact uploaded">
            <div className="media-preview-header">
              <FaMicrophone className="media-icon" />
              <span>Audio Message</span>
              <button
                type="button"
                onClick={() => removeMedia('audio')}
                className="remove-button-compact"
                title="Remove audio"
              >
                <FaTimes />
              </button>
            </div>
            <audio controls src={mediaPreview.audio.url} className="media-player" />
            <div className="media-info-compact">
              <span>{formatFileSize(mediaPreview.audio.size)}</span>
              {mediaPreview.audio.isBase64 && (
                <span className="base64-indicator">Base64</span>
              )}
            </div>
          </div>
        )}

        {mediaPreview.video && (
          <div className="media-preview-compact uploaded">
            <div className="media-preview-header">
              <FaVideo className="media-icon" />
              <span>Video Message</span>
              <button
                type="button"
                onClick={() => removeMedia('video')}
                className="remove-button-compact"
                title="Remove video"
              >
                <FaTimes />
              </button>
            </div>
            <video controls src={mediaPreview.video.url} className="media-player" />
            <div className="media-info-compact">
              <span>{formatFileSize(mediaPreview.video.size)}</span>
              {mediaPreview.video.isBase64 && (
                <span className="base64-indicator">Base64</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={audioFileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioFileUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={videoFileInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MediaUpload; 