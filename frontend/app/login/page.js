"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { getRoleRoute, storeAuthSession } from '@/utils/auth';
import { LoginForm, LoginHeader, LoginHero } from '@/components/auth';

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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <LoginHero />
        
        <div className="w-1/2 relative bg-white">
          <div className="min-h-screen flex items-center justify-center px-12 py-7">
            <div className="w-full max-w-md space-y-3">
              <LoginHeader />
              
              <LoginForm
                form={form}
                error={error}
                loading={loading}
                showPassword={showPassword}
                onFormChange={handleChange}
                onSubmit={handleSubmit}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onGoogleLogin={handleGoogleLogin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <LoginHeader isMobile />
            
            <div className="mt-6">
              <LoginForm
                form={form}
                error={error}
                loading={loading}
                showPassword={showPassword}
                onFormChange={handleChange}
                onSubmit={handleSubmit}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onGoogleLogin={handleGoogleLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}