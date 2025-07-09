import React from 'react';
import { SignupForm } from '@molecules/SignupForm/SignupForm';
import './SignupCard.css';
import { SignupCardProps } from './ISignupCard';

export const SignupCard: React.FC<SignupCardProps> = ({
  title = 'Create an Account',
  onSignup,
  onLoginClick,
}) => {
  return (
    <div className="signup-card">
      <div className="signup-header">
        <div className="signup-logo">
          <span className="signup-logo-icon">📊</span> Wise Track
        </div>
      </div>
      <h1 className="signup-title">{title}</h1>
      <p className="signup-subtitle">Enter your information to create your account</p>
      <SignupForm onSubmit={onSignup} />
      <p className="signup-footer">
        Already have an account?{' '}
        <button type="button" className="login-link" onClick={onLoginClick}>
          Sign in
        </button>
      </p>
    </div>
  );
};
