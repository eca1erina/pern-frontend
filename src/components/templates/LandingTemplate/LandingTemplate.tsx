import React from 'react';
import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/navigation';
import Copyright from '@/components/atoms/Copyright/Copyright';
import './LandingTemplate.css';
import { ILandingTemplateProps } from './ILandingTemplate';
import Image from 'next/image';

const infoCards = [
  {
    title: 'Track Your Expenses',
    description: 'Easily log and categorize your daily expenses to stay on top of your finances.',
  },
  {
    title: 'Visualize Your Spending',
    description: 'Get clear, beautiful charts and reports to understand your spending habits.',
  },
  {
    title: 'Get personalised recommendations',
    description: 'Let the AI assistant analyze your finances and give you tips.',
  },
];

export const LandingTemplate: React.FC<ILandingTemplateProps> = ({ onSplineLoad }) => {
  const router = useRouter();

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-template">
      <header className="landing-header minimal-header">
        <div className="landing-logo">
          <Image src="/logoSmall.png" alt="Wise Track Logo" />
          <span>Wise Track</span>
        </div>
        <nav className="landing-nav">
          <a href="#about" className="landing-nav-link" onClick={handleAboutClick}>
            About Us
          </a>
          <button className="get-started-btn" onClick={() => router.push('/signup')}>
            Get Started
          </button>
        </nav>
      </header>

      <section
        className="landing-hero-section"
        style={{ minHeight: '100vh', width: '100%', position: 'relative', zIndex: 2 }}
      >
        <div
          className="welcome-center"
          style={{ marginTop: '4vh', zIndex: 2, position: 'relative' }}
        >
          <h1>Welcome to Wise Track</h1>
        </div>
        <section className="spline-section" style={{ zIndex: 1 }}>
          <Spline
            scene="https://prod.spline.design/ppVuzJrx1DQ1DkJA/scene.splinecode"
            onLoad={onSplineLoad}
          />
        </section>
      </section>

      <section className="vertical-marquee-section" id="about">
        <div className="marquee-columns">
          {/* Left Column - Scroll Up */}
          <div className="marquee-column marquee-up">
            <div className="marquee-track">
              {[...infoCards, ...infoCards].map((card, idx) => (
                <div className="vertical-info-card" key={`up-${idx}`}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scroll Down */}
          <div className="marquee-column marquee-down">
            <div className="marquee-track">
              {[...infoCards, ...infoCards].map((card, idx) => (
                <div className="vertical-info-card" key={`down-${idx}`}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Copyright />
    </div>
  );
};
