// volley-coach/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { DrillsProvider } from './contexts/DrillsContext.jsx';
import { TeamsProvider } from './contexts/TeamsContext.jsx';
import { TrainingsProvider } from './contexts/TrainingsContext.jsx';
import { MatchesProvider } from './contexts/MatchesContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DrillsProvider>
      <TeamsProvider>
        <TrainingsProvider>
          <MatchesProvider>
            <App />
          </MatchesProvider>
        </TrainingsProvider>
      </TeamsProvider>
    </DrillsProvider>
  </StrictMode>
);
