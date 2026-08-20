// volley-coach/src/components/MatchDetail.jsx
import { useState } from 'react';
import { useMatches } from '../contexts/MatchesContext';
import { useTeams } from '../contexts/TeamsContext';
import { matchScore, servePercent, attackPercent, receptionPositivePercent, blockPercent, defensePercent } from '../utils/stats';
import CourtView from './CourtView';

export default function MatchDetail({ matchId, onBack }) {
  const { matches, updateMatch } = useMatches();
  const { teams } = useTeams();
  const [tab, setTab] = useState('live');
  const [showCourt, setShowCourt] = useState(false);

  const match = matches.find((m) => m.id === matchId);
  if (!match) return null;

  const team = teams.find((t) => t.id === match.teamId);
  const score = matchScore(match.sets);

  function addSet() {
    if (match.sets.length >= 5) return;
    updateMatch(matchId, (m) => ({ sets: [...m.sets, { us: 0, them: 0 }] }));
  }

  function updateSetScore(idx, side, delta) {
    updateMatch(matchId, (m) => {
      const sets = m.sets.map((s, i) => {
        if (i !== idx) return s;
        return { ...s, [side]: Math.max(0, s[side] + delta) };
      });
      return { sets };
    });
  }

  function updateNotes(notes) {
    updateMatch(matchId, () => ({ notes }));
  }

  if (showCourt) {
    return <CourtView matchId={matchId} team={team} onBack={() => setShowCourt(false)} />;
  }

  const TABS = [
    { id: 'live',    label: 'Live stats' },
    { id: 'notes',   label: 'Notatki' },
    { id: 'summary', label: 'Podsumowanie' },
  ];

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Mecze</button>
        <div style={{ fontWeight: 800, fontSize: 22, color: score.us > score.them ? 'var(--color-success)' : score.them > score.us ? 'var(--color-error)' : 'var(--color-text)' }}>
          {score.us} : {score.them}
        </div>
      </div>

      <div style={{ padding: '0 16px 10px' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>vs {match.opponent}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{team?.name} · {match.date}</p>
      </div>

      {/* Sets */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {match.sets.map((s, i) => (
          <div key={i} className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginRight: 4 }}>S{i + 1}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={() => updateSetScore(i, 'us', 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>▲</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{s.us}</span>
              <button onClick={() => updateSetScore(i, 'us', -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>▼</button>
            </div>
            <span style={{ color: 'var(--color-text-muted)' }}>:</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={() => updateSetScore(i, 'them', 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>▲</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{s.them}</span>
              <button onClick={() => updateSetScore(i, 'them', -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>▼</button>
            </div>
          </div>
        ))}
        {match.sets.length < 5 && (
          <button className="btn btn-ghost btn-sm" onClick={addSet}>+ Set</button>
        )}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', margin: '0 16px 16px' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            color: tab === t.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
            borderBottom: tab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'live' && (
        <div style={{ padding: '0 16px' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Rejestruj akcje zawodniczek w czasie rzeczywistym na widoku boiska.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => setShowCourt(true)}>
            🏐 Otwórz widok boiska
          </button>
        </div>
      )}

      {tab === 'notes' && (
        <div style={{ padding: '0 16px' }}>
          <textarea
            value={match.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Notatki pomeczowe..."
            style={{ width: '100%', minHeight: 200, padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15, resize: 'vertical' }}
          />
        </div>
      )}

      {tab === 'summary' && (
        <div style={{ padding: '0 16px', overflowX: 'auto' }}>
          {(!team || team.players.length === 0) && (
            <p style={{ color: 'var(--color-text-muted)' }}>Brak zawodniczek w drużynie.</p>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '6px 4px', whiteSpace: 'nowrap' }}>Zawodniczka</th>
                <th style={{ padding: '6px 4px' }} title="Zagrywka">Zagr</th>
                <th style={{ padding: '6px 4px' }} title="Ace">Ace</th>
                <th style={{ padding: '6px 4px' }} title="Atak">Atak</th>
                <th style={{ padding: '6px 4px' }} title="Kill %">K%</th>
                <th style={{ padding: '6px 4px' }} title="Blok">Blok</th>
                <th style={{ padding: '6px 4px' }} title="Przyjęcie">Przyj</th>
                <th style={{ padding: '6px 4px' }} title="Pozytywne %">P%</th>
                <th style={{ padding: '6px 4px' }} title="Obrona">Obr</th>
              </tr>
            </thead>
            <tbody>
              {(team?.players ?? []).map((p) => {
                const s = match.liveStats?.[p.id];
                if (!s) return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '6px 4px', whiteSpace: 'nowrap' }}>#{p.number} {p.name}</td>
                    <td colSpan={8} style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: 11 }}>brak danych</td>
                  </tr>
                );
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '6px 4px', whiteSpace: 'nowrap', fontWeight: 500 }}>#{p.number} {p.name}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px' }}>{s.serve?.total ?? 0}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--color-success)' }}>{s.serve?.ace ?? 0}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px' }}>{s.attack?.total ?? 0}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--color-accent)', fontWeight: 600 }}>{attackPercent(s.attack)}%</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px' }}>{s.block?.total ?? 0}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px' }}>{s.reception?.total ?? 0}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--color-accent)', fontWeight: 600 }}>{receptionPositivePercent(s.reception)}%</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px' }}>{s.defense?.total ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
