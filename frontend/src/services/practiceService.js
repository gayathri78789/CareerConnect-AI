import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getPractice() {
  const res = await fetch(`${API_BASE_URL}/practice`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getUserPracticeStats() {
  const res = await fetch(`${API_BASE_URL}/user/practice-stats`, { headers: getAuthHeaders() });
  return res.json();
}

export async function updateCareerTrack(careerTrack) {
  const res = await fetch(`${API_BASE_URL}/practice/career`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ careerTrack }),
  });
  return res.json();
}

export async function getCodingQuestions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/practice/coding?${query}`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getRandomCodingQuestion(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/practice/coding/random?${query}`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getCodingTopics(career) {
  const query = career ? `?career=${encodeURIComponent(career)}` : '';
  const res = await fetch(`${API_BASE_URL}/practice/coding/topics${query}`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getCodingHistory() {
  const res = await fetch(`${API_BASE_URL}/practice/coding/history`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getAptitudeQuestions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/practice/aptitude?${query}`, { headers: getAuthHeaders() });
  return res.json();
}

export async function getRandomAptitudeQuestion(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/practice/aptitude/random?${query}`, { headers: getAuthHeaders() });
  return res.json();
}

export async function submitPractice(payload) {
  const res = await fetch(`${API_BASE_URL}/practice/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}
