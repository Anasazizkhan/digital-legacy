import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaImage, FaVideo, FaFileAlt, FaPlus, FaUsers, FaTrash, FaDownload, FaEye, FaEdit, FaSearch, FaArrowLeft, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import * as vaultService from '../services/vaultService';
import './VaultDetail.css';

const VaultDetail = () => {
  const { vaultId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [vault, setVault] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  // Add text modal states
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [addingText, setAddingText] = useState(false);
  const [textError, setTextError] = useState('');

  useEffect(() => {
    if (vaultId && currentUser) {
      loadVaultData();
    }
  }, [vaultId, currentUser]);

  const loadVaultData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading vault data for vault ID:', vaultId);
      const [vaultData, contentData] = await Promise.all([
        vaultService.getVaultById(vaultId),
        vaultService.getVaultContent(vaultId)
      ]);
      
      console.log('Vault data response:', vaultData);
      console.log('Content data response:', contentData);
      console.log('Content data structure:', {
        success: contentData?.success,
        hasData: !!contentData?.data,
        files: contentData?.data?.files,
        notes: contentData?.data?.notes,
        statistics: contentData?.data?.statistics
      });
      
      setVault(vaultData.data || vaultData);
      
      // Handle the actual backend response structure
      let contentArray = [];
      if (contentData?.success && contentData?.data) {
        // Combine files and notes from the response
        const files = contentData.data.files || [];
        const notes = contentData.data.notes || [];
        
        console.log('Processing files:', files);
        console.log('Processing notes:', notes);
        
        // Convert notes to content format if needed
        const notesAsContent = notes.map(note => {
          console.log('Processing note:', note);
          console.log('Note timestamp fields:', {
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            timestamp: note.timestamp,
            date: note.date,
            uploadedAt: note.uploadedAt
          });
          
          return {
            ...note,
            type: 'text',
            fileType: 'text/plain',
            name: note.title || note.content?.substring(0, 50) + '...',
            description: note.content
          };
        });
        
        contentArray = [...files, ...notesAsContent];
      } else {
        // Fallback to old structure
        contentArray = contentData?.data || contentData?.content || contentData || [];
      }
      
      console.log('Final content array:', contentArray);
      setContent(Array.isArray(contentArray) ? contentArray : []);
    } catch (error) {
      console.error('Failed to load vault data:', error);
      setError('Failed to load vault data. Please try again.');
      setContent([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
    setSelectedFiles([]);
    setUploadDescription('');
    setUploadError('');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async () => {
    if (!selectedFiles.length) return;
    
    console.log('Starting upload process...');
    console.log('Vault ID:', vaultId);
    console.log('Selected files:', selectedFiles);
    console.log('Description:', uploadDescription);
    
    setUploading(true);
    setUploadError('');
    
    try {
      for (const file of selectedFiles) {
        console.log('Uploading file:', file.name);
        const result = await vaultService.uploadToVault(vaultId, file, uploadDescription);
        console.log('Upload result:', result);
      }
      
      console.log('All files uploaded successfully, refreshing data...');
      // Refresh vault data to show new content
      await loadVaultData();
      setShowUploadModal(false);
      setSelectedFiles([]);
      setUploadDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setUploadDescription('');
    setUploadError('');
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTextClick = () => {
    setShowAddTextModal(true);
    setTextTitle('');
    setTextContent('');
    setTextError('');
  };

  const handleAddText = async () => {
    if (!textTitle.trim() || !textContent.trim()) {
      setTextError('Please provide both a title and content for your text note.');
      return;
    }

    setAddingText(true);
    setTextError('');

    try {
      console.log('Adding text to vault:', vaultId);
      console.log('Text data:', { title: textTitle, content: textContent });

      const textData = {
        title: textTitle.trim(),
        content: textContent.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
        addedBy: currentUser?.email || currentUser?.displayName || 'Unknown User',
        userId: currentUser?.uid
      };

      const result = await vaultService.addTextToVault(vaultId, textData);
      console.log('Add text result:', result);

      if (result.success) {
        console.log('Text added successfully, refreshing data...');
        // Refresh vault data to show new text content
        await loadVaultData();
        setShowAddTextModal(false);
        setTextTitle('');
        setTextContent('');
      } else {
        setTextError(result.message || 'Failed to add text. Please try again.');
      }
    } catch (error) {
      console.error('Add text failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      setTextError(error.response?.data?.message || 'Failed to add text. Please try again.');
    } finally {
      setAddingText(false);
    }
  };

  const closeAddTextModal = () => {
    setShowAddTextModal(false);
    setTextTitle('');
    setTextContent('');
    setTextError('');
    setAddingText(false);
  };

  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  const isVideoFile = (fileType) => {
    return fileType && fileType.startsWith('video/');
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    console.log('Formatting timestamp:', timestamp, 'Type:', typeof timestamp);
    
    try {
      // Handle different timestamp formats
      let date;
      
      if (typeof timestamp === 'string') {
        // Try parsing as ISO string first
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        // Handle Unix timestamp (seconds or milliseconds)
        date = new Date(timestamp * (timestamp < 10000000000 ? 1000 : 1));
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        console.warn('Unknown timestamp format:', timestamp);
        return 'Invalid date';
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from timestamp:', timestamp);
        return 'Invalid date';
      }
      
      // Format the date
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      console.log('Formatted date:', formattedDate);
      return formattedDate;
      
    } catch (error) {
      console.error('Error formatting timestamp:', error, 'Timestamp:', timestamp);
      return 'Invalid date';
    }
  };

  const getFileIcon = (fileType) => {
    if (isImageFile(fileType)) return <FaImage />;
    if (isVideoFile(fileType)) return <FaVideo />;
    if (fileType === 'text' || fileType === 'text/plain') return <FaFileAlt />;
    return <FaFileAlt />;
  };

  const isTextContent = (item) => {
    return item.type === 'text' || item.fileType === 'text/plain' || item.content;
  };

  // Add handlers for preview, download, and delete
  const handlePreview = (item) => {
    if (!item.url && !item.fileUrl) {
      alert('No preview available for this file.');
      return;
    }
    window.open(item.url || item.fileUrl, '_blank');
  };

  const handleDownload = async (item) => {
    const url = item.url || item.fileUrl;
    if (!url) {
      alert('No download available for this file.');
      return;
    }
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.name || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert('Failed to download file: ' + error.message);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await vaultService.deleteVaultContent(vaultId, item.id);
      alert('File deleted!');
      // Refresh content
      await loadVaultData();
    } catch (error) {
      alert('Failed to delete file: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="vault-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-detail-page">
      <div className="vault-detail-header">
        <button className="back-btn" onClick={() => navigate('/vault')}>
          <FaArrowLeft /> Back to Vaults
        </button>
        <h1>{vault?.name}</h1>
        <p>{vault?.description}</p>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={loadVaultData} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="vault-controls">
        <button className="upload-btn" onClick={handleUploadClick}>
          <FaUpload /> Upload Files
        </button>
        <button className="add-text-btn" onClick={handleAddTextClick}>
          <FaPlus /> Add Text
        </button>
      </div>

      <div className="content-section">
        <h2>Vault Content ({(content || []).length} items)</h2>
        
        {(content || []).length === 0 ? (
          <div className="empty-content">
            <p>No content in this vault yet.</p>
            <button className="upload-first-btn" onClick={handleUploadClick}>
              <FaUpload /> Upload Your First File
            </button>
          </div>
        ) : (
          <div className="content-grid">
            {(content || []).map((item, index) => (
              <div key={item.id || index} className={`content-card ${isTextContent(item) ? 'text-content' : ''}`}>
                {isTextContent(item) ? (
                  // Text Content Display
                  <div className="text-note-display">
                    <div className="text-note-header">
                      <div className="text-note-icon">
                        <FaFileAlt />
                      </div>
                      <div className="text-note-meta">
                        <h4 className="text-note-title">{item.title || item.name || `Note ${index + 1}`}</h4>
                        <div className="text-note-info">
                          <span className="text-note-date">
                            {(() => {
                              const timestamp = item.createdAt || item.uploadedAt || item.timestamp;
                              console.log('Text note timestamp for item:', item.title || item.name, 'Timestamp:', timestamp);
                              return formatTimestamp(timestamp);
                            })()}
                          </span>
                          {item.addedBy && (
                            <span className="text-note-author">
                              by {item.addedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-note-content">
                      <p>{item.content || item.description || 'No content available'}</p>
                    </div>
                    <div className="text-note-actions">
                      <button className="action-btn" title="View Full Text">
                        <FaEye />
                      </button>
                      <button className="action-btn" title="Edit Text">
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" title="Delete Text">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ) : (
                  // File Content Display (existing code)
                  <>
                    <div className="content-preview">
                      {isImageFile(item.fileType || item.type) ? (
                        <img 
                          src={item.url || item.fileUrl} 
                          alt={item.description || item.name}
                          className="content-image"
                        />
                      ) : (
                        <div className="file-preview">
                          {getFileIcon(item.fileType || item.type)}
                        </div>
                      )}
                    </div>
                    <div className="content-info">
                      <h4>{item.name || item.title || `Item ${index + 1}`}</h4>
                      {item.description && (
                        <p className="content-description">{item.description}</p>
                      )}
                      <div className="content-meta">
                        <span className="file-size">{formatFileSize(item.size || 0)}</span>
                        <span className="upload-date">{formatTimestamp(item.uploadedAt || item.timestamp || item.createdAt)}</span>
                      </div>
                    </div>
                    <div className="content-actions">
                      <button className="action-btn" title="View" onClick={() => handlePreview(item)}><FaEye /></button>
                      <button className="action-btn" title="Download" onClick={() => handleDownload(item)}><FaDownload /></button>
                      <button className="action-btn delete" title="Delete" onClick={() => handleDelete(item)}><FaTrash /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal upload-modal">
            <div className="modal-header">
              <h3>Upload Files to "{vault?.name}"</h3>
              <button className="close-btn" onClick={closeUploadModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
                <button 
                  className="select-files-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <FaUpload />
                  {uploading ? 'Uploading...' : 'Select Files'}
                </button>
                <p className="upload-hint">Click to select files or drag and drop</p>
                
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <h4>Selected Files ({selectedFiles.length}):</h4>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="upload-description">Description (optional)</label>
                <textarea
                  id="upload-description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Add a description for these files..."
                  disabled={uploading}
                  rows="3"
                />
              </div>
              
              {uploadError && (
                <div className="upload-error">
                  <FaExclamationTriangle />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                className="upload-btn"
                onClick={handleUploadFiles}
                disabled={uploading || selectedFiles.length === 0}
              >
                <FaUpload />
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Text Modal */}
      {showAddTextModal && (
        <div className="modal-overlay">
          <div className="modal add-text-modal">
            <div className="modal-header">
              <h3>Add Text Note to "{vault?.name}"</h3>
              <button className="close-btn" onClick={closeAddTextModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="text-title">Title</label>
                <input
                  id="text-title"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="Enter the title of your text note..."
                  disabled={addingText}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="text-content">Content</label>
                <textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter the content of your text note..."
                  disabled={addingText}
                  rows="3"
                />
              </div>
              
              {textError && (
                <div className="text-error">
                  <FaExclamationTriangle />
                  <span>{textError}</span>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeAddTextModal}
                disabled={addingText}
              >
                Cancel
              </button>
              <button 
                className="add-btn"
                onClick={handleAddText}
                disabled={addingText || !textTitle.trim() || !textContent.trim()}
              >
                Add Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultDetail; 