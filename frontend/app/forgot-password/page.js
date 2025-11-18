'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordLayout } from '@/components/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email reset password telah dikirim. Silakan cek inbox Anda.');
        setEmail('');
      } else {
        setError(data.message || 'Gagal mengirim email reset password');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <ForgotPasswordLayout
      email={email}
      error={error}
      success={success}
      loading={loading}
      onEmailChange={handleEmailChange}
      onSubmit={handleSubmit}
      onBackToLogin={handleBackToLogin}
    />
  );
}
