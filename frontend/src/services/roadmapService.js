import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getRoadmap() {
  const res = await fetch(`${API_BASE_URL}/roadmap`, { headers: getAuthHeaders() });
  return res.json();
}

export async function generateRoadmap(targetRole, targetCompany) {
  const response = await fetch(`${API_BASE_URL}/roadmap/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetRole, targetCompany }),
  });
  if (response.ok) return response.json();
  const errData = await response.json().catch(() => ({}));
  throw new Error(errData.error || 'Failed to generate roadmap. Please try again.');
}

export async function toggleMilestone(id, done) {
  const response = await fetch(`${API_BASE_URL}/roadmap/milestones/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ done }),
  });
  if (response.ok) return response.json();
  throw new Error('Failed to update milestone');
}
