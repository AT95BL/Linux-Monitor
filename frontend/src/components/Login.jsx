import React, { useState } from 'react';
import axios from 'axios';
import { API, COLORS } from '../constants';

function Login({ onLogin, onRegister, onPreview }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data);
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', backgroundColor: COLORS.bg,
      fontFamily: '"Inter", "Segoe UI", Arial, sans-serif'
    }}>
      <div style={{
        background: COLORS.panel, padding: '40px', borderRadius: '4px',
        width: '340px', border: `1px solid ${COLORS.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.cpu }} />
          <span style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px' }}>Linux Monitor</span>
        </div>

        {error && (
          <p style={{
            color: '#e05263', marginBottom: '12px', fontSize: '13px',
            background: 'rgba(224,82,99,0.1)', padding: '8px 12px',
            borderRadius: '3px', borderLeft: '3px solid #e05263'
          }}>{error}</p>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>USERNAME</label>
          <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: '3px',
              border: `1px solid ${COLORS.border}`, background: '#0d0f13',
              color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: '3px',
              border: `1px solid ${COLORS.border}`, background: '#0d0f13',
              color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '9px', background: '#1f60c4', color: 'white',
          border: 'none', borderRadius: '3px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500', marginBottom: '12px'
        }}>
          Log in
        </button>

        <button onClick={onRegister} style={{
          width: '100%', padding: '9px', background: 'transparent',
          color: COLORS.text, border: `1px solid ${COLORS.border}`,
          borderRadius: '3px', cursor: 'pointer', fontSize: '14px', marginBottom: '12px'
        }}>
          Create account
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
          <div style={{ flex: 1, height: '0.5px', background: COLORS.border }} />
          <span style={{ color: COLORS.muted, fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: COLORS.border }} />
        </div>

        <button
          onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
          style={{
            width: '100%', padding: '9px', background: 'transparent',
            color: COLORS.text, border: `1px solid ${COLORS.border}`,
            borderRadius: '3px', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginBottom: '12px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onPreview} style={{
            background: 'none', border: 'none', color: COLORS.muted,
            fontSize: '13px', cursor: 'pointer', textDecoration: 'underline'
          }}>
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;