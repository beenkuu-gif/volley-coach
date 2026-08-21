// volley-coach/src/components/AttendanceScreen.jsx
import { useState, useEffect } from 'react';
import { useTrainings } from '../contexts/TrainingsContext';
import { useTeams } from '../contexts/TeamsContext';

const STATUS_OPTS = [
  { value: 'present', label: 'Obecna', color: 'var(--color-success)' },
  { value: 'late',    label: 'Spóźniona', color: 'var(--color-warning)' },
  { value: 'absent',  label: 'Nieobecna', color: 'var(--color-error)' },
];

export default function AttendanceScreen({ trainingId, onBack }) {
  const { trainings, getAttendance, setAttendance } = useTrainings();
  const { teams } = useTeams();

  const training = trainings.find((t) => t.id === trainingId);
  const team = teams.find((t) => t.id === training?.teamId);
  const players = team?.players ?? [];

  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance(trainingId).then((rows) => {
      setRecords(rows.map((r) => ({ playerId: r.playerId, status: r.status })));
    }).catch(console.error);
  }, [trainingId, getAttendance]);

  useEffect(() => {
    if (records.length === 0) return;
    setAttendance(trainingId, records).catch(console.error);
  }, [records, trainingId, setAttendance]);

  function getStatus(playerId) {
    return records.find((r) => r.playerId === playerId)?.status ?? 'absent';
  }

  function setStatus(playerId, status) {
    setRecords((prev) => {
      const exists = prev.some((r) => r.playerId === playerId);
      if (exists) return prev.map((r) => r.playerId === playerId ? { ...r, status } : r);
      return [...prev, { playerId, status }];
    });
  }

  const presentCount = records.filter((r) => r.status === 'present' || r.status === 'late').length;

  if (!training || !team) return <div className="screen"><p>Nie znaleziono treningu.</p></div>;

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Wróć</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{team.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{training.date} · {training.venue || 'brak hali'}</p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--color-accent-light)', color: 'var(--color-accent)',
          borderRadius: 20, padding: '4px 12px', fontSize: 14, fontWeight: 700, marginTop: 8,
        }}>
          Obecnych: {presentCount} / {players.length}
        </div>
      </div>

      {players.map((p) => {
        const status = getStatus(p.id);
        return (
          <div key={p.id} className="card" style={{ padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontWeight: 500 }}>#{p.number} {p.name}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {STATUS_OPTS.map((opt) => (
                  <button key={opt.value} onClick={() => setStatus(p.id, opt.value)}
                    style={{
                      padding: '5px 10px', borderRadius: 6, border: '1px solid',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: status === opt.value ? opt.color : 'transparent',
                      color: status === opt.value ? '#fff' : opt.color,
                      borderColor: opt.color,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
