import React from 'react';
import './LoginTemplate.css';
import { LoginCard } from '@organisms/LoginCard/LoginCard';
import { useRouter } from 'next/navigation';

export const LoginTemplate: React.FC<{
  onLogin: (email: string, password: string) => void;
}> = ({ onLogin }) => {
  const router = useRouter();

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="login-template">
      <LoginCard showSignup={true} onSignupClick={handleSignupClick} onLogin={onLogin} />
    </div>
  );
};
