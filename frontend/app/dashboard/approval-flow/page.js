"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleRoute, getRoleStatus } from '@/utils/auth';

export default function ApprovalFlowLandingPage() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const { status: roleStatus, role } = getRoleStatus(['kepala_bidang', 'direktur_sdm']);
    if (roleStatus === 'authorized') {
      setStatus('authorized');
      return;
    }
    const fallback = roleStatus === 'unauthorized' ? '/login' : getRoleRoute(role);
    router.replace(fallback);
    setStatus(roleStatus);
  }, [router]);

  if (status !== 'authorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <div className="text-center">
          <p className="font-semibold">Memeriksa akses persetujuan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Persetujuan</h1>
        <p className="text-gray-600 mb-6">Gunakan halaman ini untuk melihat dokumen yang menunggu review dan membuka detail laporan satu per satu.</p>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <p className="text-sm text-gray-500">- Cari dokumen yang sudah diajukan HSE di backend.</p>
          <p className="text-sm text-gray-500">- Gunakan <strong className="text-gray-800">ID laporan</strong> untuk membuka detail pada URL <code className="text-sm text-green-600">/dashboard/approval-flow/[id]</code>.</p>
          <p className="text-sm text-gray-500">- Hanya peran Kepala Bidang dan Direktur SDM yang bisa mengubah status persetujuan.</p>
        </div>
      </div>
    </div>
  );
}