'use client';
import React, { FC } from 'react';
import './InputField.css';
import { InputFieldProps } from './IInputField';

export const InputField: FC<InputFieldProps> = ({
  id,
  type = 'text',
  placeholder,
  label,
  value,
  onChange,
  error,
  ...props
}) => (
  <div className="input-field">
    <label htmlFor={id} className="input-label">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-element ${error ? 'input-error' : ''}`}
      {...props}
    />
    {error && <div className="input-error-message">{error}</div>}
  </div>
);
