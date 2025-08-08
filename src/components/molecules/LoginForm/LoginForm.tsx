import React, { useState } from 'react';
import './LoginForm.css';
import { InputField } from '@atoms/InputField/InputField';

export const LoginForm: React.FC<{ onSubmit: (email: string, password: string) => void }> = ({
  onSubmit,
}) => {
  // ✅ Set default values here
  const [email, setEmail] = useState('claire@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>
  );
};
