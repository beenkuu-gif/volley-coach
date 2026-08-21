const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let token = localStorage.getItem('vc_token') ?? null;

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.error ?? `HTTP ${res.status}` };
  return data;
}

const api = {
  get:   (path)        => request('GET',    path),
  post:  (path, body)  => request('POST',   path, body),
  put:   (path, body)  => request('PUT',    path, body),
  patch: (path, body)  => request('PATCH',  path, body),
  del:   (path)        => request('DELETE', path),
  setToken(t)  { token = t; localStorage.setItem('vc_token', t); },
  clearToken() { token = null; localStorage.removeItem('vc_token'); },
};

export default api;
