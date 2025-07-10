import React from 'react';
import './LoginCard.css';
import { LoginForm } from '@molecules/LoginForm/LoginForm';
import { LoginCardProps } from './ILoginCard';

export const LoginCard: React.FC<
  LoginCardProps & { onLogin: (email: string, password: string) => void }
> = ({ title = 'Welcome Back', showSignup = true, onSignupClick, onLogin }) => (
  <div className="login-card">
    <div className="login-header">
      <div className="login-logo">
        <span className="login-logo-icon">📊</span> Wise Track
      </div>
    </div>
    <h1 className="login-title">{title}</h1>
    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
      Enter your credentials to access your account
    </p>
    <LoginForm onSubmit={onLogin} />
    {showSignup && (
      <p className="login-footer">
        Don&#39;t have an account?{' '}
        <button type="button" className="signup-link" onClick={onSignupClick}>
          Sign up
        </button>
      </p>
    )}
  </div>
);
