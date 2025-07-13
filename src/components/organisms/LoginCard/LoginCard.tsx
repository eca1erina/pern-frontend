import React from 'react';
import './LoginCard.css';
import { LoginForm } from '@molecules/LoginForm/LoginForm';
import { LoginCardProps } from './ILoginCard';

type Props = LoginCardProps & {
  onLogin: (email: string, password: string) => void;
  errorMessage?: string;
};

export const LoginCard: React.FC<Props> = ({
  showSignup = true,
  onSignupClick,
  onLogin,
  errorMessage,
}) => (
  <div className="login-card">
    <h1
      className="login-title"
      style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: '1.2rem',
        color: '#7b6cff',
        letterSpacing: '0.01em',
        textAlign: 'center',
      }}
    >
      Login
    </h1>
    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
      Enter your credentials to access your account
    </p>

    {/* Error message block */}
    {errorMessage && (
      <div
        className="login-error-message"
        role="alert"
        style={{
          color: 'red',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        {errorMessage}
      </div>
    )}

    {/* Login form */}
    <LoginForm onSubmit={onLogin} />

    {/* Signup link */}
    {showSignup && (
      <p className="login-footer" style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="signup-link"
          onClick={onSignupClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#7b6cff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Sign up
        </button>
      </p>
    )}
  </div>
);
