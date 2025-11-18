'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ResetPasswordLayout } from '@/components/auth';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (form.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: form.password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password berhasil diubah. Anda akan diarahkan ke halaman login...');
        setForm({ password: '', confirmPassword: '' });
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Gagal mengubah password');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <ResetPasswordLayout
      form={form}
      error={error}
      success={success}
      loading={loading}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onTogglePassword={handleTogglePassword}
      onToggleConfirmPassword={handleToggleConfirmPassword}
      onBackToLogin={handleBackToLogin}
    />
  );
}
