// volley-coach/src/components/TrainingList.jsx
import { useState } from 'react';
import { useTrainings } from '../contexts/TrainingsContext';
import { useTeams } from '../contexts/TeamsContext';
import { useDrills } from '../contexts/DrillsContext';
import TrainingCreator from './TrainingCreator';
import AttendanceScreen from './AttendanceScreen';

export default function TrainingList() {
  const { trainings } = useTrainings();
  const { teams } = useTeams();
  const { drills } = useDrills();
  const [view, setView] = useState('list'); // 'list' | 'creator' | 'detail' | 'attendance'
  const [selectedId, setSelectedId] = useState(null);

  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '—';
  const totalMin = (blocks) => blocks.reduce((s, b) => s + (b.durationMin || 0), 0);
  const drillName = (id) => drills.find((d) => d.id === id)?.name ?? id;

  const selected = trainings.find((t) => t.id === selectedId);

  if (view === 'creator') {
    return <TrainingCreator onBack={() => setView('list')} />;
  }

  if (view === 'attendance' && selectedId) {
    return <AttendanceScreen trainingId={selectedId} onBack={() => setView('detail')} />;
  }

  if (view === 'detail' && selected) {
    return (
      <div className="screen">
        <div className="top-bar" style={{ marginBottom: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setView('list')}>← Treningi</button>
          <button className="btn btn-primary btn-sm" onClick={() => setView('attendance')}>Obecności</button>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{teamName(selected.teamId)}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 4 }}>{selected.date} · {selected.venue || 'brak hali'}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 16 }}>Łącznie: {totalMin(selected.blocks)} min</p>

        {selected.blocks.map((block) => (
          <div key={block.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>{block.name}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{block.durationMin} min</span>
            </div>
            {block.drillIds.length === 0
              ? <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Brak ćwiczeń</p>
              : block.drillIds.map((id) => (
                <div key={id} style={{ fontSize: 13, padding: '4px 0', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>
                  {drillName(id)}
                </div>
              ))
            }
          </div>
        ))}
      </div>
    );
  }

  const sorted = [...trainings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 16 }}>
        <h1>Treningi</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setView('creator')}>+ Nowy</button>
      </div>

      {sorted.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 40 }}>Brak zapisanych treningów</p>
      )}

      {sorted.map((t) => (
        <div key={t.id} className="card" style={{ padding: 14, marginBottom: 10, cursor: 'pointer' }}
          onClick={() => { setSelectedId(t.id); setView('detail'); }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{teamName(t.teamId)}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{t.date} · {t.venue || 'brak hali'}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--color-text-muted)' }}>
              <div>{t.blocks.length} bloków</div>
              <div>{totalMin(t.blocks)} min</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
