import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { DrillsProvider } from './contexts/DrillsContext.jsx';
import { TeamsProvider } from './contexts/TeamsContext.jsx';
import { TrainingsProvider } from './contexts/TrainingsContext.jsx';
import { MatchesProvider } from './contexts/MatchesContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DrillsProvider>
        <TeamsProvider>
          <TrainingsProvider>
            <MatchesProvider>
              <App />
            </MatchesProvider>
          </TrainingsProvider>
        </TeamsProvider>
      </DrillsProvider>
    </AuthProvider>
  </React.StrictMode>
);
