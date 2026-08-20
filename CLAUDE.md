# Volley Coach — Developer Guide

## Running the app
```bash
cd volley-coach
npm run dev        # dev server on localhost:5173
npm test           # run Vitest tests
npm run build      # production build
```

## Architecture
- **State:** 4 Context providers (DrillsContext, TeamsContext, TrainingsContext, MatchesContext). Each wraps `useLocalStorage` — no prop drilling.
- **Routing:** Simple `{tab, subScreen, params}` state in App.jsx. Bottom nav controls tab; each tab component manages its own sub-screens.
- **Persistence:** All data in localStorage under `vc_*` keys. Seed data loads once (when key is absent).

## Key files
- `src/hooks/useLocalStorage.js` — localStorage sync hook
- `src/utils/stats.js` — stat % calculations, rotateCourt(), matchScore()
- `src/data/seedData.js` — 14 drills, 2 teams (loads on first run)
- `src/components/BottomSheet.jsx` — reusable modal component
- `src/components/CourtView.jsx` — live match stats (most complex screen)

## Data models
See `docs/superpowers/specs/2026-08-20-volley-coach-design.md` for full schema.

## Adding features
1. New screen → create `src/components/NewScreen.jsx`
2. New data type → add context in `src/contexts/`, wrap in `main.jsx`
3. New localStorage key → prefix with `vc_`
