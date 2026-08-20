// volley-coach/src/contexts/DrillsContext.jsx
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SEED_DRILLS } from '../data/seedData';

const DrillsContext = createContext(null);

export function DrillsProvider({ children }) {
  const [drills, setDrills] = useLocalStorage('vc_drills', SEED_DRILLS);

  function addDrill(drill) {
    setDrills((prev) => [...prev, { ...drill, id: crypto.randomUUID() }]);
  }

  return (
    <DrillsContext.Provider value={{ drills, addDrill }}>
      {children}
    </DrillsContext.Provider>
  );
}

export function useDrills() {
  return useContext(DrillsContext);
}
