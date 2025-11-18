"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRoleRoute, storeAuthSession } from '@/utils/auth';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Get token from URL query parameter (passed by backend after setting httpOnly cookie)
        const token = searchParams.get('token');

        if (!token) {
          // If no token in query, redirect to login
          setError('Token tidak ditemukan');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        try {
          // Decode token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Store auth session in localStorage for frontend use
          storeAuthSession({
            token,
            role: payload.role,
            username: payload.username,
            email: payload.email || payload.username
          });

          // Redirect ke dashboard sesuai role
          // httpOnly cookie sudah di-set oleh backend
          const redirectPath = getRoleRoute(payload.role);
          router.push(redirectPath);
        } catch (decodeErr) {
          console.error('Token decode error:', decodeErr);
          setError('Token tidak valid');
          setTimeout(() => router.push('/login'), 2000);
        }
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

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
