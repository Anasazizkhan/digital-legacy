import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo, FaMicrophone, FaCalendar, FaUsers, FaLock, FaPencilAlt, FaStop, FaPlay, FaTrash, FaUpload, FaLightbulb, FaEnvelope, FaPaperclip } from 'react-icons/fa';
import { messageTemplates } from '../data/messageTemplates';

const MessageCreator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [deliveryType, setDeliveryType] = useState('date'); // 'date' | 'event' | 'condition'
  const [mediaFiles, setMediaFiles] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryEvent, setDeliveryEvent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [recordingError, setRecordingError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Video recording states and refs
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [videoError, setVideoError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const videoRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);

  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [showAudioOptions, setShowAudioOptions] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
    setMessageContent('');
    setIsCustomMessage(false);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setMessageContent(template.defaultContent);
    setIsCustomMessage(false);
  };

  const handleCustomMessageSelect = () => {
    setSelectedCategory('');
    setSelectedTemplate(null);
    setMessageContent('');
    setIsCustomMessage(true);
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles([...mediaFiles, ...files]);
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setAudioURL(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingError('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRecordingError('Please allow microphone access to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup function for video streams
  const cleanupVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupVideoStream();
    };
  }, []);

  // Video recording functions
  const startVideoRecording = async () => {
    try {
      // Clean up any existing streams
      cleanupVideoStream();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      streamRef.current = stream;
      setShowPreview(true);

      // Wait for the next render cycle to ensure video element exists
      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }, 0);

      videoRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      videoRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      videoRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoBlob);
        setVideoURL(videoUrl);
        cleanupVideoStream();
      };

      videoRecorderRef.current.start();
      setIsRecordingVideo(true);
      setVideoError('');
      setShowVideoOptions(false);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setVideoError('Please allow camera access to record video.');
      setShowPreview(false);
      cleanupVideoStream();
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isRecordingVideo) {
      videoRecorderRef.current.stop();
      setIsRecordingVideo(false);
      setShowPreview(false);
      cleanupVideoStream();
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setRecordedAudio(null);
    setAudioURL('');
  };

  const deleteVideoRecording = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setRecordedVideo(null);
    setVideoURL('');
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const videoUrl = URL.createObjectURL(files[0]);
      setVideoURL(videoUrl);
      setRecordedVideo(files[0]);
    }
  };

  const handleAudioUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const audioUrl = URL.createObjectURL(files[0]);
      setAudioURL(audioUrl);
      setRecordedAudio(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement message submission
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Message Type Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaPencilAlt className="text-blue-400" />
          Choose Message Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.button
            onClick={() => setIsCustomMessage(false)}
            className={`card relative overflow-hidden ${!isCustomMessage ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10" : ""}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 relative z-10">
              <FaUsers className="text-xl text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold">Use Template</h3>
                <p className="text-sm text-gray-400">Choose from pre-made message templates</p>
              </div>
            </div>
            {!isCustomMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              />
            )}
          </motion.button>
          
          <motion.button
            onClick={handleCustomMessageSelect}
            className={`card relative overflow-hidden ${isCustomMessage ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10" : ""}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 relative z-10">
              <FaPencilAlt className="text-xl text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold">Custom Message</h3>
                <p className="text-sm text-gray-400">Create your own message from scratch</p>
              </div>
            </div>
            {isCustomMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              />
            )}
          </motion.button>
        </div>

        {/* Template Categories */}
        {!isCustomMessage && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(messageTemplates).map(([category, templates]) => (
              <motion.button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`card relative overflow-hidden ${selectedCategory === category ? "border-blue-500" : ""}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <p className="text-sm text-gray-400">{Object.keys(templates).length} templates</p>
                </div>
                {selectedCategory === category && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection */}
      {selectedCategory && !isCustomMessage && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUsers className="text-blue-400" />
            Choose a Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(messageTemplates[selectedCategory]).map(([key, template]) => (
              <motion.button
                key={key}
                onClick={() => handleTemplateSelect(template)}
                className={`card relative overflow-hidden ${selectedTemplate?.title === template.title ? 'border-blue-500' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <h4 className="text-lg font-semibold">{template.title}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
                {selectedTemplate?.title === template.title && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Message Form */}
      {(selectedTemplate || isCustomMessage) && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Custom Message Title */}
          {isCustomMessage && (
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FaPencilAlt className="text-blue-400" />
                Message Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                placeholder="Enter a title for your message..."
                required
              />
            </div>
          )}

          {/* Writing Prompts for Templates */}
          {selectedTemplate && !isCustomMessage && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" />
                Writing Prompts
              </h4>
              <div className="grid gap-3">
                {selectedTemplate.prompts.map((prompt, index) => (
                  <div key={index} className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-yellow-500/30 transition-all duration-200">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              Your Message
            </label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="w-full h-64 bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
              placeholder={isCustomMessage ? "Write your message here..." : "Use the prompts above to help you write your message..."}
              required
            />
          </div>

          {/* Media Attachments */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaPaperclip className="text-blue-400" />
              Add Media
            </label>
            <div className="flex flex-wrap gap-4">
              {/* Image Upload */}
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <FaImage className="text-blue-400" /> Photos
              </button>

              {/* Video Options */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoOptions(!showVideoOptions);
                    setShowAudioOptions(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <FaVideo className="text-blue-400" /> Video
                </button>

                {showVideoOptions && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                    <button
                      type="button"
                      onClick={() => document.getElementById('video-upload').click()}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <FaUpload /> Upload Video
                    </button>
                    <button
                      type="button"
                      onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <FaVideo className={isRecordingVideo ? "animate-pulse" : ""} />
                      {isRecordingVideo ? "Stop Recording" : "Record Video"}
                    </button>
                  </div>
                )}
              </div>

              {/* Audio Options */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowAudioOptions(!showAudioOptions);
                    setShowVideoOptions(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <FaMicrophone className="text-blue-400" /> Audio
                </button>

                {showAudioOptions && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                    <button
                      type="button"
                      onClick={() => document.getElementById('audio-upload').click()}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <FaUpload /> Upload Audio
                    </button>
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700"
                    >
                      <FaMicrophone className={isRecording ? "animate-pulse" : ""} />
                      {isRecording ? "Stop Recording" : "Record Audio"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* File Inputs */}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
            />
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />

            {/* Video Preview and Controls */}
            <div className="mt-4">
              {/* Live Preview */}
              {(isRecordingVideo && showPreview) && (
                <div className="relative">
                  <div className="bg-black rounded-lg overflow-hidden" style={{ minHeight: "240px" }}>
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      type="button"
                      onClick={stopVideoRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg"
                    >
                      <FaStop /> Stop Recording
                    </button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-white text-sm shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Recording
                    </div>
                  </div>
                </div>
              )}

              {/* Recorded Video */}
              {videoURL && !isRecordingVideo && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <div className="bg-black rounded-lg overflow-hidden" style={{ minHeight: "240px" }}>
                    <video
                      src={videoURL}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={deleteVideoRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-lg"
                    >
                      <FaTrash /> Delete Recording
                    </button>
                    <button
                      type="button"
                      onClick={startVideoRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white shadow-lg"
                    >
                      <FaVideo /> Record New
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {videoError && (
                <div className="mt-2 text-red-500 text-sm">
                  {videoError}
                </div>
              )}
            </div>

            {/* Audio Recording Controls */}
            {audioURL && !isRecording && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={playRecording}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    <FaPlay /> Play
                  </button>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded"
                  >
                    <FaTrash /> Delete
                  </button>
                  <span className="text-sm text-gray-400">
                    Audio message available
                  </span>
                </div>
              </div>
            )}

            {/* Recording Error Messages */}
            {(recordingError || videoError) && (
              <p className="text-red-500 text-sm mt-2">
                {recordingError || videoError}
              </p>
            )}
          </div>

          {/* Delivery Settings */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Delivery Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('date')}
                className={"card flex items-center gap-3" + (deliveryType === 'date' ? " border-blue-500" : "")}
              >
                <FaCalendar />
                <span>Specific Date</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('event')}
                className={"card flex items-center gap-3" + (deliveryType === 'event' ? " border-blue-500" : "")}
              >
                <FaUsers />
                <span>Life Event</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('condition')}
                className={"card flex items-center gap-3" + (deliveryType === 'condition' ? " border-blue-500" : "")}
              >
                <FaLock />
                <span>Condition</span>
              </button>
            </div>

            {/* Date Selection */}
            {deliveryType === 'date' && (
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="mt-4 w-full bg-white/5 border border-white/10 rounded-lg p-2"
                required
              />
            )}

            {/* Event Selection */}
            {deliveryType === 'event' && (
              <input
                type="text"
                value={deliveryEvent}
                onChange={(e) => setDeliveryEvent(e.target.value)}
                placeholder="e.g., Graduation, Wedding Day"
                className="mt-4 w-full bg-white/5 border border-white/10 rounded-lg p-2"
                required
              />
            )}
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-300">Make this message private</span>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              Schedule Message
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default MessageCreator; 