import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCalendar, FaUser, FaImage, FaFileAlt } from 'react-icons/fa';

const CreateMessage = () => {
  const [messageType, setMessageType] = useState('text');
  const [unlockCondition, setUnlockCondition] = useState('date');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    setFiles([...files, ...Array.from(fileList)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="has-navbar-spacing">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Create Time-Locked Message</h1>
          <p className="text-gray-400">
            Compose a message that will be delivered at a specific time or milestone.
          </p>
        </motion.div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Message Type Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Message Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'text', icon: <FaFileAlt className="w-5 h-5" /> },
                { type: 'media', icon: <FaImage className="w-5 h-5" /> }
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMessageType(type)}
                  className={`p-4 rounded-lg border ${
                    messageType === type
                      ? 'border-white bg-gray-800'
                      : 'border-gray-700 hover:border-gray-500'
                  } transition-all`}
                >
                  <div className="flex items-center space-x-2">
                    {icon}
                    <span className="capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Message Content</h2>
            {messageType === 'text' ? (
              <textarea
                className="w-full h-40 bg-gray-800 rounded-lg p-4 text-white resize-none"
                placeholder="Write your message here..."
              />
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-white bg-gray-800' : 'border-gray-700'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleChange}
                />
                <FaUpload className="w-8 h-8 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-2">
                  Drag and drop your files here, or{' '}
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="text-white hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, and audio files
                </p>

                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-2 rounded"
                      >
                        <span className="text-sm text-gray-300 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Unlock Conditions */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Unlock Conditions</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { type: 'date', icon: <FaCalendar className="w-5 h-5" /> },
                { type: 'milestone', icon: <FaUser className="w-5 h-5" /> }
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUnlockCondition(type)}
                  className={`p-4 rounded-lg border ${
                    unlockCondition === type
                      ? 'border-white bg-gray-800'
                      : 'border-gray-700 hover:border-gray-500'
                  } transition-all`}
                >
                  <div className="flex items-center space-x-2">
                    {icon}
                    <span className="capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>

            {unlockCondition === 'date' ? (
              <input
                type="date"
                className="w-full bg-gray-800 rounded-lg p-4 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <input
                type="text"
                className="w-full bg-gray-800 rounded-lg p-4 text-white"
                placeholder="Enter milestone (e.g., 'When I graduate')"
              />
            )}
          </div>

          {/* Recipient */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recipient</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recipient"
                  id="self"
                  defaultChecked
                  className="text-white focus:ring-white"
                />
                <label htmlFor="self">Send to myself</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recipient"
                  id="other"
                  className="text-white focus:ring-white"
                />
                <label htmlFor="other">Send to someone else</label>
              </div>
              <input
                type="email"
                className="w-full bg-gray-800 rounded-lg p-4 text-white mt-4"
                placeholder="Recipient's email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4"
          >
            Create Time-Locked Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMessage; 