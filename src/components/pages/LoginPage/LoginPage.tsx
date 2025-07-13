'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

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
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || 'Incorrect email or password');
    }
  };

  return <LoginTemplate onLogin={handleLogin} errorMessage={errorMessage} />;
}
