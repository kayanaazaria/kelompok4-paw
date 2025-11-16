'use client';

import Image from 'next/image';

export default function LoginHero() {
  return (
    <div className="w-1/2 relative">
      <Image
        src="/login_art.png"
        alt="Agriculture scene"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
