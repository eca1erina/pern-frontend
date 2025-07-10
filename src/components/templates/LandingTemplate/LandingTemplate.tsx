import React from 'react';
import { Header } from '@organisms/Header/Header';
import { HeroSection } from '@organisms/HeroSection/HeroSection';
import './LandingTemplate.css';
import { ILandingTemplateProps } from './ILandingTemplate';

export const LandingTemplate: React.FC<ILandingTemplateProps> = ({
  onLoginClick,
  onGetStartedClick,
}) => {
  return (
    <div className="landing-template">
      <Header
        logoIcon="📊"
        logoText="Wise Track"
        buttonLabel="Login"
        buttonVariant="secondary"
        onButtonClick={onLoginClick}
        showButton={true}
      />
      <main className="landing-content">
        <HeroSection
          title="Welcome to Wise Track"
          subtitle="The smartest way to manage your finances and track your expenses"
          buttonLabel="Get Started"
          onButtonClick={onGetStartedClick}
        />
        <section className="features-section">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Easy Expense Tracking</h3>
              <p>Monitor all your expenses in one place</p>
            </div>
            <div className="feature-card">
              <h3>Financial Dashboard</h3>
              <p>Get insights with beautiful visualizations</p>
            </div>
            <div className="feature-card">
              <h3>Smart Budgeting</h3>
              <p>Set and track your financial goals</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <p>© 2025 Wise Track. All rights reserved.</p>
      </footer>
    </div>
  );
};
