// volley-coach/src/components/CourtView.jsx
import { useState, useCallback, useRef } from 'react';
import { useMatches } from '../contexts/MatchesContext';
import { rotateCourt, emptyPlayerStats } from '../utils/stats';

const ACTION_OUTCOMES = {
  serve:     [{ key: 'ace', label: 'Ace', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }, { key: 'inPlay', label: 'W grze', color: '#6b7280' }],
  attack:    [{ key: 'kill', label: 'Zabita', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }, { key: 'blocked', label: 'Blok', color: '#f59e0b' }, { key: 'inPlay', label: 'W grze', color: '#6b7280' }],
  block:     [{ key: 'point', label: 'Punkt', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
  reception: [{ key: 'perfect', label: 'Doskonałe', color: '#10b981' }, { key: 'good', label: 'Dobre', color: '#3b82f6' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
  defense:   [{ key: 'success', label: 'Udana', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
};

const ACTION_LABELS = {
  serve: 'Zagrywka', attack: 'Atak', block: 'Blok', reception: 'Przyjęcie', defense: 'Obrona',
};

// Position layout: [position_number, grid-row, grid-col]
const POSITIONS = [
  { pos: 4, row: 1, col: 1 }, { pos: 3, row: 1, col: 2 }, { pos: 2, row: 1, col: 3 },
  { pos: 5, row: 2, col: 1 }, { pos: 6, row: 2, col: 2 }, { pos: 1, row: 2, col: 3 },
];

export default function CourtView({ matchId, team, onBack }) {
  const { matches, updateMatch } = useMatches();
  const match = matches.find((m) => m.id === matchId);
  const players = team?.players ?? [];

  const [lineup, setLineup] = useState(match?.courtLineup ?? { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  const [setupMode, setSetupMode] = useState(Object.values(match?.courtLineup ?? {}).every((v) => !v));

  const [selectedPos, setSelectedPos] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [flash, setFlash] = useState(null); // position number that flashed
  const [setScore, setSetScore] = useState({ us: 0, them: 0 });
  const flashTimer = useRef(null);

  function saveLineup() {
    updateMatch(matchId, (m) => {
      const stats = { ...m.liveStats };
      Object.values(lineup).forEach((pid) => {
        if (pid && !stats[pid]) stats[pid] = emptyPlayerStats();
      });
      return { courtLineup: lineup, liveStats: stats };
    });
    setSetupMode(false);
  }

  function handleRotate() {
    const rotated = rotateCourt(lineup);
    setLineup(rotated);
    updateMatch(matchId, () => ({ courtLineup: rotated }));
  }

  function recordAction(outcome) {
    if (!selectedPos || !selectedAction) return;
    const playerId = lineup[selectedPos];
    if (!playerId) return;

    updateMatch(matchId, (m) => {
      const prevStats = m.liveStats?.[playerId] ?? emptyPlayerStats();
      const prevCat = prevStats[selectedAction];
      const updated = {
        ...prevStats,
        [selectedAction]: {
          ...prevCat,
          total: prevCat.total + 1,
          [outcome]: (prevCat[outcome] ?? 0) + 1,
        },
      };
      return { liveStats: { ...m.liveStats, [playerId]: updated } };
    });

    clearTimeout(flashTimer.current);
    setFlash(selectedPos);
    flashTimer.current = setTimeout(() => setFlash(null), 400);
    setSelectedPos(null);
    setSelectedAction(null);
  }

  const playerAtPos = (pos) => {
    const pid = lineup[pos];
    return players.find((p) => p.id === pid);
  };

  if (setupMode) {
    return (
      <div className="screen">
        <div className="top-bar" style={{ marginBottom: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Wróć</button>
          <h1 style={{ fontSize: 17 }}>Ustawianie składu</h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', padding: '0 16px', marginBottom: 16, fontSize: 14 }}>
          Przypisz zawodniczki do pozycji przed meczem.
        </p>
        {POSITIONS.map(({ pos }) => (
          <div key={pos} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--color-accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 15, flexShrink: 0,
            }}>{pos}</div>
            <select
              value={lineup[pos] ?? ''}
              onChange={(e) => setLineup((prev) => ({ ...prev, [pos]: e.target.value || null }))}
              style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            >
              <option value="">— wybierz —</option>
              {players.map((p) => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
            </select>
          </div>
        ))}
        <div style={{ padding: '16px 0 0' }}>
          <button className="btn btn-primary btn-full" onClick={saveLineup}>Rozpocznij rejestrację</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100dvh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Wróć</button>
        <div style={{ fontWeight: 800, fontSize: 20 }}>{setScore.us} — {setScore.them}</div>
        <button className="btn btn-ghost btn-sm" onClick={handleRotate}>Rotuj ↻</button>
      </div>

      {/* Set score controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '10px 16px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setSetScore((s) => ({ ...s, us: s.us + 1 }))}>+1 My</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSetScore((s) => ({ ...s, us: Math.max(0, s.us - 1) }))}>-1 My</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSetScore((s) => ({ ...s, them: Math.max(0, s.them - 1) }))}>-1 Rywal</button>
        <button className="btn btn-primary btn-sm" onClick={() => setSetScore((s) => ({ ...s, them: s.them + 1 }))}>+1 Rywal</button>
      </div>

      {/* Court */}
      <div style={{ padding: 16 }}>
        <div style={{ background: '#4ade80', borderRadius: 8, padding: 8, position: 'relative' }}>
          {/* Net */}
          <div style={{ height: 4, background: '#1e1e1e', borderRadius: 2, margin: '0 0 8px' }} />
          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
            {POSITIONS.map(({ pos, row, col }) => {
              const player = playerAtPos(pos);
              const isSelected = selectedPos === pos;
              const isFlashing = flash === pos;
              return (
                <button
                  key={pos}
                  onClick={() => { setSelectedPos(isSelected ? null : pos); setSelectedAction(null); }}
                  style={{
                    gridRow: row, gridColumn: col,
                    height: 72, borderRadius: 8, border: '2px solid',
                    borderColor: isSelected ? 'var(--color-accent)' : 'rgba(0,0,0,.2)',
                    background: isFlashing ? 'var(--color-accent)' : isSelected ? 'var(--color-accent-light)' : 'rgba(255,255,255,.85)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 2,
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600 }}>P{pos}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.2 }}>
                    {player ? `#${player.number} ${player.name.split(' ')[0]}` : '—'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action selector */}
      {selectedPos && (
        <div style={{ padding: '0 16px 12px' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>
            {playerAtPos(selectedPos) ? `${playerAtPos(selectedPos).name} — wybierz akcję:` : 'Wybierz akcję:'}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <button key={key}
                onClick={() => setSelectedAction(selectedAction === key ? null : key)}
                className="btn btn-sm"
                style={{
                  background: selectedAction === key ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: selectedAction === key ? '#fff' : 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Outcome selector */}
      {selectedPos && selectedAction && (
        <div style={{ padding: '0 16px' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>Wynik akcji:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ACTION_OUTCOMES[selectedAction].map((o) => (
              <button key={o.key}
                onClick={() => recordAction(o.key)}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: 'none',
                  background: o.color, color: '#fff', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer', minWidth: 80,
                }}
              >{o.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Setup button */}
      <div style={{ padding: '16px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setSetupMode(true)}>Zmień skład</button>
      </div>
    </div>
  );
}
