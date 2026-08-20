// volley-coach/src/contexts/TrainingsContext.jsx
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TrainingsContext = createContext(null);

export function TrainingsProvider({ children }) {
  const [trainings, setTrainings] = useLocalStorage('vc_trainings', []);
  const [attendances, setAttendances] = useLocalStorage('vc_attendances', []);

  function addTraining(training) {
    setTrainings((prev) => [...prev, { ...training, id: crypto.randomUUID() }]);
  }

  function getAttendance(trainingId) {
    return attendances.find((a) => a.trainingId === trainingId) || { trainingId, records: [] };
  }

  function setAttendance(trainingId, records) {
    setAttendances((prev) => {
      const exists = prev.some((a) => a.trainingId === trainingId);
      if (exists) {
        return prev.map((a) => a.trainingId === trainingId ? { trainingId, records } : a);
      }
      return [...prev, { trainingId, records }];
    });
  }

  return (
    <TrainingsContext.Provider value={{ trainings, addTraining, getAttendance, setAttendance }}>
      {children}
    </TrainingsContext.Provider>
  );
}

export function useTrainings() {
  return useContext(TrainingsContext);
}
