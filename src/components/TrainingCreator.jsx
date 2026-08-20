// volley-coach/src/components/TrainingCreator.jsx
import { useState } from 'react';
import { useTrainings } from '../contexts/TrainingsContext';
import { useTeams } from '../contexts/TeamsContext';
import { useDrills } from '../contexts/DrillsContext';
import BottomSheet from './BottomSheet';

const BLOCK_TYPES = ['Rozgrzewka', 'Technika', 'Taktyka', 'Gra', 'Siłownia', 'Inne'];
const CATEGORIES = ['Wszystkie', 'Rozgrzewka', 'Zagrywka', 'Przyjęcie', 'Atak', 'Blok', 'Obrona', 'Gra', 'Siłownia'];

export default function TrainingCreator({ onBack }) {
  const { addTraining } = useTrainings();
  const { teams } = useTeams();
  const { drills } = useDrills();

  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [venue, setVenue] = useState('');
  const [blocks, setBlocks] = useState([]);

  const [showAddBlock, setShowAddBlock] = useState(false);
  const [blockName, setBlockName] = useState('Rozgrzewka');
  const [blockDuration, setBlockDuration] = useState('');

  const [drillPickerBlockId, setDrillPickerBlockId] = useState(null);
  const [pickerCategory, setPickerCategory] = useState('Wszystkie');
  const [pickerSelected, setPickerSelected] = useState([]);

  const totalMin = blocks.reduce((s, b) => s + (b.durationMin || 0), 0);

  function addBlock(e) {
    e.preventDefault();
    if (!blockName.trim() || !blockDuration) return;
    setBlocks((prev) => [...prev, {
      id: crypto.randomUUID(), name: blockName,
      durationMin: Number(blockDuration), drillIds: [],
    }]);
    setBlockName('Rozgrzewka');
    setBlockDuration('');
    setShowAddBlock(false);
  }

  function openDrillPicker(blockId) {
    const block = blocks.find((b) => b.id === blockId);
    setPickerSelected(block?.drillIds ?? []);
    setPickerCategory('Wszystkie');
    setDrillPickerBlockId(blockId);
  }

  function saveDrillPicker() {
    setBlocks((prev) =>
      prev.map((b) => b.id === drillPickerBlockId ? { ...b, drillIds: pickerSelected } : b)
    );
    setDrillPickerBlockId(null);
  }

  function togglePickerDrill(id) {
    setPickerSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function removeDrillFromBlock(blockId, drillId) {
    setBlocks((prev) =>
      prev.map((b) => b.id === blockId ? { ...b, drillIds: b.drillIds.filter((d) => d !== drillId) } : b)
    );
  }

  function removeBlock(blockId) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }

  function handleSave() {
    if (!teamId || !date) return;
    addTraining({ teamId, date, venue, blocks });
    onBack();
  }

  const pickerDrills = drills.filter((d) =>
    pickerCategory === 'Wszystkie' || d.category === pickerCategory
  );

  return (
    <div className="screen">
      <div className="top-bar" style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Treningi</button>
        <h1 style={{ fontSize: 17 }}>Nowy trening</h1>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="form-group">
          <label>Drużyna</label>
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Data</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Hala</label>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Hala OSiR" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Bloki treningowe</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowAddBlock(true)}>+ Blok</button>
      </div>

      {blocks.map((block) => (
        <div key={block.id} className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <span style={{ fontWeight: 700 }}>{block.name}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 13, marginLeft: 8 }}>{block.durationMin} min</span>
            </div>
            <button onClick={() => removeBlock(block.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {block.drillIds.map((id) => {
              const d = drills.find((x) => x.id === id);
              if (!d) return null;
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                  borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600,
                }}>
                  {d.name}
                  <button onClick={() => removeDrillFromBlock(block.id, id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              );
            })}
          </div>

          <button className="btn btn-ghost btn-sm" onClick={() => openDrillPicker(block.id)}>+ Dodaj ćwiczenia</button>
        </div>
      ))}

      {blocks.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 20 }}>Dodaj co najmniej jeden blok</p>
      )}

      {/* Sticky bottom bar */}
      <div style={{
        position: 'fixed', bottom: 'var(--bottom-nav-height)', left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 50,
      }}>
        <span style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>Łącznie: {totalMin} min</span>
        <button className="btn btn-primary" onClick={handleSave} disabled={blocks.length === 0}>Zapisz trening</button>
      </div>

      {/* Add block sheet */}
      <BottomSheet isOpen={showAddBlock} onClose={() => setShowAddBlock(false)} title="Nowy blok">
        <form onSubmit={addBlock}>
          <div className="form-group">
            <label>Typ bloku</label>
            <select value={blockName} onChange={(e) => setBlockName(e.target.value)}>
              {BLOCK_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Czas (minuty)</label>
            <input type="number" min="1" max="180" value={blockDuration}
              onChange={(e) => setBlockDuration(e.target.value)} placeholder="15" autoFocus />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Dodaj blok</button>
        </form>
      </BottomSheet>

      {/* Drill picker sheet */}
      <BottomSheet isOpen={!!drillPickerBlockId} onClose={saveDrillPicker} title="Wybierz ćwiczenia">
        <div className="chip-row" style={{ padding: '0 0 12px', margin: '0 -4px' }}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip ${pickerCategory === c ? 'active' : ''}`}
              onClick={() => setPickerCategory(c)}>{c}</button>
          ))}
        </div>
        <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
          {pickerDrills.map((d) => (
            <label key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
            }}>
              <input type="checkbox" checked={pickerSelected.includes(d.id)}
                onChange={() => togglePickerDrill(d.id)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                <span className={`badge badge-${d.category}`}>{d.category}</span>
              </div>
            </label>
          ))}
        </div>
        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={saveDrillPicker}>
          Zatwierdź ({pickerSelected.length})
        </button>
      </BottomSheet>
    </div>
  );
}
