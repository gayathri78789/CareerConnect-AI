import { API_BASE_URL } from './api.js';

export async function getAdminData() {
  const res = await fetch(`${API_BASE_URL}/admin`);
  return res.json();
}
