'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/organisms/Sidebar/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const isPublicRoute = ['/', '/login', '/signup'].includes(pathname);
  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsLoggedIn(!!user.isLoggedIn);
      } catch {
        //console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // For public routes or when not logged in, don't show sidebar
  if (isPublicRoute || !isLoggedIn) {
    return <>{children}</>;
  }

  // For authenticated routes, show sidebar and properly positioned content
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content-with-sidebar">{children}</main>
    </div>
  );
}
