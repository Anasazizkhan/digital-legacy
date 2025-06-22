import { useState, useRef, useEffect } from 'react';
import { FaFileAlt, FaImage, FaVideo, FaUpload, FaDownload, FaTrash, FaFolder, FaFilter, FaSearch, FaCloudUploadAlt, FaChartPie, FaShieldAlt, FaClock, FaStar, FaEye, FaEdit, FaShare, FaCopy, FaArchive, FaUnlock, FaFolderOpen, FaSort, FaSortUp, FaSortDown, FaExclamationTriangle, FaUserClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Vault.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../config/api';
Chart.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ['Personal', 'Professional', 'Other'];
const FILE_TYPES = {
  'image': { icon: <FaImage />, color: '#10b981', label: 'Image' },
  'video': { icon: <FaVideo />, color: '#f59e0b', label: 'Video' },
  'document': { icon: <FaFileAlt />, color: '#3b82f6', label: 'Document' },
  'archive': { icon: <FaArchive />, color: '#8b5cf6', label: 'Archive' }
};

const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'archive';
};

const getFileIcon = (type) => {
  const fileType = getFileType(type);
  return FILE_TYPES[fileType]?.icon || <FaFileAlt />;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function VaultStats({ files, storageStats, activityStatus }) {
  // Calculate storage used by file type
  const typeSizes = {};
  let totalUsed = 0;
  files.forEach(file => {
    const type = getFileType(file.fileType);
    const size = file.fileSize / (1024 * 1024); // Convert to MB
    if (!typeSizes[type]) typeSizes[type] = 0;
    typeSizes[type] += size;
    totalUsed += size;
  });
  const typeLabels = Object.keys(typeSizes).map(type => FILE_TYPES[type]?.label || type);
  const typeData = Object.values(typeSizes);
  const typeColors = Object.keys(typeSizes).map(type => FILE_TYPES[type]?.color || '#3b82f6');

  // Largest files
  const largestFiles = [...files].sort((a, b) => b.fileSize - a.fileSize).slice(0, 5);
  // Recent uploads
  const recentFiles = [...files].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 5);

  // Export stats as CSV
  const exportCSV = () => {
    const rows = [
      ['Name', 'Type', 'Category', 'Folder', 'Size', 'Uploaded At'],
      ...files.map(f => [f.originalName, getFileType(f.fileType), f.category, f.folder, f.fileSizeFormatted, f.uploadedAt])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vault_stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="vault-stats-section" data-aos="fade-up">
      {/* Activity Status Alert */}
      {activityStatus && activityStatus.daysSinceActivity > 30 && (
        <div className="activity-alert" data-aos="fade-up" data-aos-delay="100">
          <FaExclamationTriangle className="alert-icon" />
          <div className="alert-content">
            <h4>Activity Alert</h4>
            <p>You haven't been active for {activityStatus.daysSinceActivity} days. 
               {activityStatus.daysUntilNotification > 0 
                 ? ` Your recipient will be notified in ${activityStatus.daysUntilNotification} days if you remain inactive.`
                 : ' Your recipient has been notified of your inactivity.'}
            </p>
          </div>
        </div>
      )}

      <div className="stats-cards-row">
        <div className="stats-card">
          <div className="stats-card-title">Storage Used</div>
          <div className="stats-card-value">{totalUsed.toFixed(2)} MB</div>
          <div className="stats-card-desc">of {storageStats.total} MB</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(totalUsed / storageStats.total) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}></div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-title">Storage Remaining</div>
          <div className="stats-card-value">{(storageStats.total - totalUsed).toFixed(2)} MB</div>
          <div className="stats-card-desc">Free Space</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${100 - (totalUsed / storageStats.total) * 100}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-title">Total Files</div>
          <div className="stats-card-value">{files.length}</div>
          <div className="stats-card-desc">in Vault</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-title">Starred Files</div>
          <div className="stats-card-value">{storageStats.starredCount}</div>
          <div className="stats-card-desc">Important</div>
        </div>
        <div className="stats-card export-card">
          <button className="export-btn" onClick={exportCSV}><FaDownload /> Export CSV</button>
        </div>
      </div>
      <div className="stats-chart-row">
        <div className="stats-chart-card">
          <div className="stats-card-title">Storage Breakdown</div>
          {typeData.length > 0 ? (
            <Doughnut
              data={{
                labels: typeLabels,
                datasets: [{
                  data: typeData,
                  backgroundColor: typeColors,
                  borderWidth: 2
                }]
              }}
              options={{
                plugins: {
                  legend: { display: true, position: 'bottom', labels: { color: '#fff', font: { size: 14 } } }
                }
              }}
              width={220}
              height={220}
            />
          ) : (
            <div className="no-data">No files uploaded yet</div>
          )}
        </div>
        <div className="stats-list-card">
          <div className="stats-card-title">Largest Files</div>
          <ul className="stats-file-list">
            {largestFiles.map(file => (
              <li key={file.id}>
                <span className="file-name">{file.originalName}</span>
                <span className="file-size">{file.fileSizeFormatted}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="stats-list-card">
          <div className="stats-card-title">Recent Uploads</div>
          <ul className="stats-file-list">
            {recentFiles.map(file => (
              <li key={file.id}>
                <span className="file-name">{file.originalName}</span>
                <span className="file-date">{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Vault = () => {
  const { currentUser } = useAuth();
  console.log('Vault component rendering, currentUser:', currentUser);
  
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Personal');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [storageStats, setStorageStats] = useState({
    total: 1024,
    used: 0,
    categories: {},
    folders: {},
    fileTypes: {},
    starredCount: 0,
    totalDownloads: 0
  });
  const [activityStatus, setActivityStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);
  const fileInputRef = useRef();
  const dropZoneRef = useRef();

  useEffect(() => {
    console.log('Vault useEffect - AOS init');
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  // Load vault data
  useEffect(() => {
    console.log('Vault useEffect - currentUser changed:', currentUser);
    if (currentUser) {
      console.log('Loading vault data for user:', currentUser.email);
      loadVaultData();
      loadActivityStatus();
    } else {
      console.log('No currentUser, not loading vault data');
    }
  }, [currentUser]);

  const loadVaultData = async () => {
    console.log('loadVaultData called');
    try {
      setLoading(true);
      setBackendError(false);
      console.log('Making API calls to backend...');
      
      const [filesResponse, statsResponse] = await Promise.all([
        api.get('/vault/files'),
        api.get('/vault/stats')
      ]);

      console.log('API responses received:', { filesResponse, statsResponse });
      console.log('Files response data:', filesResponse.data);
      console.log('Stats response data:', statsResponse.data);

      if (filesResponse.data.success) {
        setFiles(filesResponse.data.data);
      }

      if (statsResponse.data.success) {
        setStorageStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to load vault data:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request
      });
      
      // Don't crash the component, just show empty state
      setFiles([]);
      setStorageStats({
        total: 1024,
        used: 0,
        categories: {},
        folders: {},
        fileTypes: {},
        starredCount: 0,
        totalDownloads: 0
      });
      
      // Show user-friendly error message
      if (error.code === 'ERR_NETWORK') {
        console.log('Backend server is not running. Please start the backend server.');
        setBackendError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadActivityStatus = async () => {
    try {
      const response = await api.get('/vault/activity');
      if (response.data.success) {
        setActivityStatus(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load activity status:', error);
    }
  };

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filter === 'All' || file.category === filter;
      const matchesFolder = selectedFolder === 'All' || file.folder === selectedFolder;
      return matchesSearch && matchesCategory && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName);
          break;
        case 'size':
          comparison = a.fileSize - b.fileSize;
          break;
        case 'type':
          comparison = getFileType(a.fileType).localeCompare(getFileType(b.fileType));
          break;
        case 'date':
        default:
          comparison = new Date(a.uploadedAt) - new Date(b.uploadedAt);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handle file upload
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (fileList) => {
    setUploading(true);
    setUploadError('');
    
    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('folder', 'Documents');

        const response = await api.post('/vault/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          // Refresh vault data
          await loadVaultData();
        }
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload files.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
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
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  // File actions
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/vault/files/${id}`);
      if (response.data.success) {
        setFiles(prev => prev.filter(f => f.id !== id));
        setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
        await loadVaultData(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await api.get(`/vault/download/${file.id}`);
      if (response.data.success) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.data.data.url;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Refresh data to update download count
        await loadVaultData();
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const toggleStar = async (id) => {
    try {
      const response = await api.patch(`/vault/files/${id}/star`);
      if (response.data.success) {
        setFiles(prev => prev.map(f => 
          f.id === id ? { ...f, isStarred: response.data.data.isStarred } : f
        ));
        await loadVaultData(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    try {
      const response = await api.delete('/vault/files', {
        data: { fileIds: selectedFiles }
      });
      
      if (response.data.success) {
        setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
        setSelectedFiles([]);
        await loadVaultData(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    }
  };

  const bulkDownload = async () => {
    for (const id of selectedFiles) {
      const file = files.find(f => f.id === id);
      if (file) {
        await handleDownload(file);
      }
    }
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <FaSortUp />;
    return <FaSortDown />;
  };

  if (loading) {
    return (
      <div className="vault-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-page">
      {/* Backend Error Message */}
      {backendError && (
        <div className="backend-error-message" data-aos="fade-down">
          <div className="error-content">
            <FaExclamationTriangle className="error-icon" />
            <div className="error-text">
              <h3>Backend Connection Error</h3>
              <p>The backend server is not running. Please start the backend server to use the Vault features.</p>
              <p className="error-details">Error: Connection refused to http://localhost:5000</p>
            </div>
          </div>
        </div>
      )}

      {/* Vault Stats Section */}
      <VaultStats 
        files={files} 
        storageStats={storageStats} 
        activityStatus={activityStatus}
      />

      {/* Enhanced Header with Stats */}
      <div className="vault-header" data-aos="fade-down">
        <h1>Digital Vault</h1>
        <p className="vault-subtitle">
          Your secure digital fortress with advanced encryption and intelligent file organization
        </p>
        
        {/* Enhanced Storage Stats */}
        <div className="vault-stats" data-aos="fade-up" data-aos-delay="200">
          <div className="stat-card">
            <FaChartPie className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{Math.round((storageStats.totalSize / (1024 * 1024) / storageStats.total) * 100)}%</span>
              <span className="stat-label">Storage Used</span>
            </div>
          </div>
          <div className="stat-card">
            <FaShieldAlt className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{files.length}</span>
              <span className="stat-label">Files Secured</span>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{storageStats.starredCount}</span>
              <span className="stat-label">Starred Files</span>
            </div>
          </div>
          <div className="stat-card">
            <FaDownload className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{storageStats.totalDownloads}</span>
              <span className="stat-label">Total Downloads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="vault-categories" data-aos="fade-up" data-aos-delay="300">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`vault-category-btn${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            <FaFolder /> {cat}
            <span className="category-count">{storageStats.categories[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Enhanced Upload Section */}
      <div 
        className={`vault-upload-section${dragActive ? ' drag-active' : ''}`}
        ref={dropZoneRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-aos="fade-up" data-aos-delay="400"
      >
        <div className="upload-content">
          <FaCloudUploadAlt className="upload-icon" />
          <h3>Drag & Drop Files Here</h3>
          <p>or click to browse your files</p>
          <label className="vault-upload-label">
            <FaUpload /> Choose Files
            <input
              type="file"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span>Uploading files...</span>
          </div>
        )}
        {uploadError && <span className="vault-upload-error">{uploadError}</span>}
      </div>

      {/* Enhanced Controls */}
      <div className="vault-controls" data-aos="fade-up" data-aos-delay="500">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <select
            className="vault-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="folder-section">
          <select
            className="vault-folder-select"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="All">All Folders</option>
            {Object.keys(storageStats.folders).map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
        </div>

        <div className="sort-section">
          <select
            className="vault-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {getSortIcon()}
          </button>
        </div>

        <div className="view-section">
          <button 
            className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            Grid
          </button>
          <button 
            className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            List
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bulk-actions" data-aos="fade-up">
          <span>{selectedFiles.length} files selected</span>
          <div className="bulk-buttons">
            <button onClick={bulkDownload} className="bulk-btn">
              <FaDownload /> Download All
            </button>
            <button onClick={bulkDelete} className="bulk-btn delete">
              <FaTrash /> Delete All
            </button>
            <button onClick={() => setSelectedFiles([])} className="bulk-btn">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Files Container */}
      <div className={`vault-files-container ${viewMode}`} data-aos="fade-up" data-aos-delay="600">
        {filteredAndSortedFiles.length === 0 ? (
          <div className="vault-empty">
            <FaFolder className="empty-icon" />
            <h3>No files found</h3>
            <p>Upload some files to get started or try adjusting your search/filter</p>
          </div>
        ) : (
          filteredAndSortedFiles.map((file, index) => (
            <div 
              key={file.id} 
              className={`vault-file-card${selectedFiles.includes(file.id) ? ' selected' : ''}`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="file-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleSelection(file.id)}
                />
              </div>

              <div className="vault-file-preview">
                {file.fileType.startsWith('image/') ? (
                  <img src={file.firebaseUrl} alt={file.originalName} className="vault-file-thumb" />
                ) : file.fileType.startsWith('video/') ? (
                  <video src={file.firebaseUrl} className="vault-file-thumb" />
                ) : (
                  <div className="vault-file-icon">{getFileIcon(file.fileType)}</div>
                )}
                {file.isEncrypted && <FaUnlock className="encryption-badge" />}
              </div>

              <div className="vault-file-info">
                <div className="file-header">
                  <h3>{file.originalName}</h3>
                  <button 
                    className={`star-btn${file.isStarred ? ' starred' : ''}`}
                    onClick={() => toggleStar(file.id)}
                    title={file.isStarred ? 'Unstar' : 'Star'}
                  >
                    <FaStar />
                  </button>
                </div>
                
                <div className="file-meta">
                  <span className="file-category">{file.category}</span>
                  <span className="file-size">{file.fileSizeFormatted}</span>
                </div>

                <div className="file-folder">
                  <FaFolderOpen className="folder-icon" />
                  <span>{file.folder}</span>
                </div>

                <div className="file-type-badge">
                  {FILE_TYPES[getFileType(file.fileType)]?.label || 'File'}
                </div>

                <div className="file-stats">
                  <span className="upload-date">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="download-count">
                    <FaDownload /> {file.downloadCount}
                  </span>
                </div>
              </div>

              <div className="vault-file-actions">
                <button onClick={() => handleDownload(file)} title="Download" className="action-btn download">
                  <FaDownload />
                </button>
                <button title="Preview" className="action-btn preview">
                  <FaEye />
                </button>
                <button title="Share" className="action-btn share">
                  <FaShare />
                </button>
                <button title="Copy Link" className="action-btn copy">
                  <FaCopy />
                </button>
                <button onClick={() => handleDelete(file.id)} title="Delete" className="action-btn delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vault; 