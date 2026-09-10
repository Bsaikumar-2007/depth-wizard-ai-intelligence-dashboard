import React from 'react';

interface DepthWizardLogoProps {
  className?: string;
  size?: number;
}

export const DepthWizardLogo: React.FC<DepthWizardLogoProps> = ({
  className = '',
  size = 36,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-lg shadow-xs ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Deep blue background container */}
        <rect width="100" height="100" rx="22" fill="#1C3879" />
        <rect width="100" height="100" rx="22" fill="url(#bg-gradient)" />

        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Ocean / Topography Contour Waves */}
        <path
          d="M 24 40 Q 36 28 50 38 T 76 32"
          stroke="#93C5FD"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 19 52 Q 33 40 50 50 T 81 44"
          stroke="#60A5FA"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M 16 63 Q 34 50 50 62 T 84 57"
          stroke="#3B82F6"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dashed Plumb line through center */}
        <line
          x1="50"
          y1="19"
          x2="50"
          y2="75"
          stroke="#E2E8F0"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />

        {/* Bottom sounding bob weight */}
        <circle cx="50" cy="73" r="3.5" fill="#60A5FA" />

        {/* White diamond prism kite */}
        <polygon
          points="50,19 66,40 50,53 34,40"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Top apex orange beacon */}
        <circle cx="50" cy="18.5" r="4" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      </svg>
    </div>
  );
};
