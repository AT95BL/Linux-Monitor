import React from 'react';
import { COLORS } from '../constants';

function StatCard({ label, value, unit, color, sub, locked }) {
  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '3px',
      padding: '16px 20px',
      borderTop: `2px solid ${color}`,
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
      <div style={{ color: COLORS.muted, fontSize: '11px', fontWeight: '500', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color: COLORS.text, fontSize: '28px', fontWeight: '300', lineHeight: 1 }}>
        {value}<span style={{ fontSize: '14px', color: COLORS.muted, marginLeft: '4px' }}>{unit}</span>
      </div>
      {sub && <div style={{ color: COLORS.muted, fontSize: '12px', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}

export default StatCard;