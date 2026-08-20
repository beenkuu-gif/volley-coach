// src/components/MatchDetail.jsx
export default function MatchDetail({ matchId, onBack }) {
  return (
    <div className="screen">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{margin: 16}}>← Mecze</button>
      <p style={{padding: 16, color: 'var(--color-text-muted)'}}>Szczegóły meczu — wkrótce</p>
    </div>
  );
}
