import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginTemplate } from '@templates/LoginTemplate/LoginTemplate';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, _password: string) => {
    // Save user info to sessionStorage
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        email,
        isLoggedIn: true,
        loginTime: new Date().toString(),
      }),
    );
    // Navigate to profile page
    router.push('/profile');
  };

  return <LoginTemplate onLogin={handleLogin} />;
}
