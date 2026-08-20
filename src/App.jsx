// volley-coach/src/App.jsx
import { useState } from 'react';
import DrillsScreen from './components/DrillsScreen.jsx';
import TeamsScreen from './components/TeamsScreen.jsx';
import TrainingList from './components/TrainingList.jsx';
import MatchesScreen from './components/MatchesScreen.jsx';

const TABS = [
  { id: 'drills',     label: 'Ćwiczenia',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
  { id: 'trainings',  label: 'Treningi',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'matches',    label: 'Mecze',      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> },
  { id: 'attendance', label: 'Obecności',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { id: 'teams',      label: 'Drużyny',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
];

export default function App() {
  const [nav, setNav] = useState({ tab: 'drills', subScreen: null, params: {} });

  function navigate(tab, subScreen = null, params = {}) {
    setNav({ tab, subScreen, params });
  }

  function renderTab() {
    const props = { nav, navigate };
    switch (nav.tab) {
      case 'drills':     return <DrillsScreen {...props} />;
      case 'trainings':  return <TrainingList {...props} />;
      case 'matches':    return <MatchesScreen {...props} />;
      case 'attendance': return <TrainingList />;
      case 'teams':      return <TeamsScreen {...props} />;
      default:           return <DrillsScreen {...props} />;
    }
  }

  return (
    <>
      {renderTab()}
      <nav className="bottom-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-item ${nav.tab === t.id ? 'active' : ''}`}
            onClick={() => navigate(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}
