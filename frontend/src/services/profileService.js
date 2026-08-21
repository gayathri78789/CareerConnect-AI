import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() });
  return res.json();
}

export async function updateProfile(payload) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to save profile');
  return data;
}

export async function uploadProfilePhoto(fileOrPayload) {
  const headers = getAuthHeaders();
  let body;

  if (fileOrPayload instanceof File) {
    body = new FormData();
    body.append('file', fileOrPayload);
    delete headers['Content-Type']; // Let browser set boundary
  } else if (typeof fileOrPayload === 'string') {
    body = JSON.stringify({ base64: fileOrPayload });
  } else {
    body = JSON.stringify(fileOrPayload);
  }

  const res = await fetch(`${API_BASE_URL}/profile/photo`, {
    method: 'POST',
    headers,
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload profile photo');
  return data;
}

export async function getProfilePhoto() {
  const res = await fetch(`${API_BASE_URL}/profile/photo`, { headers: getAuthHeaders() });
  return res.json();
}

export async function deleteProfilePhoto() {
  const res = await fetch(`${API_BASE_URL}/profile/photo`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete profile photo');
  return data;
}
