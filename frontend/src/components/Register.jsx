import React, { useState } from 'react';
import axios from 'axios';
import { API, COLORS } from '../constants';

function Register({ onBack, onRegistered }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      onRegistered(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.ram }} />
          <span style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600' }}>Create account</span>
        </div>

        {error && (
          <p style={{
            color: '#e05263', marginBottom: '12px', fontSize: '13px',
            background: 'rgba(224,82,99,0.1)', padding: '8px 12px',
            borderRadius: '3px', borderLeft: '3px solid #e05263'
          }}>{error}</p>
        )}

        {['username', 'email', 'password'].map(field => (
          <div key={field} style={{ marginBottom: '12px' }}>
            <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>
              {field.toUpperCase()}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '3px',
                border: `1px solid ${COLORS.border}`, background: '#0d0f13',
                color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>
        ))}

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '9px', background: '#1f60c4', color: 'white',
          border: 'none', borderRadius: '3px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500', marginBottom: '12px', marginTop: '8px'
        }}>
          Register
        </button>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: COLORS.muted,
            fontSize: '13px', cursor: 'pointer', textDecoration: 'underline'
          }}>
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;