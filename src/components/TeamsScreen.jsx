// volley-coach/src/components/TeamsScreen.jsx
import { useState } from 'react';
import { useTeams } from '../contexts/TeamsContext';
import BottomSheet from './BottomSheet';

export default function TeamsScreen() {
  const { teams, addTeam, addPlayer } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  function handleAddTeam(e) {
    e.preventDefault();
    if (!teamName.trim()) return;
    addTeam(teamName.trim());
    setTeamName('');
    setShowAddTeam(false);
  }

  function handleAddPlayer(e) {
    e.preventDefault();
    if (!playerName.trim() || !playerNumber) return;
    addPlayer(selectedTeamId, { name: playerName.trim(), number: Number(playerNumber) });
    setPlayerName('');
    setPlayerNumber('');
    setShowAddPlayer(false);
  }

  if (selectedTeam) {
    return (
      <div className="screen">
        <div className="top-bar" style={{ marginBottom: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTeamId(null)}>← Drużyny</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddPlayer(true)}>+ Zawodnik</button>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{selectedTeam.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{selectedTeam.players.length} zawodniczek</p>

        {selectedTeam.players
          .slice()
          .sort((a, b) => a.number - b.number)
          .map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>
                {p.number}
              </div>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
            </div>
          ))}

        <BottomSheet isOpen={showAddPlayer} onClose={() => setShowAddPlayer(false)} title="Dodaj zawodniczkę">
          <form onSubmit={handleAddPlayer}>
            <div className="form-group">
              <label>Imię i nazwisko</label>
              <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Anna Kowalska" autoFocus />
            </div>
            <div className="form-group">
              <label>Numer</label>
              <input type="number" min="1" max="99" value={playerNumber} onChange={(e) => setPlayerNumber(e.target.value)} placeholder="7" />
            </div>
            <button type="submit" className="btn btn-primary btn-full">Dodaj</button>
          </form>
        </BottomSheet>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 16 }}>
        <h1>Drużyny</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddTeam(true)}>+ Drużyna</button>
      </div>

      {teams.map((t) => (
        <div key={t.id} className="card" style={{ padding: '16px', marginBottom: 10, cursor: 'pointer' }}
          onClick={() => setSelectedTeamId(t.id)}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>{t.players.length} zawodniczek</div>
        </div>
      ))}

      <BottomSheet isOpen={showAddTeam} onClose={() => setShowAddTeam(false)} title="Nowa drużyna">
        <form onSubmit={handleAddTeam}>
          <div className="form-group">
            <label>Nazwa drużyny</label>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Kadra A" autoFocus />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Utwórz drużynę</button>
        </form>
      </BottomSheet>
    </div>
  );
}
