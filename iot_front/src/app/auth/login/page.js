'use client';

import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async ({ email, password }) => {
    try {
      await signIn({ email, password });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main>
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        error={error}
      />
    </main>
  );
}