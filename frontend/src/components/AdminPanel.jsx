import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, COLORS } from '../constants';

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
    await axios.put(`${API}/admin/users/${id}/role`, { role }, { headers: authHeader });
    fetchAll();
  };

  const toggleStatus = async (id) => {
    await axios.put(`${API}/admin/users/${id}/status`, {}, { headers: authHeader });
    fetchAll();
  };

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    background: activeTab === tab ? '#1f60c4' : 'transparent',
    color: activeTab === tab ? 'white' : COLORS.muted,
    border: `1px solid ${activeTab === tab ? '#1f60c4' : COLORS.border}`,
    borderRadius: '3px', cursor: 'pointer', fontSize: '13px', marginRight: '8px',
  });

  return (
    <div style={{ padding: '20px 24px' }}>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'TOTAL USERS', value: stats.totalUsers, color: COLORS.cpu },
            { label: 'ACTIVE USERS', value: stats.activeUsers, color: COLORS.ram },
            { label: 'METRIC SNAPSHOTS', value: stats.totalMetricSnapshots, color: COLORS.rx },
            { label: 'COLLECTING SINCE', value: stats.oldestMetric?.split('T')[0] || 'N/A', color: COLORS.tx },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: COLORS.panel, border: `1px solid ${COLORS.border}`,
              borderRadius: '3px', padding: '16px 20px', borderTop: `2px solid ${color}`
            }}>
              <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</div>
              <div style={{ color: COLORS.text, fontSize: '26px', fontWeight: '300' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users</button>
        <button style={tabStyle('audit')} onClick={() => setActiveTab('audit')}>Audit Log</button>
      </div>

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
                    <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                      style={{ background: '#1e2128', color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>
                      {['CLIENT', 'MODERATOR', 'ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
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
                    <button onClick={() => toggleStatus(user.id)} style={{
                      padding: '4px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '3px', border: 'none',
                      background: user.active ? 'rgba(224,82,99,0.2)' : 'rgba(126,178,109,0.2)',
                      color: user.active ? '#e05263' : COLORS.ram
                    }}>
                      {user.active ? 'Ban' : 'Unban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>AUDIT LOG</div>
          {audit.length === 0 ? (
            <p style={{ color: COLORS.muted, fontSize: '13px' }}>No audit entries yet.</p>
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

export default AdminPanel;