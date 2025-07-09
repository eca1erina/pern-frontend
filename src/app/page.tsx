'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@pages/LandingPage/LandingPage';
import Dashboard from '@pages/Dashboard/Dashboard';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsLoggedIn(!!user.isLoggedIn);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Dashboard /> : <LandingPage />;
}
