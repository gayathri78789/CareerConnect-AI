import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getSettings() {
  const res = await fetch(`${API_BASE_URL}/settings`, { headers: getAuthHeaders() });
  return res.json();
}

export async function updateSettings(payload) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to save settings');
  return data;
}
