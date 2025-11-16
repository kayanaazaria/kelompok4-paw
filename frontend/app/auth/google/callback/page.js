"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRoleRoute, storeAuthSession } from '@/utils/auth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Ambil token dari URL query parameter jika ada
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (!token) {
          // Jika tidak ada token di query, berarti masih di proses OAuth
          // Backend akan redirect ke callback dengan token
          return;
        }

        // Decode token untuk mendapatkan user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Store auth session
        storeAuthSession({
          token,
          role: payload.role,
          username: payload.username,
          email: payload.email || payload.username
        });

        // Redirect berdasarkan role
        const redirectPath = getRoleRoute(payload.role);
        router.push(redirectPath);
      } catch (err) {
        console.error('Google callback error:', err);
        setError('Gagal memproses login Google');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-red-600 text-xl font-semibold">
            {error}
          </div>
          <p className="text-gray-600">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-600 font-semibold">Memproses login Google...</p>
      </div>
    </div>
  );
}
