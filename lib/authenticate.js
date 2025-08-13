import jwt_decode from 'jwt-decode';

const API = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = 'token';

export function setToken(token) {
  if (typeof window !== 'undefined' && token) localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function removeToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}
export function readToken() {
  const t = getToken();
  if (!t) return null;
  try { return jwt_decode(t); } catch { return null; }
}
export function getUsername() {
  const t = readToken();
  return t?.userName || null;
}
export function isAuthenticated() {
  return !!getToken();
}

export async function authenticateUser(userName, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });
  if (!res.ok) {
    let msg = 'Login failed';
    try { const j = await res.json(); msg = j.message || msg; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  const token = data?.token || data?.message?.token;
  if (!token) throw new Error('No token returned');
  setToken(token);
  return true;
}

export async function registerUser(userName, password, password2) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password, password2 }),
  });
  if (!res.ok) {
    let msg = 'Register failed';
    try { const j = await res.json(); msg = j.message || msg; } catch {}
    throw new Error(msg);
  }
  return true;
}
