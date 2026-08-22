import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDrills } from '../contexts/DrillsContext';
import { useTeams } from '../contexts/TeamsContext';
import { useTrainings } from '../contexts/TrainingsContext';

const CATEGORIES = ['Rozgrzewka','Zagrywka','Przyjęcie','Atak','Blok','Obrona','Gra','Ustawienia','Siłownia'];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Drill item in the left panel
function DrillLibraryItem({ drill, onAdd }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,.04)',
      marginBottom: 4,
    }}>
      <span style={{ color: '#e2e8f0', fontSize: 13 }}>{drill.name}</span>
      <button onClick={() => onAdd(drill)} style={{
        border: 'none', background: 'rgba(99,102,241,.25)', color: '#a5b4fc',
        borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
      }}>+</button>
    </div>
  );
}

// Sortable drill inside a block
function SortableDrillInBlock({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '7px 10px', borderRadius: 7,
      background: isDragging ? 'rgba(99,102,241,.3)' : 'rgba(255,255,255,.06)',
      marginBottom: 3, cursor: 'grab',
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }}>
      <span style={{ color: '#cbd5e1', fontSize: 13 }}>{item.drillName}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,.3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px' }}
      >×</button>
    </div>
  );
}

// Block component
function TrainingBlock({ block, onUpdate, onRemove, onAddDrill, onRemoveDrill, onReorderDrills }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
      {/* Block header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
          value={block.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Nazwa bloku..."
          style={{ flex: 1, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number" min="0" max="180"
            value={block.durationMin}
            onChange={(e) => onUpdate({ durationMin: Number(e.target.value) })}
            style={{ width: 52, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, padding: '7px 8px', color: '#fff', fontSize: 13, outline: 'none', textAlign: 'center' }}
          />
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>min</span>
        </div>
        <button onClick={onRemove} style={{ border: 'none', background: 'rgba(239,68,68,.15)', color: '#f87171', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', fontSize: 13 }}>✕</button>
      </div>

      {/* Drop zone for drills */}
      <SortableContext items={block.drills.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        {block.drills.map((item) => (
          <SortableDrillInBlock key={item.id} item={item} onRemove={(id) => onRemoveDrill(block.id, id)} />
        ))}
      </SortableContext>

      {block.drills.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,.2)', fontSize: 12, textAlign: 'center', padding: '8px 0', border: '1px dashed rgba(255,255,255,.1)', borderRadius: 7 }}>
          Dodaj ćwiczenie z listy →
        </div>
      )}
    </div>
  );
}

export default function TrainingPlannerPC() {
  const { drills } = useDrills();
  const { teams } = useTeams();
  const { trainings, addTraining } = useTrainings();

  const [teamId, setTeamId]   = useState('');
  const [date, setDate]       = useState(new Date().toISOString().slice(0, 10));
  const [venue, setVenue]     = useState('');
  const [blocks, setBlocks]   = useState([]);
  const [catFilter, setCat]   = useState('');
  const [search, setSearch]   = useState('');
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [mode, setMode]       = useState('planner'); // 'planner' | 'history' | 'detail'
  const [selectedId, setSelectedId] = useState(null);

  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '— brak drużyny —';
  const drillName = (id) => drills.find((d) => d.id === id)?.name ?? id;
  const totalBlockMin = (blks) => blks.reduce((s, b) => s + (b.durationMin || 0), 0);
  const selectedTraining = trainings.find((t) => t.id === selectedId);
  const sortedTrainings = [...trainings].sort((a, b) => b.date.localeCompare(a.date));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filteredDrills = drills.filter((d) => {
    if (catFilter && d.category !== catFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function addBlock() {
    setBlocks((prev) => [...prev, { id: uid(), name: '', durationMin: 15, drills: [] }]);
  }

  function updateBlock(blockId, updates) {
    setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, ...updates } : b));
  }

  function removeBlock(blockId) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setActiveBlockId((prev) => prev === blockId ? null : prev);
  }

  function addDrillToBlock(blockId, drill) {
    setBlocks((prev) => prev.map((b) =>
      b.id === blockId
        ? { ...b, drills: [...b.drills, { id: uid(), drillId: drill.id, drillName: drill.name }] }
        : b
    ));
  }

  function removeDrillFromBlock(blockId, itemId) {
    setBlocks((prev) => prev.map((b) =>
      b.id === blockId ? { ...b, drills: b.drills.filter((d) => d.id !== itemId) } : b
    ));
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => prev.map((b) => {
      const oldIdx = b.drills.findIndex((d) => d.id === active.id);
      const newIdx = b.drills.findIndex((d) => d.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return b;
      return { ...b, drills: arrayMove(b.drills, oldIdx, newIdx) };
    }));
  }

  const totalMin = blocks.reduce((sum, b) => sum + (b.durationMin || 0), 0);

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    try {
      await addTraining({
        teamId: teamId || null,
        date,
        venue: venue || null,
        blocks: blocks.map((b, i) => ({
          name: b.name || `Blok ${i + 1}`,
          durationMin: b.durationMin,
          position: i,
          drills: b.drills.map((d, j) => ({ drillId: d.drillId, position: j })),
        })),
      });
      setSaved(true);
      setBlocks([]);
      setVenue('');
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#0f172a' }}>
        {/* LEFT: drill library */}
        <div style={{ width: '38%', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Baza ćwiczeń</div>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Szukaj..."
              style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <button onClick={() => setCat('')}
                style={{ padding: '4px 10px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: !catFilter ? '#4f46e5' : 'rgba(255,255,255,.08)', color: '#fff' }}>
                Wszystkie
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCat(c === catFilter ? '' : c)}
                  style={{ padding: '4px 10px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: catFilter === c ? '#4f46e5' : 'rgba(255,255,255,.08)', color: '#fff' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px' }}>
            {filteredDrills.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, textAlign: 'center', marginTop: 24 }}>Brak ćwiczeń</p>
            )}
            {filteredDrills.map((d) => (
              <DrillLibraryItem
                key={d.id}
                drill={d}
                onAdd={(drill) => {
                  const target = activeBlockId ?? blocks[blocks.length - 1]?.id;
                  if (target) addDrillToBlock(target, drill);
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: planner / history */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tab switcher */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 6 }}>
            {[['planner', '✏️ Kreator'], ['history', '📋 Historia']].map(([id, label]) => (
              <button key={id} onClick={() => { setMode(id); setSelectedId(null); }}
                style={{
                  padding: '7px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: mode === id || (mode === 'detail' && id === 'history') ? 'rgba(99,102,241,.35)' : 'rgba(255,255,255,.06)',
                  color: mode === id || (mode === 'detail' && id === 'history') ? '#a5b4fc' : 'rgba(255,255,255,.45)',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── PLANNER MODE ── */}
          {mode === 'planner' && (<>
            <div style={{ padding: '12px 18px 10px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)}
                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}>
                <option value="" style={{ background: '#1e293b' }}>— Drużyna —</option>
                {teams.map((t) => <option key={t.id} value={t.id} style={{ background: '#1e293b' }}>{t.name}</option>)}
              </select>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Hala / miejsce..."
                style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px' }}>
              {blocks.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 48 }}>
                  <div style={{ color: 'rgba(255,255,255,.2)', fontSize: 14, marginBottom: 16 }}>Brak bloków treningowych</div>
                  <button onClick={addBlock} style={{ background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.4)', borderRadius: 10, padding: '10px 20px', color: '#a5b4fc', cursor: 'pointer', fontWeight: 700 }}>
                    + Dodaj pierwszy blok
                  </button>
                </div>
              )}
              {blocks.map((block) => (
                <div key={block.id} onClick={() => setActiveBlockId(block.id)}
                  style={{ outline: activeBlockId === block.id ? '2px solid rgba(99,102,241,.4)' : 'none', borderRadius: 14 }}>
                  <TrainingBlock block={block} onUpdate={(u) => updateBlock(block.id, u)}
                    onRemove={() => removeBlock(block.id)} onRemoveDrill={removeDrillFromBlock} />
                </div>
              ))}
              {blocks.length > 0 && (
                <button onClick={addBlock} style={{ width: '100%', padding: '10px', border: '1px dashed rgba(255,255,255,.15)', borderRadius: 10, background: 'transparent', color: 'rgba(255,255,255,.3)', cursor: 'pointer', fontSize: 13 }}>
                  + Dodaj blok
                </button>
              )}
            </div>

            <div style={{ padding: '12px 18px 16px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
                Łączny czas: <strong style={{ color: '#fff' }}>{totalMin} min</strong>
                {' · '}
                {blocks.length} {blocks.length === 1 ? 'blok' : blocks.length < 5 ? 'bloki' : 'bloków'}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {saved && <span style={{ color: '#34d399', fontSize: 13 }}>✓ Zapisano!</span>}
                <button onClick={handleSave} disabled={saving || !date}
                  style={{
                    padding: '10px 22px', border: 'none', borderRadius: 10, cursor: saving || !date ? 'not-allowed' : 'pointer',
                    background: saving || !date ? 'rgba(79,70,229,.4)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                  }}>
                  {saving ? 'Zapisywanie...' : '💾 Zapisz trening'}
                </button>
              </div>
            </div>
          </>)}

          {/* ── HISTORY LIST MODE ── */}
          {mode === 'history' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
              {sortedTrainings.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 60, color: 'rgba(255,255,255,.25)', fontSize: 14 }}>
                  Brak zapisanych treningów.<br />
                  <span style={{ fontSize: 12, marginTop: 8, display: 'block' }}>Zaplanuj pierwszy w zakładce Kreator.</span>
                </div>
              )}
              {sortedTrainings.map((t) => (
                <div key={t.id} onClick={() => { setSelectedId(t.id); setMode('detail'); }}
                  style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,.07)', transition: 'background .15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.09)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{teamName(t.teamId)}</div>
                      <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 3 }}>
                        {t.date}{t.venue ? ` · ${t.venue}` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
                      <div>{t.blocks?.length ?? 0} bloków</div>
                      <div>{totalBlockMin(t.blocks ?? [])} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DETAIL MODE ── */}
          {mode === 'detail' && selectedTraining && (
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
              <button onClick={() => setMode('history')}
                style={{ border: 'none', background: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>
                ← Wróć do historii
              </button>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{teamName(selectedTraining.teamId)}</div>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginTop: 4 }}>
                  {selectedTraining.date}{selectedTraining.venue ? ` · ${selectedTraining.venue}` : ''}
                  {' · '}łącznie {totalBlockMin(selectedTraining.blocks ?? [])} min
                </div>
              </div>
              {(selectedTraining.blocks ?? []).map((block, i) => (
                <div key={block.id ?? i} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,.07)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{block.name || `Blok ${i + 1}`}</span>
                    <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>{block.durationMin} min</span>
                  </div>
                  {(block.drills ?? []).length === 0
                    ? <div style={{ color: 'rgba(255,255,255,.2)', fontSize: 12 }}>Brak ćwiczeń</div>
                    : (block.drills ?? []).map((d, j) => (
                      <div key={d.id ?? j} style={{ fontSize: 13, color: '#cbd5e1', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                        {drillName(d.drillId)}
                      </div>
                    ))
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
