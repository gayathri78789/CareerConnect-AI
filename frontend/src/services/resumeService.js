import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getResume() {
  const res = await fetch(`${API_BASE_URL}/resume`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load resume');
  return res.json();
}

export async function buildResumeWithAI() {
  const res = await fetch(`${API_BASE_URL}/resume/build`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to build resume with AI');
  }
  return res.json();
}

export async function updateResume(payload) {
  const res = await fetch(`${API_BASE_URL}/resume`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return res.json();
}

export async function restoreResumeVersion(versionId) {
  const res = await fetch(`${API_BASE_URL}/resume/restore-version`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ versionId }),
  });
  if (!res.ok) throw new Error('Failed to restore resume version');
  return res.json();
}

export async function optimizeResume(resumeText, targetRole) {
  const response = await fetch(`${API_BASE_URL}/resume/optimize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ resumeText, targetRole }),
  });
  return response.json();
}

export async function uploadProfileResume(fileOrPayload) {
  const headers = getAuthHeaders();
  let body;

  if (fileOrPayload instanceof File) {
    body = new FormData();
    body.append('file', fileOrPayload);
    delete headers['Content-Type'];
  } else if (typeof fileOrPayload === 'string') {
    body = JSON.stringify({ base64: fileOrPayload });
  } else {
    body = JSON.stringify(fileOrPayload);
  }

  const res = await fetch(`${API_BASE_URL}/profile/resume`, {
    method: 'POST',
    headers,
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload resume');
  return data;
}

export async function getProfileResume() {
  const res = await fetch(`${API_BASE_URL}/profile/resume`, { headers: getAuthHeaders() });
  return res.json();
}

export async function deleteProfileResume() {
  const res = await fetch(`${API_BASE_URL}/profile/resume`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete resume');
  return data;
}
