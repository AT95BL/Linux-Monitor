import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:8080/api';

const COLORS = {
  cpu: '#f5a623',
  ram: '#7eb26d',
  rx: '#64b5f6',
  tx: '#ce93d8',
  bg: '#111217',
  panel: '#181b1f',
  border: '#2a2d35',
  text: '#d8d9da',
  muted: '#6c7284',
};

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [audit, setAudit] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      const [usersRes, statsRes, auditRes] = await Promise.all([
        axios.get(`${API}/admin/users`, { headers: authHeader }),
        axios.get(`${API}/admin/stats`, { headers: authHeader }),
        axios.get(`${API}/admin/audit`, { headers: authHeader }),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setAudit(auditRes.data);
    } catch (err) {
      console.error('Admin fetch error', err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateRole = async (id, role) => {
    await axios.put(`${API}/admin/users/${id}/role`,
      { role }, { headers: authHeader });
    fetchAll();
  };

  const toggleStatus = async (id) => {
    await axios.put(`${API}/admin/users/${id}/status`,
      {}, { headers: authHeader });
    fetchAll();
  };

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    background: activeTab === tab ? '#1f60c4' : 'transparent',
    color: activeTab === tab ? 'white' : COLORS.muted,
    border: `1px solid ${activeTab === tab ? '#1f60c4' : COLORS.border}`,
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '8px',
  });

  return (
    <div style={{ padding: '20px 24px' }}>

      {/* Summary cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'TOTAL USERS', value: stats.totalUsers, color: COLORS.cpu },
            { label: 'ACTIVE USERS', value: stats.activeUsers, color: COLORS.ram },
            { label: 'METRIC SNAPSHOTS', value: stats.totalMetricSnapshots, color: COLORS.rx },
            { label: 'COLLECTING SINCE', value: stats.oldestMetric?.split('T')[0] || 'N/A', color: COLORS.tx },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', borderTop: `2px solid ${color}` }}>
              <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</div>
              <div style={{ color: COLORS.text, fontSize: '26px', fontWeight: '300' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: '16px' }}>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
        <button style={tabStyle('audit')} onClick={() => setActiveTab('audit')}>Audit Log</button>
      </div>

      {/* Users tab */}
      {activeTab === 'users' && (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>USER MANAGEMENT</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {['ID', 'USERNAME', 'EMAIL', 'ROLE', 'LAST LOGIN', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.6px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #1a1d23' }}>
                  <td style={{ padding: '10px 12px', color: COLORS.muted, fontFamily: 'monospace' }}>{user.id}</td>
                  <td style={{ padding: '10px 12px', color: COLORS.text, fontWeight: '500' }}>{user.username}</td>
                  <td style={{ padding: '10px 12px', color: COLORS.muted }}>{user.email}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <select
                      value={user.role}
                      onChange={e => updateRole(user.id, e.target.value)}
                      style={{ background: '#1e2128', color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      {['CLIENT', 'MODERATOR', 'ADMIN'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 12px', color: COLORS.muted, fontSize: '12px' }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px',
                      background: user.active ? 'rgba(126,178,109,0.15)' : 'rgba(224,82,99,0.15)',
                      color: user.active ? COLORS.ram : '#e05263'
                    }}>
                      {user.active ? 'ACTIVE' : 'BANNED'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      style={{
                        padding: '4px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '3px', border: 'none',
                        background: user.active ? 'rgba(224,82,99,0.2)' : 'rgba(126,178,109,0.2)',
                        color: user.active ? '#e05263' : COLORS.ram
                      }}
                    >
                      {user.active ? 'Ban' : 'Unban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit log tab */}
      {activeTab === 'audit' && (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>AUDIT LOG</div>
          {audit.length === 0 ? (
            <p style={{ color: COLORS.muted, fontSize: '13px' }}>No audit entries yet — actions like role changes and bans will appear here.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {['TIME', 'PERFORMED BY', 'ACTION', 'DETAILS'].map(h => (
                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audit.map(entry => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #1a1d23' }}>
                    <td style={{ padding: '8px 12px', color: COLORS.muted, fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(entry.performedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '8px 12px', color: COLORS.cpu, fontWeight: '500' }}>{entry.performedBy}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px',
                        background: entry.action.includes('BAN') ? 'rgba(224,82,99,0.15)' : 'rgba(31,96,196,0.15)',
                        color: entry.action.includes('BAN') ? '#e05263' : '#64b5f6'
                      }}>
                        {entry.action}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: COLORS.muted }}>{entry.targetUser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: COLORS.bg, fontFamily: '"Inter", "Segoe UI", Arial, sans-serif' }}>
      <div style={{ background: COLORS.panel, padding: '40px', borderRadius: '4px', width: '340px', border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.cpu }} />
          <span style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px' }}>Linux Monitor</span>
        </div>
        {error && <p style={{ color: '#e05263', marginBottom: '12px', fontSize: '13px', background: 'rgba(224,82,99,0.1)', padding: '8px 12px', borderRadius: '3px', borderLeft: '3px solid #e05263' }}>{error}</p>}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>USERNAME</label>
          <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '3px', border: `1px solid ${COLORS.border}`, background: '#0d0f13', color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '3px', border: `1px solid ${COLORS.border}`, background: '#0d0f13', color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '9px', background: '#1f60c4', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
          Log in
        </button>
        <button onClick={onRegister}
          style={{ width: '100%', padding: '9px', background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: '3px', cursor: 'pointer', fontSize: '14px', marginBottom: '12px' }}>
          Create account
        </button>
        <div style={{ textAlign: 'center' }}>
          <button onClick={onPreview}
            style={{ background: 'none', border: 'none', color: COLORS.muted, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: COLORS.bg, fontFamily: '"Inter", "Segoe UI", Arial, sans-serif' }}>
      <div style={{ background: COLORS.panel, padding: '40px', borderRadius: '4px', width: '340px', border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.ram }} />
          <span style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600' }}>Create account</span>
        </div>
        {error && <p style={{ color: '#e05263', marginBottom: '12px', fontSize: '13px', background: 'rgba(224,82,99,0.1)', padding: '8px 12px', borderRadius: '3px', borderLeft: '3px solid #e05263' }}>{error}</p>}
        {['username', 'email', 'password'].map(field => (
          <div key={field} style={{ marginBottom: '12px' }}>
            <label style={{ color: COLORS.muted, fontSize: '12px', display: 'block', marginBottom: '6px' }}>{field.toUpperCase()}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '3px', border: `1px solid ${COLORS.border}`, background: '#0d0f13', color: COLORS.text, fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        ))}
        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '9px', background: '#1f60c4', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '12px', marginTop: '8px' }}>
          Register
        </button>
        <div style={{ textAlign: 'center' }}>
          <button onClick={onBack}
            style={{ background: 'none', border: 'none', color: COLORS.muted, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color, sub, locked }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', borderTop: `2px solid ${color}`, position: 'relative', overflow: 'hidden' }}>
      {locked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,18,23,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</span>
          <span style={{ color: COLORS.muted, fontSize: '12px' }}>Sign in to view</span>
        </div>
      )}
      <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color: COLORS.text, fontSize: '28px', fontWeight: '300', lineHeight: 1 }}>
        {value}<span style={{ fontSize: '14px', color: COLORS.muted, marginLeft: '4px' }}>{unit}</span>
      </div>
      {sub && <div style={{ color: COLORS.muted, fontSize: '12px', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}

function MiniChart({ data, dataKey, color, label, locked }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
      {locked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,18,23,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</span>
          <span style={{ color: COLORS.muted, fontSize: '12px' }}>Sign in to view</span>
        </div>
      )}
      <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>{label}</div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
          <YAxis stroke="transparent" tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <XAxis dataKey="time" hide />
          <Tooltip contentStyle={{ background: '#1e2128', border: `1px solid ${COLORS.border}`, borderRadius: '3px', fontSize: '12px' }} itemStyle={{ color }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const isGuest = !user;
    
  // Admin
  const [showAdmin, setShowAdmin] = useState(false);

  const fetchStats = async () => {
    try {
      const headers = user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
      const res = await axios.get(`${API}/stats`, { headers });
      setStats(res.data);
      setHistory(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        cpu: res.data.cpu,
        ram: res.data.ram.percent,
        rx: res.data.network.rx_mb,
        tx: res.data.network.tx_mb,
      }].slice(-30));
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div style={{ color: COLORS.muted, textAlign: 'center', marginTop: '80px', fontFamily: 'Arial' }}>Connecting...</div>;

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', color: COLORS.text }}>

      {/* Topbar */}
      <div style={{ background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`, padding: '0 24px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7eb26d' }} />
          <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.3px' }}>Linux Monitor</span>
          <span style={{ color: COLORS.muted, fontSize: '12px', marginLeft: '8px' }}>— {stats.os}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isGuest ? (
            <span style={{ fontSize: '12px', color: COLORS.muted }}>
              Viewing as <span style={{ color: COLORS.cpu }}>Guest</span>
            </span>
          ) : (
            <span style={{ fontSize: '12px', color: COLORS.muted }}>
              {user.username} <span style={{ color: COLORS.cpu, fontWeight: '600' }}>{user.role}</span>
            </span>
          )}
          <button onClick={onLogout}
            style={{ padding: '4px 12px', background: 'transparent', color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
            {isGuest ? 'Sign in' : 'Sign out'}
          </button>
        </div>

        {/* Admin */}
        {!isGuest && user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowAdmin(prev => !prev)}
            style={{
              padding: '4px 14px', background: showAdmin ? '#1f60c4' : 'transparent',
              color: showAdmin ? 'white' : COLORS.muted,
              border: `1px solid ${showAdmin ? '#1f60c4' : COLORS.border}`,
              borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginLeft: '16px'
            }}
          >
            Admin Panel
          </button>
        )}
      </div>

      {/* Guest banner */}
      {isGuest && (
        <div style={{ background: 'rgba(31,96,196,0.15)', borderBottom: `1px solid rgba(31,96,196,0.3)`, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#64b5f6', fontSize: '13px' }}>
            You're viewing a limited preview. Sign in to see network stats, process table, and historical graphs.
          </span>
          <button onClick={onLogout}
            style={{ padding: '5px 14px', background: '#1f60c4', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '16px' }}>
            Sign in / Register
          </button>
        </div>
      )}

      {showAdmin
        ? <AdminPanel token={localStorage.getItem('token')} />
        : (
        <div style={{ padding: '20px 24px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <StatCard label="CPU USAGE" value={stats.cpu} unit="%" color={COLORS.cpu} />
          <StatCard label="RAM USAGE" value={stats.ram.percent} unit="%" color={COLORS.ram} sub={`${stats.ram.used_mb} MB / ${stats.ram.total_mb} MB`} />
          <StatCard label="NETWORK RX" value={stats.network.rx_mb} unit="MB" color={COLORS.rx} locked={isGuest} />
          <StatCard label="NETWORK TX" value={stats.network.tx_mb} unit="MB" color={COLORS.tx} locked={isGuest} />
        </div>

        {/* CPU chart */}
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>CPU USAGE — REAL-TIME</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={history} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1f2229" />
              <XAxis dataKey="time" stroke={COLORS.border} tick={{ fill: COLORS.muted, fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis stroke={COLORS.border} tick={{ fill: COLORS.muted, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e2128', border: `1px solid ${COLORS.border}`, borderRadius: '3px', fontSize: '12px' }} itemStyle={{ color: COLORS.cpu }} />
              <Line type="monotone" dataKey="cpu" stroke={COLORS.cpu} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mini charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <MiniChart data={history} dataKey="ram" color={COLORS.ram} label="RAM % — REAL-TIME" />
          <MiniChart data={history} dataKey="rx" color={COLORS.rx} label="NETWORK RX — REAL-TIME" locked={isGuest} />
          <MiniChart data={history} dataKey="tx" color={COLORS.tx} label="NETWORK TX — REAL-TIME" locked={isGuest} />
        </div>

        {/* Processes */}
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
          {isGuest && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,18,23,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)', zIndex: 1 }}>
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</span>
              <span style={{ color: COLORS.text, fontSize: '14px', marginBottom: '4px' }}>Process monitoring requires an account</span>
              <span style={{ color: COLORS.muted, fontSize: '12px' }}>Sign in or register to view top processes</span>
            </div>
          )}
          <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>TOP PROCESSES — BY CPU</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {['PID', 'PROCESS', 'MEMORY %', 'CPU %'].map(h => (
                  <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.6px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.processes && stats.processes.length > 0
                ? stats.processes.map((proc, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1d23' }}>
                    <td style={{ padding: '8px 12px', color: COLORS.muted, fontFamily: 'monospace' }}>{proc.pid}</td>
                    <td style={{ padding: '8px 12px', color: COLORS.text, fontWeight: '500' }}>{proc.name}</td>
                    <td style={{ padding: '8px 12px', color: COLORS.rx }}>{proc.mem}%</td>
                    <td style={{ padding: '8px 12px', color: COLORS.cpu, fontWeight: '600' }}>{proc.cpu}%</td>
                  </tr>
                ))
                : <tr><td colSpan="4" style={{ padding: '16px 12px', color: COLORS.muted, fontSize: '13px' }}>No process data available</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
        )
      }
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('login'); // login | register | dashboard | preview
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token, role: localStorage.getItem('role'), username: localStorage.getItem('username') } : null;
  });

  useEffect(() => {
    if (user) setScreen('dashboard');
  }, []);

  const handleLogin = (data) => { setUser(data); setScreen('dashboard'); };
  const handleLogout = () => { localStorage.clear(); setUser(null); setScreen('login'); };

  if (screen === 'dashboard' || screen === 'preview') {
    return <Dashboard user={screen === 'preview' ? null : user} onLogout={handleLogout} />;
  }
  if (screen === 'register') {
    return <Register onBack={() => setScreen('login')} onRegistered={handleLogin} />;
  }
  return (
    <Login
      onLogin={handleLogin}
      onRegister={() => setScreen('register')}
      onPreview={() => setScreen('preview')}
    />
  );
}

export default App;
