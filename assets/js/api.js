/* ============================================================
   RDVPrefectureFacile — Client API
   ============================================================ */

const API_URL = 'https://rdvprefecturefacile-backend-production.up.railway.app';

function getToken() {
  return localStorage.getItem('rdv_token');
}

function setToken(token) {
  localStorage.setItem('rdv_token', token);
}

function setUser(user) {
  localStorage.setItem('rdv_user', JSON.stringify(user));
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('rdv_user')); } catch { return null; }
}

function logout() {
  localStorage.removeItem('rdv_token');
  localStorage.removeItem('rdv_user');
  window.location.href = 'connexion.html';
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = 'connexion.html';
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

/* ── Auth ── */
async function register({ email, password, first_name, last_name, phone }) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, first_name, last_name, phone })
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

async function login({ email, password }) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

async function getMe() {
  return apiFetch('/api/auth/me');
}

/* ── Alertes ── */
async function getAlerts() {
  const data = await apiFetch('/api/alerts');
  return data.alerts;
}

async function createAlert({ prefecture, prefecture_url, demarche }) {
  return apiFetch('/api/alerts', {
    method: 'POST',
    body: JSON.stringify({ prefecture, prefecture_url, demarche })
  });
}

async function deleteAlert(id) {
  return apiFetch(`/api/alerts/${id}`, { method: 'DELETE' });
}

/* ── Paiement Stripe ── */
async function redirectToCheckout() {
  const data = await apiFetch('/api/alerts/checkout', {
    method: 'POST',
    body: JSON.stringify({
      success_url: window.location.origin + '/tableau-de-bord.html?paiement=ok',
      cancel_url:  window.location.origin + '/paiement.html'
    })
  });
  window.location.href = data.url;
}

async function redirectToPortal() {
  const data = await apiFetch('/api/alerts/portal', {
    method: 'POST',
    body: JSON.stringify({ return_url: window.location.origin + '/tableau-de-bord.html' })
  });
  window.location.href = data.url;
}

window.API = {
  getToken, setToken, getUser, setUser, logout, requireAuth,
  register, login, getMe,
  getAlerts, createAlert, deleteAlert,
  redirectToCheckout, redirectToPortal
};
