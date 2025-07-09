'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, _password: string) => {
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        email,
        password,
      });

      const { user, token } = res.data;

      sessionStorage.setItem('user', JSON.stringify({
        ...user,
        token,
        isLoggedIn: true,
        loginTime: new Date().toString(),
      }),
    );
    router.push('/dashboard');
  };

  return <LoginTemplate onLogin={handleLogin} />;
}
