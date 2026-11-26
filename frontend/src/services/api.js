// Base HTTP client configured for backend requests with auth headers
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  try {
    const stored = localStorage.getItem('nammafix_current_user');
    if (stored) {
      const user = JSON.parse(stored);
      return {
        'x-user-email': user.email || '',
        'x-user-id': user.id || user._id || '',
        'Authorization': `Bearer ${user.token || 'dev-token'}`,
      };
    }
  } catch {
    // ignore
  }
  return {};
};

export const apiClient = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint, body, options = {}) {
    const isFormData = body instanceof FormData;
    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async patch(endpoint, body, options = {}) {
    const isFormData = body instanceof FormData;
    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};
