// api.js - central place for all backend calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('tasknova_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  getTasks: (params = '') => request(`/tasks${params}`),
  getStats: () => request('/tasks/stats'),
  createTask: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/users/password', { method: 'PUT', body: JSON.stringify(body) }),
  updateSettings: (body) => request('/users/settings', { method: 'PUT', body: JSON.stringify(body) })
};

export const GOOGLE_LOGIN_URL = `${API_URL}/api/auth/google`;
export const FACEBOOK_LOGIN_URL = `${API_URL}/api/auth/facebook`;
