'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, _password: string) => {
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        email,
        isLoggedIn: true,
        loginTime: new Date().toString(),
      }),
    );
    router.push('/dashboard');
  };

  return <LoginTemplate onLogin={handleLogin} />;
}
