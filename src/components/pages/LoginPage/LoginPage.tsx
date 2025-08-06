'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';
import { postData } from '@/utils/api';
import { User } from '@organisms/UserCard/IUserCard';

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await postData<{ user: User; token: string }>(`/users/login`, {
        email,
        password,
      });

      const { user, token } = res;

      sessionStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          token,
          isLoggedIn: true,
          loginTime: new Date().toString(),
        }),
      );

      setErrorMessage(''); // Clear previous errors
      router.push('/dashboard');
    } catch {
      //console.error('Login failed:', err.response?.data || err.message);
      //setErrorMessage(err.response?.data?.message || 'Incorrect email or password');
    }
  };

  return <LoginTemplate onLogin={handleLogin} errorMessage={errorMessage} />;
}
