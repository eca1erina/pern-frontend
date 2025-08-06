'use client';

import React from 'react';
import './LoginTemplate.css';
import { LoginCard } from '@organisms/LoginCard/LoginCard';
import { useRouter } from 'next/navigation';

type LoginTemplateProps = {
  onLogin: (email: string, password: string) => void;
  errorMessage?: string;
};

export const LoginTemplate: React.FC<LoginTemplateProps> = ({ onLogin, errorMessage }) => {
  const router = useRouter();

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="login-template">
      {/* Top-left logo */}
      <img src="/logoSmall.png" alt="Wise Track Logo" className="login-page-logo-topleft" />

      {/* Login form card */}
      <LoginCard
        showSignup={true}
        onSignupClick={handleSignupClick}
        onLogin={onLogin}
        errorMessage={errorMessage}
      />
    </div>
  );
};
