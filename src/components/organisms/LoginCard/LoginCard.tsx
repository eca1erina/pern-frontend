import React from 'react';
import './LoginCard.css';
import { LoginForm } from '@molecules/LoginForm/LoginForm';
import { LoginCardProps } from './ILoginCard';

export const LoginCard: React.FC<
  LoginCardProps & { onLogin: (email: string, password: string) => void }
> = ({ showSignup = true, onSignupClick, onLogin }) => (
  <div className="login-card">
    <h1 className="login-title" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.2rem', color: '#7b6cff', letterSpacing: '0.01em', textAlign: 'center' }}>Login</h1>
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
