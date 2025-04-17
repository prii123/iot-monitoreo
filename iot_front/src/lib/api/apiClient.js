// src/lib/api/apiClient.js
import { authFetch } from './interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  get: (endpoint) => authFetch(`${API_URL}${endpoint}`),
  post: (endpoint, data) => authFetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => authFetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => authFetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  }),
};