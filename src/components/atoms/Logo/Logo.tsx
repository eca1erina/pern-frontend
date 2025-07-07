import React from 'react';
import Image from 'next/image';

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Image
      src="/logoSmall.png"
      alt="Wise Track Logo"
      style={{ height: 38, width: 38, objectFit: 'contain' }}
      width={38}
      height={38}
    />
    <span style={{ fontWeight: 700, fontSize: 20, color: '#3b277a' }}>
      Wise <span style={{ color: '#6c63ff' }}>Track</span>
    </span>
  </div>
);

export default Logo;
