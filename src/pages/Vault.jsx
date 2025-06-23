import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaFolder, FaUsers, FaLock, FaPlus, FaExclamationTriangle, FaUpload, FaTimes, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import * as vaultService from '../services/vaultService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Vault.css';

const Vault = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState(false);
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [vaultContent, setVaultContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const fileInputRef = useRef();

  // Collaborator modal states
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  // Collaboration requests states
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  // Separate vaults by ownership
  const personalVaults = vaults.filter(vault => vault.ownerEmail === currentUser?.email);
  const collaboratedVaults = vaults.filter(vault => vault.ownerEmail !== currentUser?.email);

  // Debug logging
  console.log('Current user email:', currentUser?.email);
  console.log('All vaults:', vaults);
  console.log('Personal vaults:', personalVaults);
  console.log('Collaborated vaults:', collaboratedVaults);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('Loading vault data for user:', currentUser.email);
      loadVaults();
    } else {
      console.log('No currentUser, not loading vault data');
      setLoading(false);
    }
  }, [currentUser]);

  const loadVaults = async () => {
    try {
      setLoading(true);
      setError('');
      setBackendError(false);
      
      console.log('Making API call to fetch vaults...');
      const response = await vaultService.getVaults();
      
      console.log('Vaults API response:', response);
      
      if (response.success) {
        // Handle different possible response structures
        const vaultsData = response.data || response.vaults || [];
        setVaults(Array.isArray(vaultsData) ? vaultsData : []);
        
        // Load content for each vault
        if (vaultsData.length > 0) {
          await loadVaultContent(vaultsData);
        }
      } else {
        setError(response.message || 'Failed to load vaults');
        setVaults([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Failed to load vaults:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request
      });
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK') {
        console.log('Backend server is not running. Please start the backend server.');
        setBackendError(true);
        setError('Backend server is not running. Please start the backend server.');
      } else if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        setError(errorData.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Network error
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        // Other error
        setError(error.message || 'An unexpected error occurred');
      }
      
      // Set empty array as fallback
      setVaults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVaultContent = async (vaultsData) => {
    try {
      setContentLoading(true);
      const contentPromises = vaultsData.map(async (vault) => {
        try {
          const contentResponse = await vaultService.getVaultContent(vault.id);
          return {
            vaultId: vault.id,
            content: contentResponse.data || contentResponse.content || []
          };
        } catch (error) {
          console.error(`Failed to load content for vault ${vault.id}:`, error);
          return {
            vaultId: vault.id,
            content: []
          };
        }
      });
      
      const contentResults = await Promise.all(contentPromises);
      const contentMap = {};
      contentResults.forEach(result => {
        contentMap[result.vaultId] = result.content;
      });
      setVaultContent(contentMap);
    } catch (error) {
      console.error('Failed to load vault content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const isImageFile = (fileType) => {
    return fileType.startsWith('image/');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleCreateVault = () => {
    navigate('/vault/create');
  };

  const handleOpenVault = (vaultId) => {
    navigate(`/vault/${vaultId}`);
  };

  const handleRefresh = () => {
    loadVaults();
  };

  const handleUploadClick = (vault) => {
    setSelectedVault(vault);
    setShowUploadModal(true);
    setUploadDescription('');
    setUploadError('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async () => {
    if (!selectedVault || selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadError('');
    
    try {
      for (const file of selectedFiles) {
        await vaultService.uploadToVault(selectedVault.id, file, uploadDescription);
      }
      
      // Refresh vault data to show updated file count
      await loadVaults();
      setShowUploadModal(false);
      setUploadDescription('');
      setSelectedVault(null);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedVault(null);
    setUploadDescription('');
    setUploadError('');
    setUploading(false);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Collaborator management functions
  const handleAddCollaborator = (vault) => {
    console.log('Add Collaborator clicked for vault:', vault);
    setSelectedVault(vault);
    setShowCollaboratorModal(true);
    setCollaboratorEmail('');
    setInviteError('');
    setInviteSuccess('');
  };

  const handleSendInvite = async () => {
    if (!collaboratorEmail.trim()) {
      setInviteError('Please enter a valid email address');
      return;
    }

    if (collaboratorEmail === currentUser?.email) {
      setInviteError('You cannot invite yourself');
      return;
    }

    setSendingInvite(true);
    setInviteError('');
    setInviteSuccess('');

    try {
      await vaultService.sendCollaborationInvite(selectedVault.id, collaboratorEmail);

      setInviteSuccess(`Invitation sent to ${collaboratorEmail}! They will receive an email to accept the invitation.`);
      setCollaboratorEmail('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        closeCollaboratorModal();
      }, 2000);
    } catch (error) {
      console.error('Failed to send collaborator invitation:', error);
      setInviteError(error.response?.data?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setSendingInvite(false);
    }
  };

  const closeCollaboratorModal = () => {
    setShowCollaboratorModal(false);
    setSelectedVault(null);
    setCollaboratorEmail('');
    setInviteError('');
    setInviteSuccess('');
    setSendingInvite(false);
  };

  const loadCollaborationRequests = async () => {
    if (!showRequests) return; // Don't load if the section is hidden

    setRequestsLoading(true);
    setRequestsError('');
    try {
      const response = await vaultService.getCollaborationRequests();
      if (response.success) {
        setCollaborationRequests(response.data || []);
      } else {
        setRequestsError(response.message || 'Failed to load requests.');
        setCollaborationRequests([]);
      }
    } catch (error) {
      console.error('Failed to load collaboration requests:', error);
      setRequestsError(error.response?.data?.message || 'An error occurred while fetching requests.');
      setCollaborationRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch requests when the user clicks to show them
  useEffect(() => {
    loadCollaborationRequests();
  }, [showRequests]);

  const handleAcceptRequest = async (token) => {
    try {
      await vaultService.acceptInviteByToken(token);
      loadVaults(); 
      loadCollaborationRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
      setRequestsError('Failed to accept request. Please try again.');
    }
  };

  const toggleRequestsSection = () => setShowRequests(prev => !prev);

  if (loading) {
    return (
      <div className="vault-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your vaults...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-container" data-aos="fade-up">
      {!loading && !error && !backendError && (
        <>
          <div className="vault-header" data-aos="fade-down">
            <h1>My Vaults</h1>
            <p className="vault-subtitle">
              Securely organize, store, and share your most important digital assets.
            </p>
            <div className="vault-actions">
              <button className="create-vault-btn" onClick={handleCreateVault}>
                <FaPlus /> Create New Vault
              </button>
              <button onClick={toggleRequestsSection} className="collab-requests-btn">
                <FaEnvelope /> 
                {showRequests ? 'Hide Requests' : 'View Requests'}
              </button>
            </div>
          </div>

          {showRequests && (
            <div className="collaboration-requests-section" data-aos="fade-down">
              <h2>Pending Collaboration Requests</h2>
              {requestsLoading && <p>Loading requests...</p>}
              {requestsError && <p className="error-message">{requestsError}</p>}
              {!requestsLoading && !requestsError && (
                collaborationRequests.length > 0 ? (
                  <div className="requests-list">
                    {collaborationRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-info">
                          <p><strong>Vault:</strong> {request.vaultName}</p>
                          <p><strong>From:</strong> {request.fromUserEmail}</p>
                        </div>
                        <div className="request-actions">
                          <button onClick={() => handleAcceptRequest(request.invitationToken)} className="accept-btn">Accept</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You have no pending collaboration requests.</p>
                )
              )}
            </div>
          )}

      {/* Backend Error Message */}
      {backendError && (
            <div className="error-container" data-aos="fade-up">
          <div className="error-content">
            <FaExclamationTriangle className="error-icon" />
            <div className="error-text">
              <h3>Backend Connection Error</h3>
              <p>The backend server is not running. Please start the backend server to use the Vault features.</p>
              <p className="error-details">Error: Connection refused to http://localhost:5000</p>
                  <button onClick={handleRefresh} className="retry-btn">
                    Retry Connection
                  </button>
            </div>
          </div>
        </div>
      )}

          {/* General Error Message */}
          {error && !backendError && (
            <div className="error-container" data-aos="fade-up">
              <div className="error-content">
                <FaExclamationTriangle className="error-icon" />
                <div className="error-text">
                  <h3>Error Loading Vaults</h3>
                  <p>{error}</p>
                  <button onClick={handleRefresh} className="retry-btn">
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Vaults Section */}
          <div className="vault-section" data-aos="fade-up" data-aos-delay="200">
            <div className="section-header">
              <h2>Personal Vaults</h2>
              <p>Vaults you own and manage</p>
            </div>
            
            <div className="vault-list-container">
              {personalVaults.map((vault, index) => (
                <div key={vault.id} className="vault-card" data-aos="fade-up" data-aos-delay={100 * index}>
                  <div className="vault-card-header">
                    <FaFolder className="vault-icon" />
                    <h2 className="vault-name">{vault.name}</h2>
                  </div>
                  <p className="vault-description">{vault.description}</p>
                  
                  {/* Vault Content Display */}
                  {vaultContent[vault.id] && vaultContent[vault.id].length > 0 && (
                    <div className="vault-content-preview">
                      <h4>Recent Content</h4>
                      <div className="content-collage">
                        {vaultContent[vault.id].slice(0, 6).map((item, itemIndex) => (
                          <div key={item.id || itemIndex} className="content-item">
                            {isImageFile(item.fileType || item.type) ? (
                              <div className="image-item">
                                <img 
                                  src={item.url || item.fileUrl} 
                                  alt={item.description || item.name}
                                  className="content-image"
                                />
                                <div className="content-caption">
                                  <p className="caption-text">{item.description || item.name}</p>
                                  <p className="caption-timestamp">{formatTimestamp(item.uploadedAt || item.timestamp)}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="file-item">
                                <div className="file-icon">📄</div>
                                <div className="content-caption">
                                  <p className="caption-text">{item.name || item.description}</p>
                                  <p className="caption-timestamp">{formatTimestamp(item.uploadedAt || item.timestamp)}</p>
                                  <p className="file-size">{formatFileSize(item.size || 0)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {vaultContent[vault.id].length > 6 && (
                        <p className="more-content">+{vaultContent[vault.id].length - 6} more items</p>
                      )}
                    </div>
                  )}
                  
                  <div className="vault-meta">
                    <span className={`vault-access ${vault.access.toLowerCase()}`}>
                      {vault.access === 'private' ? <FaLock /> : <FaUsers />}
                      {vault.access.charAt(0).toUpperCase() + vault.access.slice(1)}
                    </span>
                    <span className="vault-file-count">{vault.fileCount || 0} files</span>
                    <span className="vault-size">{vault.size || '0 MB'}</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-owner">Owner: You</span>
                    <div className="vault-actions">
                      <button 
                        className="add-collaborator-btn"
                        onClick={() => handleAddCollaborator(vault)}
                        title="Add Collaborator"
                      >
                        <FaUserPlus />
                        <span className="btn-text">Add Collaborator</span>
                      </button>
                      <button 
                        className="upload-files-btn"
                        onClick={() => handleUploadClick(vault)}
                        title="Upload Files"
                      >
                        <FaUpload />
                      </button>
                      <button 
                        className="open-vault-btn" 
                        onClick={() => handleOpenVault(vault.id)}
                      >
                        Open Vault
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {personalVaults.length === 0 && !loading && !error && (
                <div className="empty-vaults-message">
                  <h3>No personal vaults found.</h3>
                  <p>Create your first vault to get started.</p>
                  <button className="create-first-vault-btn" onClick={handleCreateVault}>
                    <FaPlus /> Create Your First Vault
                  </button>
          </div>
              )}
            </div>
          </div>

          {/* Collaborated Vaults Section */}
          <div className="vault-section">
            <div className="section-header">
              <div className="section-header-text">
                <h2>Collaborated Vaults</h2>
                <p>Vaults that have been shared with you.</p>
              </div>
              <Link to="/collaboration-requests" className="check-requests-btn">
                <FaEnvelope /> View Pending Requests
              </Link>
            </div>
            {collaboratedVaults.length > 0 ? (
              <div className="vault-list-container">{collaboratedVaults.map((vault, index) => (
                <div key={vault.id} className="vault-card collaborated" data-aos="fade-up" data-aos-delay={100 * index}>
                  <div className="vault-card-header">
                    <FaFolder className="vault-icon" />
                    <h2 className="vault-name">{vault.name}</h2>
                    <span className="collaborator-badge">Collaborator</span>
                  </div>
                  <p className="vault-description">{vault.description}</p>
                  
                  {/* Vault Content Display */}
                  {vaultContent[vault.id] && vaultContent[vault.id].length > 0 && (
                    <div className="vault-content-preview">
                      <h4>Recent Content</h4>
                      <div className="content-collage">
                        {vaultContent[vault.id].slice(0, 6).map((item, itemIndex) => (
                          <div key={item.id || itemIndex} className="content-item">
                            {isImageFile(item.fileType || item.type) ? (
                              <div className="image-item">
                                <img 
                                  src={item.url || item.fileUrl} 
                                  alt={item.description || item.name}
                                  className="content-image"
                                />
                                <div className="content-caption">
                                  <p className="caption-text">{item.description || item.name}</p>
                                  <p className="caption-timestamp">{formatTimestamp(item.uploadedAt || item.timestamp)}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="file-item">
                                <div className="file-icon">📄</div>
                                <div className="content-caption">
                                  <p className="caption-text">{item.name || item.description}</p>
                                  <p className="caption-timestamp">{formatTimestamp(item.uploadedAt || item.timestamp)}</p>
                                  <p className="file-size">{formatFileSize(item.size || 0)}</p>
          </div>
        </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {vaultContent[vault.id].length > 6 && (
                        <p className="more-content">+{vaultContent[vault.id].length - 6} more items</p>
                      )}
      </div>
                  )}
                  
                  <div className="vault-meta">
                    <span className={`vault-access ${vault.access.toLowerCase()}`}>
                      {vault.access === 'private' ? <FaLock /> : <FaUsers />}
                      {vault.access.charAt(0).toUpperCase() + vault.access.slice(1)}
                    </span>
                    <span className="vault-file-count">{vault.fileCount || 0} files</span>
                    <span className="vault-size">{vault.size || '0 MB'}</span>
                  </div>
                  <div className="vault-footer">
                    <span className="vault-owner">Owner: {vault.ownerEmail}</span>
                    <div className="vault-actions">
                      <button 
                        className="upload-files-btn"
                        onClick={() => handleUploadClick(vault)}
                        title="Upload Files"
                      >
                        <FaUpload />
                      </button>
          <button
                        className="open-vault-btn" 
                        onClick={() => handleOpenVault(vault.id)}
                      >
                        Open Vault
                      </button>
                    </div>
                  </div>
                </div>
              ))}</div>
            ) : (
              <div className="empty-vaults-message">
                <h3>No collaborated vaults found.</h3>
                <p>You haven't been added as a collaborator to any vaults yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal upload-modal">
            <div className="modal-header">
              <h3>Upload Files to "{selectedVault?.name}"</h3>
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
                        <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
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
                {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
          </div>
        </div>
      )}

      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="modal-overlay">
          <div className="modal collaborator-modal">
            <div className="modal-header">
              <h3>Add Collaborator to "{selectedVault?.name}"</h3>
              <button className="close-btn" onClick={closeCollaboratorModal}>
                <FaTimes />
              </button>
          </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="collaborator-email">Collaborator Email</label>
                <input
                  type="email"
                  id="collaborator-email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="Enter the collaborator's email"
                  disabled={sendingInvite}
                />
              </div>

              {inviteError && (
                <div className="invite-error">
                  <FaExclamationTriangle />
                  <span>{inviteError}</span>
                </div>
              )}
                </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeCollaboratorModal}
                disabled={sendingInvite}
              >
                Cancel
                </button>
              <button 
                className="send-invite-btn"
                onClick={handleSendInvite}
                disabled={sendingInvite || !collaboratorEmail.trim()}
              >
                <FaUserPlus />
                {sendingInvite ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Vault; 