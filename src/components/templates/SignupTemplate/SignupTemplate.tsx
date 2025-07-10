import React from 'react';
import { SignupCard } from '@organisms/SignupCard/SignupCard';
import './SignupTemplate.css';
import { ISignupTemplateProps } from './ISignupTemplate';

export const SignupTemplate: React.FC<ISignupTemplateProps> = ({ onSignup, onLoginClick }) => {
  return (
    <div className="signup-template">
      <SignupCard onSignup={onSignup} onLoginClick={onLoginClick} />
    </div>
  );
};
