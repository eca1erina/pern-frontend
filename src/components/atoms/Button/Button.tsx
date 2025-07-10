'use client';
import { FC } from 'react';
import '@atoms/Button/Button.css';
import { ButtonProps } from './IButton';

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  type = 'button',
  size = 'medium',
  className = '',
  ...props
}) => {
  const buttonClasses = `btn btn-${variant} ${size} ${className}`;

  return (
    <button type={type} className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
