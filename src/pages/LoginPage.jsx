import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import RegisterPage from './RegisterPage';

export default function LoginPage() {
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  if (showRegister) return <RegisterPage onBack={() => setShowRegister(false)} />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.post('/api/auth/login', { email, password });
      login(token, user);
    } catch (err) {
      setError(err.message ?? 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏐</div>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Volley Coach</h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, margin: '4px 0 0' }}>Akademia Talentów Volley Team Radom</p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required autoComplete="email"
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, fontSize: 15, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło" required autoComplete="current-password"
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, fontSize: 15, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(79,70,229,.5)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 16 }}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <button onClick={() => setShowRegister(true)}
        style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 14 }}>
        Nie masz konta? Zarejestruj się
      </button>
    </div>
  );
}
