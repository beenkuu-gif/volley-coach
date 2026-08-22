import { useAuth } from '../contexts/AuthContext.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

const NAV_ITEMS = [
  { id: 'drills',     label: 'Ćwiczenia',  icon: '📚' },
  { id: 'trainings',  label: 'Treningi',   icon: '🏋️' },
  { id: 'matches',    label: 'Mecze',      icon: '🏐' },
  { id: 'attendance', label: 'Obecności',  icon: '✅' },
  { id: 'teams',      label: 'Drużyny',    icon: '👥' },
];

export default function Layout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const allItems = [
    ...NAV_ITEMS,
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', background: '#0f172a' }}>
        {/* Sidebar */}
        <aside style={{
          width: 220,
          flexShrink: 0,
          background: 'rgba(255,255,255,.03)',
          borderRight: '1px solid rgba(255,255,255,.07)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ fontSize: 22 }}>🏐</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginTop: 4 }}>Volley Coach</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 2 }}>Panel trenera</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 8px', overflow: 'auto' }}>
            {allItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 12px',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    marginBottom: 2,
                    background: active ? 'rgba(99,102,241,.2)' : 'transparent',
                    color: active ? '#a5b4fc' : 'rgba(255,255,255,.55)',
                    fontWeight: active ? 700 : 500,
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'background .15s',
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            <button onClick={logout} style={{
              width: '100%', padding: '7px', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 7, background: 'transparent', color: 'rgba(255,255,255,.4)',
              cursor: 'pointer', fontSize: 13,
            }}>
              Wyloguj
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    );
  }

  // Mobile: bottom nav
  return (
    <div style={{ paddingBottom: 64, background: '#0f172a', minHeight: '100dvh' }}>
      {children}

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#111827',
        borderTop: '1px solid rgba(255,255,255,.07)',
        display: 'flex',
        zIndex: 100,
      }}>
        {allItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '8px 4px 10px', border: 'none',
                background: 'transparent', cursor: 'pointer', gap: 2,
                color: active ? '#818cf8' : 'rgba(255,255,255,.35)',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
