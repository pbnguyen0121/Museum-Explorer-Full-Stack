// my-app/lib/userData.js
import { getToken } from '@/lib/authenticate';

const API = process.env.NEXT_PUBLIC_API_URL; // http://localhost:8080/api/user

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `JWT ${getToken()}`
  };
}

/* ---------- FAVOURITES ---------- */
export async function getFavourites() {
  const res = await fetch(`${API}/favourites`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to fetch favourites');
  return res.json();
}

export async function addFavourite(objectID) {
  const res = await fetch(`${API}/favourites/${objectID}`, {
    method: 'PUT',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Unable to add favourite');
  return res.json(); // server returns full list
}

export async function removeFavourite(objectID) {
  const res = await fetch(`${API}/favourites/${objectID}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Unable to remove favourite');
  return res.json(); // server returns full list
}

/* ---------- HISTORY ---------- */
export async function getHistory() {
  const res = await fetch(`${API}/history`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to fetch history');
  return res.json(); // array of query strings
}

export async function addHistory(queryString) {
  const res = await fetch(`${API}/history/${encodeURIComponent(queryString)}`, {
    method: 'PUT',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Unable to add history');
  return res.json(); // server returns full list
}

export async function removeHistory(queryString) {
  const res = await fetch(`${API}/history/${encodeURIComponent(queryString)}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Unable to remove history');
  return res.json(); // server returns full list
}

/* ---------- Aliases để tương thích tên cũ (nếu file khác đang import) ---------- */
export async function addToFavourites(objectID) {
  return addFavourite(objectID);
}
export async function removeFromFavourites(objectID) {
  return removeFavourite(objectID);
}
export async function addToHistory(queryString) {
  return addHistory(queryString);
}
export async function removeFromHistory(queryString) {
  return removeHistory(queryString);
}
