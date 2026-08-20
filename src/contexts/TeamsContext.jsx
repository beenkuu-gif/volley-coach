// volley-coach/src/contexts/TeamsContext.jsx
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SEED_TEAMS } from '../data/seedData';

const TeamsContext = createContext(null);

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useLocalStorage('vc_teams', SEED_TEAMS);

  function addTeam(name) {
    setTeams((prev) => [...prev, { id: crypto.randomUUID(), name, players: [] }]);
  }

  function addPlayer(teamId, player) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, players: [...t.players, { ...player, id: crypto.randomUUID() }] }
          : t
      )
    );
  }

  return (
    <TeamsContext.Provider value={{ teams, addTeam, addPlayer }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  return useContext(TeamsContext);
}
