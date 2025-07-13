'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

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

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return <LoginTemplate onLogin={handleLogin} />;
}
