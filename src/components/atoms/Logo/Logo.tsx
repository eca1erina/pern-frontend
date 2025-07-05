import React from 'react';

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <img src="/logo.png" alt="Wise Track Logo" style={{ height: 38, width: 38, objectFit: 'contain' }} />
    <span style={{ fontWeight: 700, fontSize: 20, color: '#3b277a' }}>
      Wise <span style={{ color: '#6c63ff' }}>Track</span>
    </span>
  </div>
);

export default Logo; 