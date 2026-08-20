// src/components/CourtView.jsx
export default function CourtView({ matchId, team, onBack }) {
  return (
    <div style={{padding: 16, minHeight: '100dvh', background: 'var(--color-bg)'}}>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginBottom: 16}}>← Wróć</button>
      <p style={{color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 40}}>Widok boiska — wkrótce</p>
    </div>
  );
}
