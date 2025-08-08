'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignupTemplate } from '@templates/SignupTemplate/SignupTemplate';
import { postData } from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (formData: { name: string; email: string; password: string }) => {
    try {
      const data = await postData<{ user: any; token: string; message?: string }>(
        '/users/signup',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      if (!data || !data.user) {
        alert(data.message || 'Signup failed');
        return;
      }

      sessionStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          isLoggedIn: true,
          loginTime: new Date().toString(),
        }),
      );

      sessionStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('An error occurred during signup. Please try again.');
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return <SignupTemplate onSignup={handleSignup} onLoginClick={handleLoginClick} />;
}
