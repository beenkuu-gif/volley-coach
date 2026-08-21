import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TrainingsContext = createContext(null);

export function TrainingsProvider({ children }) {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    api.get('/api/trainings').then(setTrainings).catch(console.error);
  }, []);

  const addTraining = useCallback(async (training) => {
    const created = await api.post('/api/trainings', training);
    setTrainings((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTraining = useCallback(async (id, updates) => {
    const updated = await api.put(`/api/trainings/${id}`, updates);
    setTrainings((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTraining = useCallback(async (id) => {
    await api.del(`/api/trainings/${id}`);
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getAttendance = useCallback(async (trainingId) => {
    return api.get(`/api/trainings/${trainingId}/attendance`);
  }, []);

  const setAttendance = useCallback(async (trainingId, records) => {
    return api.put(`/api/trainings/${trainingId}/attendance`, { records });
  }, []);

  return (
    <TrainingsContext.Provider value={{ trainings, addTraining, updateTraining, deleteTraining, getAttendance, setAttendance }}>
      {children}
    </TrainingsContext.Provider>
  );
}

export function useTrainings() {
  return useContext(TrainingsContext);
}
