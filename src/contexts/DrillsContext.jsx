import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DrillsContext = createContext(null);

export function DrillsProvider({ children }) {
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/drills')
      .then(setDrills)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addDrill = useCallback(async (drill) => {
    const created = await api.post('/api/drills', drill);
    setDrills((prev) => [...prev, created]);
    return created;
  }, []);

  const updateDrill = useCallback(async (id, updates) => {
    const updated = await api.put(`/api/drills/${id}`, updates);
    setDrills((prev) => prev.map((d) => (d.id === id ? updated : d)));
  }, []);

  const deleteDrill = useCallback(async (id) => {
    await api.del(`/api/drills/${id}`);
    setDrills((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <DrillsContext.Provider value={{ drills, addDrill, updateDrill, deleteDrill, loading }}>
      {children}
    </DrillsContext.Provider>
  );
}

export function useDrills() {
  return useContext(DrillsContext);
}
