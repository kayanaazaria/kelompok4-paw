'use client';

import Image from 'next/image';

export default function LoginHeader({ isMobile = false }) {
  return (
    <div className={isMobile ? "text-center" : "space-y-2"}>
      <div className={isMobile ? "flex justify-center mb-6" : "flex justify-center mb-4"}>
        <Image
          src="/logo_solanum_potrait.png"
          alt="Logo Solanum Agrotech"
          width={isMobile ? 140 : 180}
          height={isMobile ? 160 : 200}
          className={isMobile ? "mx-auto" : ""}
          priority
        />
      </div>
      <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-3xl mb-2' : 'text-4xl'}`}>
        Selamat Datang
      </h1>
      <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
        Kelola dan pantau semua laporan insiden kecelakaan kerja dengan sistem pelaporan digital terintegrasi
      </p>
    </div>
  );
}
