'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignupTemplate } from '@templates/SignupTemplate/SignupTemplate';
import { postData } from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();

  // Handle signup
  const handleSignup = async (formData: { name: string; email: string; password: string }) => {
    try {
      const res = await postData('/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Signup failed');
        return;
      }

      // Save user info and token in sessionStorage
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

      // Save token for authentication
      sessionStorage.setItem('token', data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch {
      alert('An error occurred during signup. Please try again.');
    }
  };

  // Navigate to login page
  const handleLoginClick = () => {
    router.push('/login');
  };

  return <SignupTemplate onSignup={handleSignup} onLoginClick={handleLoginClick} />;
}
