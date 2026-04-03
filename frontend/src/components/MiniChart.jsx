import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '../constants';

function MiniChart({ data, dataKey, color, label, locked }) {
  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '3px',
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(17,18,23,0.85)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🔒</span>
          <span style={{ color: COLORS.muted, fontSize: '12px' }}>Sign in to view</span>
        </div>
      )}
      <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '12px' }}>{label}</div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
          <YAxis stroke="transparent" tick={{ fill: COLORS.muted, fontSize: 10 }} />
          <XAxis dataKey="time" hide />
          <Tooltip
            contentStyle={{ background: '#1e2128', border: `1px solid ${COLORS.border}`, borderRadius: '3px', fontSize: '12px' }}
            itemStyle={{ color }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniChart;