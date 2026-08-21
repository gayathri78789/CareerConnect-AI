export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('careerprep_token') || '';
  const userId = localStorage.getItem('careerprep_userid') || '';
  const userName = localStorage.getItem('careerprep_username') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    'x-user-id': userId,
    'x-user-name': encodeURIComponent(userName),
  };
}
