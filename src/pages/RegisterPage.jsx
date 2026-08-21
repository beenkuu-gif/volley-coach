import { useState } from 'react';
import api from '../services/api';

export default function RegisterPage({ onBack }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/register', { name, email, password });
      setDone(true);
    } catch (err) {
      setError(err.message ?? 'Błąd rejestracji');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Konto utworzone!</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, maxWidth: 280 }}>
          Twoje konto czeka na aktywację przez administratora. Skontaktuj się z trenerem głównym.
        </p>
        <button onClick={onBack}
          style={{ marginTop: 24, padding: '12px 28px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          Wróć do logowania
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Rejestracja trenera</h2>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}

        {[
          { value: name, set: setName, placeholder: 'Imię i nazwisko', type: 'text', auto: 'name' },
          { value: email, set: setEmail, placeholder: 'Email', type: 'email', auto: 'email' },
          { value: password, set: setPassword, placeholder: 'Hasło (min. 6 znaków)', type: 'password', auto: 'new-password' },
        ].map((f) => (
          <div key={f.placeholder} style={{ marginBottom: 12 }}>
            <input
              type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)}
              placeholder={f.placeholder} required autoComplete={f.auto}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, fontSize: 15, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(79,70,229,.5)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
      </form>

      <button onClick={onBack}
        style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 14 }}>
        ← Wróć do logowania
      </button>
    </div>
  );
}
