// volley-coach/src/App.jsx
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import { DrillsProvider } from './contexts/DrillsContext.jsx';
import { TeamsProvider } from './contexts/TeamsContext.jsx';
import { TrainingsProvider } from './contexts/TrainingsContext.jsx';
import { MatchesProvider } from './contexts/MatchesContext.jsx';
import DrillsScreen from './components/DrillsScreen.jsx';
import TeamsScreen from './components/TeamsScreen.jsx';
import TrainingList from './components/TrainingList.jsx';
import TrainingPlannerPC from './components/TrainingPlannerPC.jsx';
import MatchesScreen from './components/MatchesScreen.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import Layout from './components/Layout.jsx';
import { useMediaQuery } from './hooks/useMediaQuery.js';


export default function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#0f172a' }}>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Ładowanie...</span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <DrillsProvider>
      <TeamsProvider>
        <TrainingsProvider>
          <MatchesProvider>
            <AuthenticatedApp user={user} logout={logout} />
          </MatchesProvider>
        </TrainingsProvider>
      </TeamsProvider>
    </DrillsProvider>
  );
}

function AuthenticatedApp({ user, logout }) {
  const [nav, setNav] = useState({ tab: 'drills', subScreen: null, params: {} });
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function navigate(tab, subScreen = null, params = {}) {
    setNav({ tab, subScreen, params });
  }

  function renderTab() {
    const props = { nav, navigate };
    switch (nav.tab) {
      case 'drills':     return <DrillsScreen {...props} />;
      case 'trainings':  return isDesktop ? <TrainingPlannerPC /> : <TrainingList {...props} />;
      case 'matches':    return <MatchesScreen {...props} />;
      case 'attendance': return <TrainingList />;
      case 'teams':      return <TeamsScreen {...props} />;
      case 'admin':      return <AdminPage />;
      default:           return <DrillsScreen {...props} />;
    }
  }

  return (
    <Layout activeTab={nav.tab} onTabChange={(tab) => navigate(tab)}>
      {renderTab()}
    </Layout>
  );
}
