'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignupTemplate } from '@templates/SignupTemplate/SignupTemplate';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (formData: { name: string; email: string; password: string }) => {
    try {
      const res = await fetch('http://localhost:3001/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Signup failed');
        return;
      }

      // Save user info in sessionStorage
      sessionStorage.setItem(
        'user',
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          isLoggedIn: true,
          loginTime: new Date().toString(),
        }),
      );
      router.push('/dashboard');
    } catch {
      alert('An error occurred during signup. Please try again.');
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return <SignupTemplate onSignup={handleSignup} onLoginClick={handleLoginClick} />;
}
