import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TeamsContext = createContext(null);

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('/api/teams').then(setTeams).catch(console.error);
  }, []);

  const addTeam = useCallback(async (name) => {
    const created = await api.post('/api/teams', { name });
    setTeams((prev) => [...prev, created]);
    return created;
  }, []);

  const updateTeam = useCallback(async (id, name) => {
    const updated = await api.put(`/api/teams/${id}`, { name });
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name: updated.name } : t)));
  }, []);

  const deleteTeam = useCallback(async (id) => {
    await api.del(`/api/teams/${id}`);
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addPlayer = useCallback(async (teamId, player) => {
    const created = await api.post(`/api/teams/${teamId}/players`, player);
    setTeams((prev) => prev.map((t) =>
      t.id === teamId ? { ...t, players: [...(t.players ?? []), created] } : t
    ));
    return created;
  }, []);

  const updatePlayer = useCallback(async (teamId, playerId, player) => {
    const updated = await api.put(`/api/teams/${teamId}/players/${playerId}`, player);
    setTeams((prev) => prev.map((t) =>
      t.id === teamId
        ? { ...t, players: t.players.map((p) => (p.id === playerId ? updated : p)) }
        : t
    ));
  }, []);

  const deletePlayer = useCallback(async (teamId, playerId) => {
    await api.del(`/api/teams/${teamId}/players/${playerId}`);
    setTeams((prev) => prev.map((t) =>
      t.id === teamId ? { ...t, players: t.players.filter((p) => p.id !== playerId) } : t
    ));
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, addTeam, updateTeam, deleteTeam, addPlayer, updatePlayer, deletePlayer }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  return useContext(TeamsContext);
}
