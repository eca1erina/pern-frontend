import React from 'react';
import './LoginTemplate.css';
import { LoginCard } from '@organisms/LoginCard/LoginCard';

export const LoginTemplate: React.FC<{
  onLogin: (email: string, password: string) => void;
}> = ({ onLogin }) => {
  const handleSignupClick = () => {
    // Handle signup navigation
  };

  return (
    <div className="login-template">
      <LoginCard showSignup={true} onSignupClick={handleSignupClick} onLogin={onLogin} />
    </div>
  );
};
