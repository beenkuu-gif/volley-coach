// volley-coach/src/components/CourtView.jsx
import { useState, useRef } from 'react';
import { useMatches } from '../contexts/MatchesContext';
import { rotateCourt, emptyPlayerStats } from '../utils/stats';

const ACTION_OUTCOMES = {
  serve:     [{ key: 'ace', label: 'Ace', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }, { key: 'inPlay', label: 'W grze', color: '#64748b' }],
  attack:    [{ key: 'kill', label: 'Zabita', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }, { key: 'blocked', label: 'Zblok.', color: '#f59e0b' }, { key: 'inPlay', label: 'W grze', color: '#64748b' }],
  block:     [{ key: 'point', label: 'Punkt', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
  reception: [{ key: 'perfect', label: 'Idealne', color: '#10b981' }, { key: 'good', label: 'Dobre', color: '#3b82f6' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
  defense:   [{ key: 'success', label: 'Udana', color: '#10b981' }, { key: 'error', label: 'Błąd', color: '#ef4444' }],
};

const ALL_ACTIONS   = { serve: '🏐 Zagrywka', attack: '💥 Atak', block: '🤚 Blok', reception: '🎯 Przyjęcie', defense: '🛡 Obrona' };
const LIBERO_ACTIONS = { reception: '🎯 Przyjęcie', defense: '🛡 Obrona' };

const POINT_MAP = {
  serve:     { ace: 'us',   error: 'them', inPlay: null },
  attack:    { kill: 'us',  error: 'them', blocked: 'them', inPlay: null },
  block:     { point: 'us', error: 'them' },
  reception: { perfect: null, good: null, error: 'them' },
  defense:   { success: null, error: 'them' },
};

// Stats view category config
const STAT_CATS = [
  { key: 'serve',     label: 'Zagrywka', cols: [{ k: 'ace', l: 'Ace' }, { k: 'error', l: 'Błąd' }, { k: 'inPlay', l: 'W grze' }],  pct: (s) => s.total ? Math.round(s.ace / s.total * 100) : null, pctLabel: 'Ace%' },
  { key: 'attack',    label: 'Atak',     cols: [{ k: 'kill', l: 'Zabita' }, { k: 'error', l: 'Błąd' }, { k: 'blocked', l: 'Zblok.' }], pct: (s) => s.total ? Math.round(s.kill / s.total * 100) : null, pctLabel: 'Kill%' },
  { key: 'block',     label: 'Blok',     cols: [{ k: 'point', l: 'Pkt' }, { k: 'error', l: 'Błąd' }], pct: null },
  { key: 'reception', label: 'Przyjęcie',cols: [{ k: 'perfect', l: 'Idealne' }, { k: 'good', l: 'Dobre' }, { k: 'error', l: 'Błąd' }], pct: (s) => s.total ? Math.round((s.perfect + s.good) / s.total * 100) : null, pctLabel: '%+' },
  { key: 'defense',   label: 'Obrona',   cols: [{ k: 'success', l: 'Udana' }, { k: 'error', l: 'Błąd' }], pct: (s) => s.total ? Math.round(s.success / s.total * 100) : null, pctLabel: 'Sku%' },
];

const FRONT_ROW = [4, 3, 2];
const BACK_ROW  = [5, 6, 1];
const COURT_BG   = '#1d4ed8';
const COURT_LINE = 'rgba(255,255,255,0.6)';

export default function CourtView({ matchId, team, onBack }) {
  const { matches, updateMatch } = useMatches();
  const match = matches.find((m) => m.id === matchId);
  const players = team?.players ?? [];

  const [lineup, setLineup] = useState(
    match?.courtLineup ?? { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }
  );
  const [liberoId, setLiberoId] = useState(match?.liberoId ?? null);
  const [setupMode, setSetupMode] = useState(
    Object.values(match?.courtLineup ?? {}).every((v) => !v)
  );

  const [mainView, setMainView] = useState('court'); // 'court' | 'stats'
  const [statCat, setStatCat]   = useState('serve');
  const [selectedPos, setSelectedPos] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [flash, setFlash] = useState(null);
  const [setScore, setSetScore] = useState({ us: 0, them: 0 });
  const flashTimer = useRef(null);

  function saveLineup() {
    updateMatch(matchId, (m) => {
      const stats = { ...m.liveStats };
      Object.values(lineup).forEach((pid) => {
        if (pid && !stats[pid]) stats[pid] = emptyPlayerStats();
      });
      return { courtLineup: lineup, liberoId, liveStats: stats };
    });
    setSetupMode(false);
  }

  function handleRotate() {
    const rotated = rotateCourt(lineup);
    setLineup(rotated);
    updateMatch(matchId, () => ({ courtLineup: rotated }));
  }

  function endSet() {
    updateMatch(matchId, (m) => ({
      sets: [...(m.sets ?? []), { us: setScore.us, them: setScore.them }],
    }));
    setSetScore({ us: 0, them: 0 });
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

    const pointFor = POINT_MAP[selectedAction]?.[outcome];
    if (pointFor === 'us')   setSetScore((s) => ({ ...s, us: s.us + 1 }));
    if (pointFor === 'them') setSetScore((s) => ({ ...s, them: s.them + 1 }));

    clearTimeout(flashTimer.current);
    setFlash(selectedPos);
    flashTimer.current = setTimeout(() => setFlash(null), 500);
    setSelectedPos(null);
    setSelectedAction(null);
  }

  const playerAtPos = (pos) => {
    const pid = lineup[pos];
    return players.find((p) => p.id === pid);
  };

  // ── Setup mode ──────────────────────────────────────────────
  if (setupMode) {
    const allPositions = [...FRONT_ROW, ...BACK_ROW];
    return (
      <div style={{ minHeight: '100dvh', background: '#0f172a', paddingBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>← Wróć</button>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Ustawianie składu</span>
          <div style={{ width: 70 }} />
        </div>

        {/* Mini court preview */}
        <div style={{ margin: '14px 14px 6px', background: COURT_BG, borderRadius: 12, border: '2px solid rgba(255,255,255,.2)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '8px 8px 4px' }}>
            {FRONT_ROW.map((pos) => {
              const p = playerAtPos(pos);
              const isLib = p && p.id === liberoId;
              return (
                <div key={pos} style={{ background: isLib ? 'rgba(239,68,68,.4)' : 'rgba(255,255,255,.14)', borderRadius: 6, padding: '5px 4px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 9, fontWeight: 700 }}>P{pos}</div>
                  <div style={{ color: '#fff', fontSize: 11, fontWeight: 700, minHeight: 14 }}>
                    {p ? `#${p.number} ${p.name.split(' ')[0]}` : '—'}{isLib ? ' L' : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ height: 2, background: COURT_LINE, margin: '0 8px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '4px 8px 8px' }}>
            {BACK_ROW.map((pos) => {
              const p = playerAtPos(pos);
              const isLib = p && p.id === liberoId;
              return (
                <div key={pos} style={{ background: isLib ? 'rgba(239,68,68,.4)' : 'rgba(255,255,255,.14)', borderRadius: 6, padding: '5px 4px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 9, fontWeight: 700 }}>P{pos}</div>
                  <div style={{ color: '#fff', fontSize: 11, fontWeight: 700, minHeight: 14 }}>
                    {p ? `#${p.number} ${p.name.split(' ')[0]}` : '—'}{isLib ? ' L' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '8px 14px 0' }}>
          {allPositions.map((pos) => (
            <div key={pos} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15 }}>{pos}</div>
              <select
                value={lineup[pos] ?? ''}
                onChange={(e) => setLineup((prev) => ({ ...prev, [pos]: e.target.value || null }))}
                style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
              >
                <option value="" style={{ background: '#1e293b' }}>— wybierz —</option>
                {players.map((p) => <option key={p.id} value={p.id} style={{ background: '#1e293b' }}>#{p.number} {p.name}{p.id === liberoId ? ' [L]' : ''}</option>)}
              </select>
            </div>
          ))}

          <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 12 }}>
            <div style={{ color: '#f87171', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>LIBERO</div>
            <select
              value={liberoId ?? ''}
              onChange={(e) => setLiberoId(e.target.value || null)}
              style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
            >
              <option value="" style={{ background: '#1e293b' }}>— brak libero —</option>
              {players.map((p) => <option key={p.id} value={p.id} style={{ background: '#1e293b' }}>#{p.number} {p.name}</option>)}
            </select>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '6px 0 0' }}>Libero rejestruje tylko przyjęcie i obronę</p>
          </div>
        </div>

        <div style={{ padding: '16px 14px 0' }}>
          <button onClick={saveLineup} style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 16, boxShadow: '0 4px 16px rgba(79,70,229,.4)' }}>
            🏐 Rozpocznij rejestrację
          </button>
        </div>
      </div>
    );
  }

  // ── Live mode ────────────────────────────────────────────────
  const selectedPlayer      = selectedPos ? playerAtPos(selectedPos) : null;
  const isSelectedLibero    = selectedPos !== null && lineup[selectedPos] === liberoId;
  const availableActions    = isSelectedLibero ? LIBERO_ACTIONS : ALL_ACTIONS;
  const savedSets           = match?.sets ?? [];
  const liveStats           = match?.liveStats ?? {};

  function renderPositionTile(pos) {
    const player     = playerAtPos(pos);
    const isSelected = selectedPos === pos;
    const isFlashing = flash === pos;
    const isLibero   = player && player.id === liberoId;

    let bg, border;
    if (isFlashing) {
      bg = 'linear-gradient(135deg, #10b981, #059669)'; border = '#10b981';
    } else if (isSelected) {
      bg = isLibero ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)';
      border = isLibero ? '#fca5a5' : '#a78bfa';
    } else if (isLibero) {
      bg = 'rgba(239,68,68,.25)'; border = 'rgba(239,68,68,.55)';
    } else {
      bg = player ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.04)';
      border = player ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.08)';
    }

    return (
      <button key={pos}
        onClick={() => { setSelectedPos(isSelected ? null : pos); setSelectedAction(null); }}
        style={{
          height: 100, borderRadius: 10, border: `2px solid ${border}`, background: bg,
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 3,
          transition: 'all .15s', color: '#fff', padding: 4, position: 'relative',
          boxShadow: isSelected ? (isLibero ? '0 0 18px rgba(239,68,68,.5)' : '0 0 18px rgba(124,58,237,.5)') : 'none',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {player ? (
          <>
            {isLibero && <span style={{ position: 'absolute', top: 4, right: 5, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 4px', borderRadius: 4 }}>L</span>}
            <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{player.number}</span>
            <span style={{ fontSize: 10, fontWeight: 600, opacity: .85, textAlign: 'center', lineHeight: 1.2, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {player.name.split(' ')[0]}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 11, opacity: .3, fontWeight: 600 }}>P{pos}</span>
        )}
      </button>
    );
  }

  // ── Stats view ───────────────────────────────────────────────
  function renderStats() {
    const cat = STAT_CATS.find((c) => c.key === statCat);
    // Collect all players with any data in this category
    const rows = players
      .map((p) => ({ player: p, s: liveStats[p.id]?.[cat.key] }))
      .filter((r) => r.s && r.s.total > 0)
      .sort((a, b) => b.s.total - a.s.total);

    return (
      <div style={{ padding: '0 12px 24px' }}>
        {/* Completed sets summary */}
        {savedSets.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>WYNIKI SETÓW</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {savedSets.map((st, i) => {
                const won = st.us > st.them;
                return (
                  <div key={i} style={{ background: won ? 'rgba(16,185,129,.15)' : 'rgba(220,38,38,.15)', border: `1px solid ${won ? 'rgba(16,185,129,.3)' : 'rgba(220,38,38,.3)'}`, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>SET {i + 1}</div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{st.us}<span style={{ opacity: .4, fontSize: 12, margin: '0 3px' }}>:</span>{st.them}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12, WebkitOverflowScrolling: 'touch' }}>
          {STAT_CATS.map((c) => (
            <button key={c.key} onClick={() => setStatCat(c.key)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: statCat === c.key ? '#4f46e5' : 'rgba(255,255,255,.08)',
                color: statCat === c.key ? '#fff' : 'rgba(255,255,255,.5)',
              }}>{c.label}</button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 14, padding: '32px 0' }}>
            Brak danych — zacznij rejestrować akcje na boisku
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: `1fr ${cat.cols.map(() => '44px').join(' ')} 44px`, gap: 4, padding: '0 8px', color: 'rgba(255,255,255,.35)', fontSize: 11, fontWeight: 700 }}>
              <span>Zawodniczka</span>
              {cat.cols.map((c) => <span key={c.k} style={{ textAlign: 'center' }}>{c.l}</span>)}
              <span style={{ textAlign: 'center' }}>{cat.pctLabel ?? 'Razem'}</span>
            </div>

            {rows.map(({ player: p, s }) => {
              const pct = cat.pct ? cat.pct(s) : null;
              const hasError = (s.error ?? 0) > 0;
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: `1fr ${cat.cols.map(() => '44px').join(' ')} 44px`, gap: 4, alignItems: 'center', background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 8px', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, fontWeight: 700, marginRight: 5 }}>#{p.number}</span>
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{p.name.split(' ')[0]}</span>
                    {p.id === liberoId && <span style={{ marginLeft: 5, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>L</span>}
                  </div>
                  {cat.cols.map((c) => {
                    const val = s[c.k] ?? 0;
                    const isErr = c.k === 'error' && val > 0;
                    return (
                      <span key={c.k} style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, color: isErr ? '#f87171' : val > 0 ? '#fff' : 'rgba(255,255,255,.2)' }}>
                        {val}
                      </span>
                    );
                  })}
                  <span style={{ textAlign: 'center', fontWeight: 800, fontSize: 14, color: pct == null ? 'rgba(255,255,255,.35)' : pct >= 60 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {pct != null ? `${pct}%` : s.total}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', paddingBottom: 24 }}>

      {/* Score header */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,.08)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', padding: '7px 13px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Wróć</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, letterSpacing: 1.5, fontWeight: 700, marginBottom: 2 }}>
              {savedSets.length > 0 ? `SET ${savedSets.length + 1}` : 'WYNIK SETA'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#fff', fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{setScore.us}</span>
              <span style={{ color: 'rgba(255,255,255,.25)', fontSize: 20 }}>:</span>
              <span style={{ color: '#fff', fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{setScore.them}</span>
            </div>
          </div>
          <button onClick={handleRotate} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', padding: '7px 13px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Rotuj</button>
        </div>

        {/* Score controls + End set */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setSetScore((s) => ({ ...s, us: Math.max(0, s.us - 1) }))} style={{ flex: 1, padding: '9px 0', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: 'rgba(255,255,255,.5)', fontSize: 20, cursor: 'pointer' }}>−</button>
            <button onClick={() => setSetScore((s) => ({ ...s, us: s.us + 1 }))} style={{ flex: 2, padding: '9px 0', background: '#4f46e5', border: 'none', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>+1 My</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setSetScore((s) => ({ ...s, them: s.them + 1 }))} style={{ flex: 2, padding: '9px 0', background: '#dc2626', border: 'none', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>+1 Rywal</button>
            <button onClick={() => setSetScore((s) => ({ ...s, them: Math.max(0, s.them - 1) }))} style={{ flex: 1, padding: '9px 0', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: 'rgba(255,255,255,.5)', fontSize: 20, cursor: 'pointer' }}>−</button>
          </div>
        </div>
        <button onClick={endSet} style={{ width: '100%', padding: '9px', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ✓ Zakończ set {savedSets.length + 1}
        </button>
      </div>

      {/* Tab bar: Boisko / Statystyki */}
      <div style={{ display: 'flex', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        {[['court', '⚽ Boisko'], ['stats', '📊 Statystyki']].map(([key, label]) => (
          <button key={key} onClick={() => setMainView(key)} style={{
            flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: 'transparent',
            color: mainView === key ? '#818cf8' : 'rgba(255,255,255,.35)',
            borderBottom: mainView === key ? '2px solid #818cf8' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      {/* ── Court view ── */}
      {mainView === 'court' && (
        <>
          <div style={{ padding: '12px 12px 8px' }}>
            <div style={{ background: COURT_BG, borderRadius: 14, border: `2px solid ${COURT_LINE}`, boxShadow: '0 8px 32px rgba(0,0,0,.55)', overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 7, width: 1.5, background: COURT_LINE, zIndex: 1 }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, right: 7, width: 1.5, background: COURT_LINE, zIndex: 1 }} />

                {/* NET */}
                <div style={{ margin: '0 7px' }}>
                  <div style={{ height: 9, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,.4)' }} />
                  <div style={{ height: 22, background: ['repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0px, rgba(255,255,255,.35) 1.5px, transparent 1.5px, transparent 12px)', 'repeating-linear-gradient(0deg, rgba(255,255,255,.25) 0px, rgba(255,255,255,.25) 1.5px, transparent 1.5px, transparent 8px)'].join(', ') }} />
                  <div style={{ height: 5, background: 'rgba(255,255,255,.5)', boxShadow: '0 -2px 6px rgba(0,0,0,.2)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '10px 10px 6px' }}>
                  {FRONT_ROW.map(renderPositionTile)}
                </div>
                <div style={{ margin: '0 10px', height: 2.5, background: COURT_LINE, borderRadius: 2 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '6px 10px 10px' }}>
                  {BACK_ROW.map(renderPositionTile)}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 5 }}>
              <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 10, letterSpacing: 2, fontWeight: 600 }}>SIATKA ↑</span>
            </div>
          </div>

          {/* Action panel */}
          <div style={{ padding: '0 12px' }}>
            {!selectedPos ? (
              <div style={{ textAlign: 'center', padding: '14px 0', color: 'rgba(255,255,255,.3)', fontSize: 13 }}>
                Dotknij zawodniczkę na boisku
              </div>
            ) : (
              <>
                <div style={{ background: isSelectedLibero ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isSelectedLibero && <span style={{ background: 'rgba(255,255,255,.25)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>LIBERO</span>}
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {selectedPlayer ? `#${selectedPlayer.number} ${selectedPlayer.name.split(' ')[0]}` : `Pozycja ${selectedPos}`}
                    </span>
                  </div>
                  <button onClick={() => { setSelectedPos(null); setSelectedAction(null); }} style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>

                {!selectedAction && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {Object.entries(availableActions).map(([key, label]) => (
                      <button key={key} onClick={() => setSelectedAction(key)}
                        style={{ padding: '13px 8px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {selectedAction && (
                  <>
                    <button onClick={() => setSelectedAction(null)} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, marginBottom: 10 }}>
                      ← {availableActions[selectedAction]}
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: ACTION_OUTCOMES[selectedAction].length === 2 ? '1fr 1fr' : '1fr 1fr 1fr', gap: 8 }}>
                      {ACTION_OUTCOMES[selectedAction].map((o) => (
                        <button key={o.key} onClick={() => recordAction(o.key)}
                          style={{ padding: '18px 6px', borderRadius: 12, border: 'none', background: o.color, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: `0 4px 14px ${o.color}55` }}
                          onTouchStart={(e) => e.currentTarget.style.transform = 'scale(.94)'}
                          onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >{o.label}</button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div style={{ padding: '16px 12px 0', textAlign: 'center' }}>
            <button onClick={() => setSetupMode(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: 13 }}>
              ⚙ Zmień skład
            </button>
          </div>
        </>
      )}

      {/* ── Stats view ── */}
      {mainView === 'stats' && renderStats()}
    </div>
  );
}
