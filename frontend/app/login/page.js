"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { getRoleRoute, storeAuthSession } from '@/utils/auth';
import { LoginLayout } from '@/components/auth';
import { API_BASE_URL } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = await login(form);
      storeAuthSession(payload);
      const redirectPath = getRoleRoute(payload.role);
      router.push(redirectPath);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Gagal login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect ke endpoint Google OAuth backend
    const backendUrl = (API_BASE_URL || 'http://localhost:5001').replace(/\/$/, ''); // Remove trailing slash
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <LoginLayout
      form={form}
      error={error}
      loading={loading}
      showPassword={showPassword}
      onFormChange={handleChange}
      onSubmit={handleSubmit}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}