const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';
const AUTH_KEY = 'suky_auth';

const readAuth = () => {
  if (typeof localStorage === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeAuth = (auth) => {
  if (typeof localStorage === 'undefined') return;
  if (!auth) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('suky_user');
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  if (auth.user) {
    localStorage.setItem('suky_user', JSON.stringify({
      email: auth.user.email,
      displayName: auth.user.display_name ?? auth.user.displayName ?? auth.user.email,
      token: auth.accessToken,
    }));
  }
};

async function request(path, options = {}) {
  const auth = readAuth();
  const headers = new Headers(options.headers ?? {});
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth?.accessToken) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sukyai:unauthorized'));
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  readAuth,
  writeAuth,
};
