import api from './api';

export const settingsService = {
  // Get settings
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings (admin only)
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
};