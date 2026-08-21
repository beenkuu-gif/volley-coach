// volley-coach/src/contexts/MatchesContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const MatchesContext = createContext(null);

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get('/api/matches').then(setMatches).catch(console.error);
  }, []);

  const addMatch = useCallback(async (match) => {
    const created = await api.post('/api/matches', match);
    setMatches((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateMatch = useCallback(async (id, updater) => {
    setMatches((prev) => {
      const match = prev.find((m) => m.id === id);
      if (!match) return prev;
      const updates = typeof updater === 'function' ? updater(match) : updater;
      const updated = { ...match, ...updates };
      // Async API sync — fire and forget, UI updates immediately
      api.put(`/api/matches/${id}`, updates).catch(console.error);
      return prev.map((m) => (m.id === id ? updated : m));
    });
  }, []);

  const deleteMatch = useCallback(async (id) => {
    await api.del(`/api/matches/${id}`);
    setMatches((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <MatchesContext.Provider value={{ matches, addMatch, updateMatch, deleteMatch }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  return useContext(MatchesContext);
}
