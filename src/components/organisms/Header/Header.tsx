import React from 'react';
import Button from '@atoms/Button/Button';
import './Header.css';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">📊</span> Wise Track
      </div>
      <nav className="nav">
        <Button label="Login" onClick={() => router.push('/login')} />
      </nav>
    </header>
  );
};
