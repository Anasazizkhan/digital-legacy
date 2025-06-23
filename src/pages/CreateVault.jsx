import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaUsers, FaSave, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import * as vaultService from '../services/vaultService';
import './CreateVault.css';

const CreateVault = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    access: 'private',
    encryptionLevel: 'standard',
    retentionPolicy: 'indefinite'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdVaultId, setCreatedVaultId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Vault name is required');
      return;
    }

    if (formData.name.length < 3) {
      setError('Vault name must be at least 3 characters long');
      return;
    }

    if (formData.name.length > 50) {
      setError('Vault name must be less than 50 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const vaultData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        access: formData.access,
        encryptionLevel: formData.encryptionLevel,
        retentionPolicy: formData.retentionPolicy,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'active',
        settings: {
          allowFileUploads: true,
          allowTextNotes: true,
          allowCollaboration: formData.access === 'collaborative',
          maxFileSize: 100 * 1024 * 1024,
          allowedFileTypes: ['image/*', 'video/*', 'application/pdf', 'text/*'],
          autoBackup: true,
          versioning: true
        }
      };

      console.log('Creating vault with data:', vaultData);

      const response = await vaultService.createVault(vaultData);
      
      console.log('Vault creation response:', response);

      if (response.success) {
        setSuccess(true);
        setCreatedVaultId(response.vault.id || response.vault.vaultId);
        
        setTimeout(() => {
          navigate('/vault');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create vault');
      }
    } catch (error) {
      console.error('Create vault error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        setError(errorData.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    navigate('/vault');
  };

  return (
    <div className="create-vault-page">
      <div className="create-vault-container">
        <div className="create-vault-header">
          <button className="back-btn" onClick={handleCancel} disabled={loading}>
            <FaArrowLeft /> Back to Vaults
          </button>
          <h1>Create New Vault</h1>
          <p>Set up a secure space for your digital assets</p>
        </div>

        {success && (
          <div className="success-message">
            <FaCheck />
            <div>
              <h4>Vault Created Successfully!</h4>
              <p>Your vault "{formData.name}" has been created. Redirecting to vault list...</p>
              {createdVaultId && (
                <p className="vault-id">Vault ID: {createdVaultId}</p>
              )}
            </div>
          </div>
        )}

        <form className="create-vault-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Vault Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter vault name (3-50 characters)"
              required
              disabled={loading}
              maxLength={50}
            />
            <small>Vault name must be between 3 and 50 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this vault is for (optional)"
              rows="4"
              disabled={loading}
              maxLength={500}
            />
            <small>Maximum 500 characters</small>
          </div>

          <div className="form-group">
            <label>Access Type</label>
            <div className="access-options">
              <label className="access-option">
                <input
                  type="radio"
                  name="access"
                  value="private"
                  checked={formData.access === 'private'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <div className="access-option-content">
                  <FaLock className="access-icon" />
                  <div>
                    <h4>Private</h4>
                    <p>Only you can access this vault</p>
                  </div>
                </div>
              </label>

              <label className="access-option">
                <input
                  type="radio"
                  name="access"
                  value="collaborative"
                  checked={formData.access === 'collaborative'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <div className="access-option-content">
                  <FaUsers className="access-icon" />
                  <div>
                    <h4>Collaborative</h4>
                    <p>Share with others and work together</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="encryptionLevel">Encryption Level</label>
            <select
              id="encryptionLevel"
              name="encryptionLevel"
              value={formData.encryptionLevel}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="standard">Standard (AES-256)</option>
              <option value="enhanced">Enhanced (AES-256 + Key Derivation)</option>
              <option value="military">Military Grade (AES-256 + Hardware Security)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="retentionPolicy">Retention Policy</label>
            <select
              id="retentionPolicy"
              name="retentionPolicy"
              value={formData.retentionPolicy}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="indefinite">Keep Indefinitely</option>
              <option value="1year">Delete after 1 year</option>
              <option value="5years">Delete after 5 years</option>
              <option value="10years">Delete after 10 years</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="create-btn"
              disabled={loading || !formData.name.trim()}
            >
              <FaSave />
              {loading ? 'Creating Vault...' : 'Create Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVault; 