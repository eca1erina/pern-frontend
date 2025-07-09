import React from 'react';
import Button from '@atoms/Button/Button';
import './Header.css';
import { HeaderProps } from './IHeader';

export const Header: React.FC<HeaderProps> = ({
  logoIcon,
  logoText,
  buttonLabel,
  buttonVariant,
  onButtonClick,
  showButton,
}) => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">{logoIcon}</span> {logoText}
      </div>
      {showButton && (
        <nav className="nav">
          <Button variant={buttonVariant} onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        </nav>
      )}
    </header>
  );
};
