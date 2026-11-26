import { apiClient } from './api';

export const uploadService = {
  async uploadImage(file) {
    if (!file) {
      throw new Error('No image file provided');
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiClient.post('/upload', formData);
      return res.url || res;
    } catch (err) {
      console.warn('Live image upload failed, falling back to local FileReader:', err.message);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }
  },
};
