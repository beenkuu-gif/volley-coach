// volley-coach/src/components/DrillsScreen.jsx
import { useState } from 'react';
import { useDrills } from '../contexts/DrillsContext';
import { useAuth } from '../contexts/AuthContext';
import BottomSheet from './BottomSheet';

const CATEGORIES   = ['Wszystkie', 'Rozgrzewka', 'Zagrywka', 'Przyjęcie', 'Atak', 'Blok', 'Obrona', 'Gra', 'Ustawienia', 'Siłownia'];
const DIFFICULTIES = ['Wszystkie', 'podstawowe', 'średnio zaawansowane', 'zaawansowane'];

const DIFF_LABEL = {
  'podstawowe':           '🟢 Podstawowe',
  'średnio zaawansowane': '🟡 Średnio zaaw.',
  'zaawansowane':         '🔴 Zaawansowane',
};

function diffClass(d) {
  if (d === 'zaawansowane')         return 'diff-badge diff-zaawansowane';
  if (d === 'średnio zaawansowane') return 'diff-badge diff-srednie';
  return 'diff-badge diff-podstawowe';
}

const EMPTY_FORM = { name: '', category: 'Rozgrzewka', difficulty: 'podstawowe', description: '', tips: '' };

export default function DrillsScreen() {
  const { drills, addDrill, updateDrill, deleteDrill, publishDrill } = useDrills();
  const { user } = useAuth();

  const [activeCategory,   setActiveCategory]   = useState('Wszystkie');
  const [activeDifficulty, setActiveDifficulty] = useState('Wszystkie');
  const [search,      setSearch]      = useState('');
  const [showAdd,     setShowAdd]     = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [editingDrill,  setEditingDrill]  = useState(null); // drill being edited
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [publishing,  setPublishing]  = useState(false);

  const filtered = drills.filter((d) => {
    if (activeCategory   !== 'Wszystkie' && d.category   !== activeCategory)   return false;
    if (activeDifficulty !== 'Wszystkie' && d.difficulty !== activeDifficulty) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()))        return false;
    return true;
  });

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingDrill(null);
    setShowAdd(true);
  }

  function openEdit(drill) {
    setForm({ name: drill.name, category: drill.category, difficulty: drill.difficulty ?? 'podstawowe', description: drill.description ?? '', tips: drill.tips ?? '' });
    setEditingDrill(drill);
    setSelectedDrill(null);
    setShowAdd(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingDrill) {
      await updateDrill(editingDrill.id, form);
    } else {
      await addDrill(form);
    }
    setForm(EMPTY_FORM);
    setEditingDrill(null);
    setShowAdd(false);
  }

  async function handleDelete(drill) {
    if (!window.confirm(`Usunąć "${drill.name}"?`)) return;
    await deleteDrill(drill.id);
    setSelectedDrill(null);
  }

  async function handlePublish(drill) {
    if (!window.confirm(`Wysłać "${drill.name}" do bazy globalnej? Wszyscy trenerzy zobaczą to ćwiczenie.`)) return;
    setPublishing(true);
    try {
      await publishDrill(drill.id);
      setSelectedDrill(null);
    } finally {
      setPublishing(false);
    }
  }

  const isOwn = (d) => !d.is_global && d.owner_id === user?.id;

  return (
    <>
      <div className="top-bar">
        <h1>Ćwiczenia</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Dodaj</button>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{d.name}</span>
                {isOwn(d) && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--color-accent)', color: '#fff', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>Moje</span>
                )}
              </div>
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
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              <span className={diffClass(selectedDrill.difficulty)}>{selectedDrill.difficulty ?? 'podstawowe'}</span>
              <span className={`badge badge-${selectedDrill.category}`}>{selectedDrill.category}</span>
              {selectedDrill.is_global && (
                <span style={{ fontSize: 10, background: '#0d9488', color: '#fff', borderRadius: 10, padding: '2px 7px', fontWeight: 700 }}>Globalne</span>
              )}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Opis</h3>
            <p style={{ marginBottom: 16, lineHeight: 1.6 }}>{selectedDrill.description}</p>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>Wskazówki dla trenera</h3>
            <p style={{ lineHeight: 1.6, marginBottom: 20 }}>{selectedDrill.tips}</p>

            {/* Own drill actions */}
            {isOwn(selectedDrill) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(selectedDrill)}>✎ Edytuj ćwiczenie</button>
                <button className="btn btn-primary btn-sm" onClick={() => handlePublish(selectedDrill)} disabled={publishing}>
                  {publishing ? 'Wysyłanie...' : '🌐 Wyślij do bazy globalnej'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selectedDrill)}>Usuń</button>
              </div>
            )}
          </>
        )}
      </BottomSheet>

      {/* Add / Edit drill */}
      <BottomSheet isOpen={showAdd} onClose={() => { setShowAdd(false); setEditingDrill(null); }}
        title={editingDrill ? 'Edytuj ćwiczenie' : 'Nowe ćwiczenie'}>
        <form onSubmit={handleSave}>
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
          <button type="submit" className="btn btn-primary btn-full">
            {editingDrill ? 'Zapisz zmiany' : 'Dodaj ćwiczenie'}
          </button>
        </form>
      </BottomSheet>
    </>
  );
}
