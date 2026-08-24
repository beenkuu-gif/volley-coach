import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const TABS = ['Trenerzy', 'Statystyki', 'Dane trenera', 'Ćwiczenia globalne'];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(0);

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Panel admina</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>{user.email}</span>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Wyloguj</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '0 4px' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{ flexShrink: 0, padding: '11px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              color: tab === i ? '#818cf8' : 'rgba(255,255,255,.35)',
              borderBottom: tab === i ? '2px solid #818cf8' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 14px' }}>
        {tab === 0 && <CoachesTab />}
        {tab === 1 && <StatsTab />}
        {tab === 2 && <CoachDataTab />}
        {tab === 3 && <GlobalDrillsTab />}
      </div>
    </div>
  );
}

function CoachesTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/users').then(setUsers).finally(() => setLoading(false));
  }, []);

  async function toggle(u) {
    const path = u.is_active ? `/api/admin/users/${u.id}/deactivate` : `/api/admin/users/${u.id}/activate`;
    const updated = await api.patch(path);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
  }

  if (loading) return <p style={{ color: 'rgba(255,255,255,.4)' }}>Ładowanie...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {users.map((u) => (
        <div key={u.id} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{u.name}</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>{u.email}</div>
            <div style={{ marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: u.is_active ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)',
                color: u.is_active ? '#34d399' : '#f87171' }}>
                {u.is_active ? 'Aktywny' : 'Oczekuje'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginLeft: 8 }}>{u.role}</span>
            </div>
          </div>
          {u.role !== 'admin' && (
            <button onClick={() => toggle(u)} style={{
              border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: u.is_active ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)',
              color: u.is_active ? '#f87171' : '#34d399',
            }}>
              {u.is_active ? 'Zablokuj' : 'Aktywuj'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats').then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'rgba(255,255,255,.4)' }}>Ładowanie...</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 13 }}>
        <thead>
          <tr style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 700 }}>
            {['Trener', 'Drużyny', 'Treningi', 'Mecze', 'Zawodniczki'].map((h) => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.06)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <td style={{ padding: '10px 10px' }}>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>{s.email}</div>
              </td>
              {[s.teams, s.trainings, s.matches, s.players].map((v, i) => (
                <td key={i} style={{ padding: '10px', fontWeight: 700, color: Number(v) > 0 ? '#fff' : 'rgba(255,255,255,.2)' }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoachDataTab() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/admin/users').then((u) => setUsers(u.filter((x) => x.role === 'coach')));
  }, []);

  async function load(id) {
    setSelectedId(id);
    if (!id) { setData(null); return; }
    setLoading(true);
    try { setData(await api.get(`/api/admin/users/${id}/data`)); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <select value={selectedId} onChange={(e) => load(e.target.value)}
        style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, fontSize: 14, color: '#fff', marginBottom: 16, outline: 'none' }}>
        <option value="" style={{ background: '#1e293b' }}>— wybierz trenera —</option>
        {users.map((u) => <option key={u.id} value={u.id} style={{ background: '#1e293b' }}>{u.name} ({u.email})</option>)}
      </select>

      {loading && <p style={{ color: 'rgba(255,255,255,.4)' }}>Ładowanie...</p>}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Section title={`Drużyny (${data.teams.length})`}>
            {data.teams.map((t) => <Row key={t.id} label={t.name} value={`${t.players?.length ?? 0} zawodniczek`} />)}
          </Section>
          <Section title={`Treningi (${data.trainings.length})`}>
            {data.trainings.slice(0, 10).map((t) => <Row key={t.id} label={t.date} value={t.venue ?? '—'} />)}
          </Section>
          <Section title={`Mecze (${data.matches.length})`}>
            {data.matches.slice(0, 10).map((m) => <Row key={m.id} label={m.opponent} value={m.date} />)}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>{title.toUpperCase()}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '8px 12px' }}>
      <span style={{ color: '#fff', fontSize: 13 }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>{value}</span>
    </div>
  );
}

const DRILL_CATEGORIES = ['Rozgrzewka','Zagrywka','Przyjęcie','Atak','Blok','Obrona','Gra','Ustawienia','Siłownia'];
const DIFF_DOT = { 'podstawowe': '🟢', 'średnio zaawansowane': '🟡', 'zaawansowane': '🔴' };
const EMPTY_FORM = { name: '', category: 'Zagrywka', difficulty: 'podstawowe', description: '', tips: '' };

const inputStyle = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' };

function GlobalDrillsTab() {
  const [drills, setDrills] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/drills').then((d) => setDrills(d.filter((x) => x.is_global)));
  }, []);

  async function save() {
    if (!form.name) return;
    if (editId) {
      const updated = await api.put(`/api/admin/drills/${editId}`, form);
      setDrills((prev) => prev.map((d) => (d.id === editId ? updated : d)));
    } else {
      const created = await api.post('/api/admin/drills', form);
      setDrills((prev) => [...prev, created]);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  function startEdit(d) {
    setEditId(d.id);
    setForm({ name: d.name, category: d.category, difficulty: d.difficulty ?? 'podstawowe', description: d.description ?? '', tips: d.tips ?? '' });
  }

  async function remove(id) {
    if (!window.confirm('Usunąć ćwiczenie z bazy globalnej?')) return;
    await api.del(`/api/admin/drills/${id}`);
    setDrills((prev) => prev.filter((d) => d.id !== id));
  }

  const filtered = drills.filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Form */}
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
          {editId ? 'Edytuj ćwiczenie' : 'Dodaj globalne ćwiczenie'}
        </div>
        <div style={{ marginBottom: 8 }}>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nazwa ćwiczenia" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            style={{ ...inputStyle, flex: 1 }}>
            {DRILL_CATEGORIES.map((c) => <option key={c} style={{ background: '#1e293b' }}>{c}</option>)}
          </select>
          <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
            style={{ ...inputStyle, flex: 1 }}>
            <option value="podstawowe" style={{ background: '#1e293b' }}>🟢 Podstawowe</option>
            <option value="średnio zaawansowane" style={{ background: '#1e293b' }}>🟡 Średnio zaawansowane</option>
            <option value="zaawansowane" style={{ background: '#1e293b' }}>🔴 Zaawansowane</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Opis ćwiczenia" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <textarea value={form.tips} onChange={(e) => setForm((p) => ({ ...p, tips: e.target.value }))}
            placeholder="Wskazówki dla trenera" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {editId ? 'Zapisz zmiany' : 'Dodaj ćwiczenie'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}
              style={{ padding: '10px 14px', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, background: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer' }}>
              Anuluj
            </button>
          )}
        </div>
      </div>

      {/* Search + list */}
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Szukaj w bazie..."
        style={{ ...inputStyle, marginBottom: 10 }} />
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>
        ĆWICZENIA GLOBALNE ({filtered.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((d) => (
          <div key={d.id} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{d.name}</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>
                {d.category} · {DIFF_DOT[d.difficulty] ?? '🟢'} {d.difficulty ?? 'podstawowe'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => startEdit(d)}
                style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>✎</button>
              <button onClick={() => remove(d.id)}
                style={{ background: 'rgba(239,68,68,.15)', border: 'none', color: '#f87171', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
