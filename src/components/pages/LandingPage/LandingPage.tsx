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

  return (
    <LandingTemplate onLoginClick={handleLoginClick} onGetStartedClick={handleLoginClick} />
  );
};

export default LandingPage;
