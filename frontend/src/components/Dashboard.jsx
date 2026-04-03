import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API, COLORS } from '../constants';
import StatCard from './StatCard';
import MiniChart from './MiniChart';
import AdminPanel from './AdminPanel';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const isGuest = !user;

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

  if (!stats) return (
    <div style={{ color: COLORS.muted, textAlign: 'center', marginTop: '80px', fontFamily: 'Arial' }}>
      Connecting...
    </div>
  );

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', color: COLORS.text }}>

      {/* Topbar */}
      <div style={{
        background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`,
        padding: '0 24px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7eb26d' }} />
          <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.3px' }}>Linux Monitor</span>
          <span style={{ color: COLORS.muted, fontSize: '12px', marginLeft: '8px' }}>— {stats.os}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isGuest && user?.role === 'ADMIN' && (
            <button onClick={() => setShowAdmin(prev => !prev)} style={{
              padding: '4px 14px',
              background: showAdmin ? '#1f60c4' : 'transparent',
              color: showAdmin ? 'white' : COLORS.muted,
              border: `1px solid ${showAdmin ? '#1f60c4' : COLORS.border}`,
              borderRadius: '3px', cursor: 'pointer', fontSize: '12px'
            }}>
              Admin Panel
            </button>
          )}
          {isGuest ? (
            <span style={{ fontSize: '12px', color: COLORS.muted }}>
              Viewing as <span style={{ color: COLORS.cpu }}>Guest</span>
            </span>
          ) : (
            <span style={{ fontSize: '12px', color: COLORS.muted }}>
              {user.username} <span style={{ color: COLORS.cpu, fontWeight: '600' }}>{user.role}</span>
            </span>
          )}
          <button onClick={onLogout} style={{
            padding: '4px 12px', background: 'transparent', color: COLORS.muted,
            border: `1px solid ${COLORS.border}`, borderRadius: '3px', cursor: 'pointer', fontSize: '12px'
          }}>
            {isGuest ? 'Sign in' : 'Sign out'}
          </button>
        </div>
      </div>

      {/* Guest banner */}
      {isGuest && (
        <div style={{
          background: 'rgba(31,96,196,0.15)', borderBottom: `1px solid rgba(31,96,196,0.3)`,
          padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ color: '#64b5f6', fontSize: '13px' }}>
            You're viewing a limited preview. Sign in to see network stats, process table, and historical graphs.
          </span>
          <button onClick={onLogout} style={{
            padding: '5px 14px', background: '#1f60c4', color: 'white',
            border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px',
            whiteSpace: 'nowrap', marginLeft: '16px'
          }}>
            Sign in / Register
          </button>
        </div>
      )}

      {showAdmin
        ? <AdminPanel token={localStorage.getItem('token')} />
        : (
          <div style={{ padding: '20px 24px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <StatCard label="CPU USAGE" value={stats.cpu} unit="%" color={COLORS.cpu} />
              <StatCard label="RAM USAGE" value={stats.ram.percent} unit="%" color={COLORS.ram} sub={`${stats.ram.used_mb} MB / ${stats.ram.total_mb} MB`} />
              <StatCard label="NETWORK RX" value={stats.network.rx_mb} unit="MB" color={COLORS.rx} locked={isGuest} />
              <StatCard label="NETWORK TX" value={stats.network.tx_mb} unit="MB" color={COLORS.tx} locked={isGuest} />
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <MiniChart data={history} dataKey="ram" color={COLORS.ram} label="RAM % — REAL-TIME" />
              <MiniChart data={history} dataKey="rx" color={COLORS.rx} label="NETWORK RX — REAL-TIME" locked={isGuest} />
              <MiniChart data={history} dataKey="tx" color={COLORS.tx} label="NETWORK TX — REAL-TIME" locked={isGuest} />
            </div>

            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
              {isGuest && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(17,18,23,0.9)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(3px)', zIndex: 1
                }}>
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

export default Dashboard;