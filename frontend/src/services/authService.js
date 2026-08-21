import { API_BASE_URL } from './api.js';

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return response.json();
  }
  throw new Error('Session invalid');
}

export async function submitAuth(form, isLogin) {
  const response = await fetch(`${API_BASE_URL}/auth/${isLogin ? 'login' : 'register'}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  return data;
}
