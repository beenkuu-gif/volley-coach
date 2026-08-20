// volley-coach/src/components/DrillsScreen.jsx
import { useState } from 'react';
import { useDrills } from '../contexts/DrillsContext';
import BottomSheet from './BottomSheet';

const CATEGORIES = ['Wszystkie', 'Rozgrzewka', 'Zagrywka', 'Przyjęcie', 'Atak', 'Blok', 'Obrona', 'Gra', 'Siłownia'];

export default function DrillsScreen() {
  const { drills, addDrill } = useDrills();
  const [activeCategory, setActiveCategory] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Rozgrzewka', description: '', tips: '' });

  const filtered = drills.filter((d) => {
    const matchCat = activeCategory === 'Wszystkie' || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addDrill(form);
    setForm({ name: '', category: 'Rozgrzewka', description: '', tips: '' });
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

      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
        ))}
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
              <span className={`badge badge-${d.category}`}>{d.category}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
              {d.description.slice(0, 70)}{d.description.length > 70 ? '…' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Drill detail */}
      <BottomSheet isOpen={!!selectedDrill} onClose={() => setSelectedDrill(null)} title={selectedDrill?.name ?? ''}>
        {selectedDrill && (
          <>
            <span className={`badge badge-${selectedDrill.category}`} style={{ marginBottom: 14, display: 'inline-block' }}>{selectedDrill.category}</span>
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