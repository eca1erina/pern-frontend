import React from 'react';
import Button from '@atoms/Button/Button';
import './HeroSection.css';
import { HeroSectionProps } from './IHeroSection';

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
}) => (
  <div className="hero-section">
    <h1 className="hero-title">{title}</h1>
    <p className="hero-subtitle">{subtitle}</p>
    <Button label={buttonLabel} onClick={onButtonClick} />
  </div>
);
