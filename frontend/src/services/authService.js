import { apiClient } from './api';
import { SAMPLE_USERS } from '../data/sampleData';

const CURRENT_USER_KEY = 'nammafix_current_user';

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    const defaultUser = SAMPLE_USERS[0];
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  async login(email, _password) {
    try {
      const res = await apiClient.post('/auth/sync', {
        email,
        name: email.split('@')[0],
      });
      if (res?.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('Backend sync unavailable during login:', err.message);
    }

    const matched = SAMPLE_USERS.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    );
    const user = matched || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || 'Citizen',
      email: email,
      phone: '9876543210',
      role: email.includes('admin') ? 'admin' : 'citizen',
      language: 'en',
      location: 'Chennai, Tamil Nadu',
      createdAt: new Date().toISOString(),
    };
    this.setCurrentUser(user);
    return user;
  },

  async loginWithGoogle() {
    try {
      const user = SAMPLE_USERS[0];
      const res = await apiClient.post('/auth/sync', {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
      if (res?.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('Backend sync unavailable during Google login:', err.message);
    }

    const user = SAMPLE_USERS[0];
    this.setCurrentUser(user);
    return user;
  },

  async register(data) {
    try {
      const res = await apiClient.post('/auth/sync', data);
      if (res?.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('Backend sync unavailable during register:', err.message);
    }

    const user = {
      id: `usr_${Date.now()}`,
      name: data.name || 'New Citizen',
      email: data.email,
      phone: data.phone || '9876543210',
      role: 'citizen',
      language: data.language || 'en',
      location: data.location || 'Chennai, Tamil Nadu',
      createdAt: new Date().toISOString(),
    };
    this.setCurrentUser(user);
    return user;
  },

  async updateUser(updates) {
    try {
      const res = await apiClient.patch('/auth/me', updates);
      if (res?.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('Backend update unavailable:', err.message);
    }

    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.setCurrentUser(updated);
    return updated;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  switchRole(role) {
    if (role === 'admin') {
      const admin = SAMPLE_USERS.find((u) => u.role === 'admin');
      this.setCurrentUser(admin);
      return admin;
    } else {
      const citizen = SAMPLE_USERS.find((u) => u.role === 'citizen');
      this.setCurrentUser(citizen);
      return citizen;
    }
  },
};
