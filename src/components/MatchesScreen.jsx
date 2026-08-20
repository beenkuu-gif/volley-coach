// src/components/MatchesScreen.jsx
import { useState } from 'react';
import { useMatches } from '../contexts/MatchesContext';
import { useTeams } from '../contexts/TeamsContext';
import { matchScore } from '../utils/stats';
import BottomSheet from './BottomSheet';
import MatchDetail from './MatchDetail';

export default function MatchesScreen() {
  const { matches, addMatch } = useMatches();
  const { teams } = useTeams();

  const [filterTeamId, setFilterTeamId] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ teamId: teams[0]?.id ?? '', opponent: '', date: new Date().toISOString().slice(0, 10) });
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.opponent.trim() || !form.teamId) return;
    addMatch(form);
    setForm({ teamId: teams[0]?.id ?? '', opponent: '', date: new Date().toISOString().slice(0, 10) });
    setShowAdd(false);
  }

  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '—';

  if (selectedMatchId) {
    return <MatchDetail matchId={selectedMatchId} onBack={() => setSelectedMatchId(null)} />;
  }

  const filtered = matches.filter((m) => filterTeamId === 'all' || m.teamId === filterTeamId);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 10 }}>
        <h1>Mecze</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Mecz</button>
      </div>

      {/* Team filter */}
      <div className="chip-row">
        <button className={`chip ${filterTeamId === 'all' ? 'active' : ''}`} onClick={() => setFilterTeamId('all')}>Wszystkie</button>
        {teams.map((t) => (
          <button key={t.id} className={`chip ${filterTeamId === t.id ? 'active' : ''}`} onClick={() => setFilterTeamId(t.id)}>{t.name}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {sorted.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 40 }}>Brak meczów</p>
        )}
        {sorted.map((m) => {
          const score = matchScore(m.sets);
          const won = score.us > score.them;
          const hasResult = m.sets.length > 0;
          return (
            <div key={m.id} className="card" style={{ padding: 14, marginBottom: 10, cursor: 'pointer' }}
              onClick={() => setSelectedMatchId(m.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>vs {m.opponent}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 2 }}>{teamName(m.teamId)} · {m.date}</div>
                </div>
                {hasResult && (
                  <div style={{
                    fontWeight: 800, fontSize: 18,
                    color: won ? 'var(--color-success)' : 'var(--color-error)',
                  }}>
                    {score.us}:{score.them}
                  </div>
                )}
                {!hasResult && (
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Brak wyniku</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BottomSheet isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nowy mecz">
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Drużyna</label>
            <select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Rywal</label>
            <input value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} placeholder="KS Warszawa" autoFocus />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Dodaj mecz</button>
        </form>
      </BottomSheet>
    </div>
  );
}
