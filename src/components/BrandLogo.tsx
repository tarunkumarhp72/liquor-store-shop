import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'dark' | 'light' | 'gold';
}

export default function BrandLogo({
  className = '',
  size = 42,
}: BrandLogoProps) {
  const numSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 42;

  return (
    <div
      className={`relative shrink-0 select-none overflow-hidden rounded-full ${className}`}
      style={{ width: numSize, height: numSize }}
      aria-label="Liquor MH Brand Logo"
    >
      <Image
        src="/logo.png"
        alt="Liquor MH Logo"
        width={numSize * 2}
        height={numSize * 2}
        className="w-full h-full object-cover rounded-full"
        priority
      />
    </div>
  );
}
