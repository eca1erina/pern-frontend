import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingTemplate } from '@templates/LandingTemplate/LandingTemplate';
import { useLoader } from '@/context/LoaderContext';

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { show, hide } = useLoader();

  useEffect(() => {
    show();
    const timer = setTimeout(() => {
      hide();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
