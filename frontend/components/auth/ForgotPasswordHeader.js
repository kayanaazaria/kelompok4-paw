'use client';

import Image from 'next/image';

export default function ForgotPasswordHeader({ isMobile = false }) {
  return (
    <div className="text-center">
      <div className={isMobile ? "flex justify-center mb-6" : "flex justify-center mb-4"}>
        {/* Mobile/Tablet: Landscape logo */}
        <Image
          src="/logo_solanum_landscape.png"
          alt="Logo Solanum Agrotech"
          width={200}
          height={60}
          className="lg:hidden mx-auto"
          priority
        />
        {/* Desktop: Portrait logo */}
        <Image
          src="/logo_solanum_potrait.png"
          alt="Logo Solanum Agrotech"
          width={180}
          height={200}
          className="hidden lg:block"
          priority
        />
      </div>
      <div>
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
          Lupa Password
        </h2>
        <p className={`text-gray-600 ${isMobile ? 'text-xs mt-1' : 'text-sm mt-2'}`}>
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>
    </div>
  );
}
