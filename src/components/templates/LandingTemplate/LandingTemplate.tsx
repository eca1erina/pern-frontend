import React from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/navigation';
import Copyright from '@/components/atoms/Copyright/Copyright';
import './LandingTemplate.css';

const infoCards = [
  {
    title: 'Track Your Expenses',
    description: 'Easily log and categorize your daily expenses to stay on top of your finances.'
  },
  {
    title: 'Visualize Your Spending',
    description: 'Get clear, beautiful charts and reports to understand your spending habits.'
  },
  {
    title: 'Set Budgets & Goals',
    description: 'Set monthly budgets and savings goals to achieve financial wellness.'
  }
];

const easeTheme: [number, number, number, number] = [0.4, 0, 0.2, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeTheme } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.18, ease: easeTheme },
  }),
};

export const LandingTemplate: React.FC = () => {
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
          <img src="/logoSmall.png" alt="Wise Track Logo" />
          <span>Wise Track</span>
        </div>
        <nav className="landing-nav">
          <a href="#about" className="landing-nav-link" onClick={handleAboutClick}>About Us</a>
          <button className="get-started-btn" onClick={() => router.push('/signup')}>Get Started</button>
        </nav>
      </header>

      <section className="landing-hero-section" style={{ minHeight: '100vh', width: '100%', position: 'relative', zIndex: 2 }}>
        <div className="welcome-center" style={{ marginTop: '4vh', zIndex: 2, position: 'relative' }}>
          <h1>Welcome to Wise Track</h1>
        </div>
        <section className="spline-section" style={{ zIndex: 1 }}>
          <Spline scene="https://prod.spline.design/ppVuzJrx1DQ1DkJA/scene.splinecode" />
        </section>
      </section>

      <motion.section
        className="info-cards-section about-us-section"
        id="about"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{ minHeight: '100vh', paddingTop: '8vh', position: 'relative', zIndex: 1 }}
      >
        <h2 className="about-us-title">About Us</h2>
        {infoCards.map((card, idx) => (
          <motion.div
            className="info-card"
            key={card.title}
            custom={idx}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </motion.div>
        ))}
      </motion.section>
      <Copyright />
    </div>
  );
};
