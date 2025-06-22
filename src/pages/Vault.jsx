import { useState, useEffect } from 'react';
import { FaFolder, FaUsers, FaLock, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Vault.css';

// Mock data for vaults. In a real app, this would be fetched from the backend.
const mockVaults = [
  {
    id: '1',
    name: 'Personal Documents',
    description: 'Private documents and identification. Contains passports, birth certificates, and other personal files.',
    access: 'Private',
    fileCount: 12,
    size: '128 MB',
    owner: 'You'
  },
  {
    id: '2',
    name: 'Project Phoenix',
    description: 'All assets and documents for Project Phoenix. Shared with the design and development teams.',
    access: 'Collaborative',
    fileCount: 87,
    size: '1.2 GB',
    owner: 'You'
  },
  {
    id: '3',
    name: 'Family Memories',
    description: 'A shared collection of family photos and videos from various trips and events.',
    access: 'Collaborative',
    fileCount: 432,
    size: '5.6 GB',
    owner: 'John Doe'
  },
  {
    id: '4',
    name: 'Financial Records',
    description: 'Tax documents, invoices, and financial statements for the past five years.',
    access: 'Private',
    fileCount: 45,
    size: '256 MB',
    owner: 'You'
  }
];

const Vault = () => {
  const { currentUser } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // In a real app, you would fetch the user's vaults from an API
      // For now, we'll use mock data to represent the new structure
      setVaults(mockVaults);
      setLoading(false);
    } else {
      console.log('No currentUser, not loading vault data');
      setLoading(false); // Stop loading even if there's no user
    }
  }, [currentUser]);

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
    <div className="vault-page">
      <div className="vault-header" data-aos="fade-down">
        <h1>My Vaults</h1>
        <p className="vault-subtitle">
          Securely organize, store, and share your most important digital assets.
        </p>
        <button className="create-vault-btn">
          <FaPlus /> Create New Vault
        </button>
      </div>

      <div className="vault-list-container" data-aos="fade-up" data-aos-delay="200">
        {vaults.map((vault, index) => (
          <div key={vault.id} className="vault-card" data-aos="fade-up" data-aos-delay={100 * index}>
            <div className="vault-card-header">
              <FaFolder className="vault-icon" />
              <h2 className="vault-name">{vault.name}</h2>
            </div>
            <p className="vault-description">{vault.description}</p>
            <div className="vault-meta">
              <span className={`vault-access ${vault.access.toLowerCase()}`}>
                {vault.access === 'Private' ? <FaLock /> : <FaUsers />}
                {vault.access}
              </span>
              <span className="vault-file-count">{vault.fileCount} files</span>
              <span className="vault-size">{vault.size}</span>
            </div>
            <div className="vault-footer">
              <span className="vault-owner">Owner: {vault.owner}</span>
              <button className="open-vault-btn">Open Vault</button>
            </div>
          </div>
        ))}

        {vaults.length === 0 && !loading && (
          <div className="empty-vaults-message">
            <h3>No vaults found.</h3>
            <p>Get started by creating your first vault.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vault;