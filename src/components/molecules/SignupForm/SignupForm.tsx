'use client';
import React, { useState } from 'react';
import { InputField } from '@atoms/InputField/InputField';
import Button from '@atoms/Button/Button';
import './SignupForm.css';
import { SignupFormProps } from './ISignupForm';

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <InputField
        id="name"
        name="name"
        label="Name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button type="submit" variant="primary" className="signup-button">
        Create Account
      </Button>
    </form>
  );
};
