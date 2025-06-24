import api from './api';

// Vault Management
export const createVault = async (vaultData) => {
  try {
    const response = await api.post('/vaults', vaultData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVaults = async () => {
  try {
    console.log('Fetching all vaults...');
    const response = await api.get('/vaults/all');
    console.log('Vaults response:', response);
    return response.data;
  } catch (error) {
    console.error('Get vaults error:', error);
    throw error;
  }
};

export const getVaultById = async (vaultId) => {
  try {
    const response = await api.get(`/vaults/${vaultId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVault = async (vaultId, vaultData) => {
  try {
    const response = await api.put(`/vaults/${vaultId}`, vaultData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVault = async (vaultId) => {
  try {
    const response = await api.delete(`/vaults/${vaultId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Vault Content Management
export const uploadToVault = async (vaultId, file, description = '') => {
  try {
    console.log('vaultService.uploadToVault called with:', {
      vaultId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      description
    });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    
    console.log('FormData created, making API call to:', `/vaults/${vaultId}/upload`);
    
    const response = await api.post(`/vaults/${vaultId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Upload API response:', response);
    return response.data;
  } catch (error) {
    console.error('vaultService.uploadToVault error:', error);
    throw error;
  }
};

export const addTextToVault = async (vaultId, textData) => {
  try {
    const response = await api.post(`/vaults/${vaultId}/text`, textData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVaultContent = async (vaultId) => {
  try {
    const response = await api.get(`/vaults/${vaultId}/content`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVaultContent = async (vaultId, contentId) => {
  try {
    const response = await api.delete(`/vaults/${vaultId}/content/${contentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Collaboration Management
export const sendCollaborationInvite = async (vaultId, email) => {
  try {
    console.log('Sending collaboration invite for vault:', vaultId, 'to email:', email);
    const response = await api.post(`/vaults/${vaultId}/collaboration-requests`, { email });
    console.log('Send collaboration invite response:', response);
    return response.data;
  } catch (error) {
    console.error('Send collaboration invite error:', error);
    throw error;
  }
};

export const getCollaborators = async (vaultId) => {
  try {
    const response = await api.get(`/vaults/${vaultId}/collaborators`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCollaborator = async (vaultId, collaboratorId) => {
  try {
    const response = await api.delete(`/vaults/${vaultId}/collaborators/${collaboratorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCollaboratorRole = async (vaultId, collaboratorId, role) => {
  try {
    const response = await api.patch(`/vaults/${vaultId}/collaborators/${collaboratorId}`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollaborationRequests = async () => {
  try {
    console.log('Fetching collaboration requests...');
    const response = await api.get('/collaboration-requests');
    console.log('Collaboration requests response:', response);
    return response.data;
  } catch (error) {
    console.error('Get collaboration requests error:', error);
    throw error;
  }
};

export const acceptInviteByToken = async (token) => {
  try {
    console.log('Accepting invitation with token:', token);
    const response = await api.post('/collaboration-requests/accept', { token });
    console.log('Accept invitation response:', response);
    return response.data;
  } catch (error) {
    console.error('Accept invitation error:', error);
    throw error;
  }
};

export const rejectInviteByToken = async (token) => {
  try {
    console.log('Rejecting invitation with token:', token);
    const response = await api.post('/collaboration-requests/reject', { token });
    console.log('Reject invitation response:', response);
    return response.data;
  } catch (error) {
    console.error('Reject invitation error:', error);
    throw error;
  }
};

// Search and Filter
export const searchVaultContent = async (vaultId, searchQuery) => {
  try {
    const response = await api.get(`/vaults/${vaultId}/search`, {
      params: { q: searchQuery }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVaultStats = async (vaultId) => {
  try {
    const response = await api.get(`/vaults/${vaultId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollaboratedVaults = async () => {
  try {
    console.log('Fetching collaborated vaults...');
    const response = await api.get('/vaults/collaborated');
    console.log('Collaborated vaults response:', response);
    return response.data;
  } catch (error) {
    console.error('Get collaborated vaults error:', error);
    throw error;
  }
}; 