import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getInterviewReport(interviewId) {
  if (!interviewId) return null;
  const res = await fetch(`${API_BASE_URL}/interview-report?interviewId=${encodeURIComponent(interviewId)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function startInterview(payload) {
  const res = await fetch(`${API_BASE_URL}/interview/start`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function evaluateInterview(payload) {
  const response = await fetch(`${API_BASE_URL}/interview/evaluate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Evaluation failed');
  return data;
}
