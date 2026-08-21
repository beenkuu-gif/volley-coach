import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vc_token');
    if (!token) { setLoading(false); return; }
    api.setToken(token);
    api.get('/api/auth/me')
      .then((u) => setUser(u))
      .catch(() => api.clearToken())
      .finally(() => setLoading(false));
  }, []);

  function login(token, userData) {
    api.setToken(token);
    setUser(userData);
  }

  function logout() {
    api.clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
