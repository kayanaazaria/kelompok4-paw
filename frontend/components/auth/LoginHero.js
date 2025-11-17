'use client';

import Image from 'next/image';

export default function LoginHero() {
  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-1">
      <div className="relative w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <Image
          src="/login_art.png"
          alt="Agriculture scene"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
