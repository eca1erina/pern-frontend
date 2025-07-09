import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingTemplate } from '@templates/LandingTemplate/LandingTemplate';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleGetStartedClick = () => {
    router.push('/signup');
  };

  return (
    <LandingTemplate onLoginClick={handleLoginClick} onGetStartedClick={handleGetStartedClick} />
  );
};

export default LandingPage;
