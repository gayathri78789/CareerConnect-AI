import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard`, { headers: getAuthHeaders() });
  if (response.ok) return response.json();
  throw new Error('Failed to load dashboard');
}

export async function addGoal(title) {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  if (response.ok) return response.json();
  throw new Error('Failed to add goal');
}

export async function updateGoal(goalId, done) {
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ done }),
  });
  if (response.ok) return response.json();
  throw new Error('Failed to update goal');
}

export async function deleteGoal(goalId) {
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (response.ok) return response.json();
  throw new Error('Failed to delete goal');
}

export async function getActivityLog(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/activity${query ? `?${query}` : ''}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (response.ok) return response.json();
  throw new Error('Failed to load activity log');
}
