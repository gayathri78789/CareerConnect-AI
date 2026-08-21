import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getLatestAnalysis() {
  const res = await fetch(`${API_BASE_URL}/jd-analyzer`, { headers: getAuthHeaders() });
  return res.json();
}

export async function analyzeJobDescription(jobDescription) {
  const response = await fetch(`${API_BASE_URL}/jd-analyzer`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ jobDescription }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to analyze Job Description.');
  return data;
}
