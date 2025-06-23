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
        
        // Convert notes to content format if needed
        const notesAsContent = notes.map(note => ({
          ...note,
          type: 'text',
          fileType: 'text/plain',
          name: note.title || note.content?.substring(0, 50) + '...',
          description: note.content
        }));
        
        contentArray = [...files, ...notesAsContent];
      } else {
        // Fallback to old structure
        contentArray = contentData?.data || contentData?.content || contentData || [];
      }
      
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
    return new Date(timestamp).toLocaleString();
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
        <button className="add-text-btn">
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
              <div key={item.id || index} className="content-card">
                <div className="content-preview">
                  {isImageFile(item.fileType || item.type) ? (
                    <img 
                      src={item.url || item.fileUrl} 
                      alt={item.description || item.name}
                      className="content-image"
                    />
                  ) : isTextContent(item) ? (
                    <div className="text-preview">
                      <FaFileAlt className="text-icon" />
                      <div className="text-preview-content">
                        {item.content || item.description || 'Text content'}
                      </div>
                    </div>
                  ) : (
                    <div className="file-preview">
                      {getFileIcon(item.fileType || item.type)}
                    </div>
                  )}
                </div>
                <div className="content-info">
                  <h4>{item.name || item.title || `Item ${index + 1}`}</h4>
                  {item.description && <p className="content-description">{item.description}</p>}
                  <div className="content-meta">
                    <span className="file-size">{formatFileSize(item.size || 0)}</span>
                    <span className="upload-date">{formatTimestamp(item.uploadedAt || item.timestamp || item.createdAt)}</span>
                  </div>
                </div>
                <div className="content-actions">
                  <button className="action-btn" title="View">
                    <FaEye />
                  </button>
                  <button className="action-btn" title="Download">
                    <FaDownload />
                  </button>
                  <button className="action-btn delete" title="Delete">
                    <FaTrash />
                  </button>
                </div>
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
    </div>
  );
};

export default VaultDetail; 