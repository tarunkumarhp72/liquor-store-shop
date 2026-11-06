import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'dark' | 'light' | 'gold';
}

export default function BrandLogo({
  className = '',
  size = 42,
  variant = 'dark',
}: BrandLogoProps) {
  const isLight = variant === 'light';

  // Color configurations based on theme
  const textColor = isLight ? '#6D2434' : '#E8D293';
  const bgColor = isLight ? '#FCFAF6' : '#1C1715';
  const ringOpacity = isLight ? 0.8 : 0.7;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="MH2 Brand Logo"
    >
      <defs>
        <linearGradient id={`goldGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9EDB8" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9C7818" />
        </linearGradient>
      </defs>

      {/* Circular Background Badge */}
      <circle cx="50" cy="50" r="47" fill={bgColor} />

      {/* Outer Luxury Gold Bezel */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={`url(#goldGrad-${variant})`}
        strokeWidth="3.2"
      />

      {/* Inner Fine Concentric Ring for luxury depth */}
      <circle
        cx="50"
        cy="50"
        r="39"
        stroke={`url(#goldGrad-${variant})`}
        strokeWidth="1"
        strokeDasharray="2.5 2"
        opacity={ringOpacity}
      />

      {/* Brand Monogram: Mathematically centered with comfortable margin */}
      <text
        x="47"
        y="53"
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        MH<tspan fontSize="21" dy="5.5" fontWeight="600">2</tspan>
      </text>
    </svg>
  );
}

