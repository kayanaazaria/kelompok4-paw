'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeAuthSession } from '@/utils/auth';

function GoogleSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectPath = searchParams.get('redirect') || '/';

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Store auth session in localStorage
      storeAuthSession({
        token,
        role: payload.role,
        username: payload.username,
        email: payload.email || payload.username,
        department: payload.department
      });

      // Redirect to the appropriate dashboard
      router.push(redirectPath);
    } catch (err) {
      console.error('Failed to store auth session:', err);
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-600 font-semibold">Menyelesaikan login...</p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <GoogleSuccessContent />
    </Suspense>
  );
}
