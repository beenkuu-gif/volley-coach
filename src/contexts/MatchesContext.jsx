// volley-coach/src/contexts/MatchesContext.jsx
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MatchesContext = createContext(null);

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useLocalStorage('vc_matches', []);

  function addMatch(match) {
    setMatches((prev) => [
      ...prev,
      {
        ...match,
        id: crypto.randomUUID(),
        sets: [],
        notes: '',
        courtLineup: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
        liveStats: {},
      },
    ]);
  }

  function updateMatch(id, updater) {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updater(m) } : m))
    );
  }

  return (
    <MatchesContext.Provider value={{ matches, addMatch, updateMatch }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  return useContext(MatchesContext);
}
