// volley-coach/src/components/DrillsScreen.jsx
import { useState } from 'react';
import { useDrills } from '../contexts/DrillsContext';
import BottomSheet from './BottomSheet';

const CATEGORIES   = ['Wszystkie', 'Rozgrzewka', 'Zagrywka', 'Przyjęcie', 'Atak', 'Blok', 'Obrona', 'Gra', 'Ustawienia', 'Siłownia'];
const DIFFICULTIES = ['Wszystkie', 'podstawowe', 'średnio zaawansowane', 'zaawansowane'];

const DIFF_LABEL = {
  'podstawowe':          '🟢 Podstawowe',
  'średnio zaawansowane':'🟡 Średnio zaawansowane',
  'zaawansowane':        '🔴 Zaawansowane',
};

function diffClass(d) {
  if (d === 'zaawansowane')        return 'diff-badge diff-zaawansowane';
  if (d === 'średnio zaawansowane') return 'diff-badge diff-srednie';
  return 'diff-badge diff-podstawowe';
}

export default function DrillsScreen() {
  const { drills, addDrill } = useDrills();
  const [activeCategory,   setActiveCategory]   = useState('Wszystkie');
  const [activeDifficulty, setActiveDifficulty] = useState('Wszystkie');
  const [search,    setSearch]    = useState('');
  const [showAdd,   setShowAdd]   = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Rozgrzewka', difficulty: 'podstawowe', description: '', tips: '' });

  const filtered = drills.filter((d) => {
    if (activeCategory   !== 'Wszystkie' && d.category   !== activeCategory)   return false;
    if (activeDifficulty !== 'Wszystkie' && d.difficulty !== activeDifficulty) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()))        return false;
    return true;
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addDrill(form);
    setForm({ name: '', category: 'Rozgrzewka', difficulty: 'podstawowe', description: '', tips: '' });
    setShowAdd(false);
  }

  return (
    <>
      <div className="top-bar">
        <h1>Ćwiczenia</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Dodaj</button>
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj ćwiczenia..."
          style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
        />
      </div>

      {/* Category chips */}
      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
        ))}
      </div>

      {/* Difficulty chips */}
      <div className="chip-row" style={{ paddingTop: 0 }}>
        {DIFFICULTIES.map((d) => (
          <button key={d} className={`chip ${activeDifficulty === d ? 'active' : ''}`} onClick={() => setActiveDifficulty(d)}>
            {d === 'Wszystkie' ? 'Wszystkie poziomy' : DIFF_LABEL[d] ?? d}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 4px 16px', color: 'var(--color-text-muted)', fontSize: 12 }}>
        {filtered.length} {filtered.length === 1 ? 'ćwiczenie' : 'ćwiczeń'}
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 40 }}>Brak ćwiczeń</p>
        )}
        {filtered.map((d) => (
          <div key={d.id} className="card" style={{ padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}
            onClick={() => setSelectedDrill(d)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>{d.name}</span>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span className={diffClass(d.difficulty)}>{d.difficulty ?? 'podstawowe'}</span>
                <span className={`badge badge-${d.category}`}>{d.category}</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
              {d.description?.slice(0, 70)}{(d.description?.length ?? 0) > 70 ? '…' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Drill detail */}
      <BottomSheet isOpen={!!selectedDrill} onClose={() => setSelectedDrill(null)} title={selectedDrill?.name ?? ''}>
        {selectedDrill && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <span className={diffClass(selectedDrill.difficulty)}>{selectedDrill.difficulty ?? 'podstawowe'}</span>
              <span className={`badge badge-${selectedDrill.category}`}>{selectedDrill.category}</span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Opis</h3>
            <p style={{ marginBottom: 16, lineHeight: 1.6 }}>{selectedDrill.description}</p>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Wskazówki dla trenera</h3>
            <p style={{ lineHeight: 1.6 }}>{selectedDrill.tips}</p>
          </>
        )}
      </BottomSheet>

      {/* Add drill */}
      <BottomSheet isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nowe ćwiczenie">
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Nazwa</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nazwa ćwiczenia" autoFocus />
          </div>
          <div className="form-group">
            <label>Kategoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.filter((c) => c !== 'Wszystkie').map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Poziom trudności</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="podstawowe">🟢 Podstawowe</option>
              <option value="średnio zaawansowane">🟡 Średnio zaawansowane</option>
              <option value="zaawansowane">🔴 Zaawansowane</option>
            </select>
          </div>
          <div className="form-group">
            <label>Opis</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Opis ćwiczenia..." />
          </div>
          <div className="form-group">
            <label>Wskazówki dla trenera</label>
            <textarea value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} placeholder="Wskazówki..." />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Zapisz ćwiczenie</button>
        </form>
      </BottomSheet>
    </>
  );
}
