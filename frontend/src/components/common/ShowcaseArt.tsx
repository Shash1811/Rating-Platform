import React from 'react';

interface ShowcaseArtProps {
  className?: string;
}

const ShowcaseArt: React.FC<ShowcaseArtProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label="Colorful storefront illustration"
      className={`showcase-art ${className}`.trim()}
    >
      <defs>
        <linearGradient id="bgGlow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe27b" />
          <stop offset="45%" stopColor="#ff8f5a" />
          <stop offset="100%" stopColor="#2a8f89" />
        </linearGradient>
        <linearGradient id="cardGlow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#f8f5ef" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="awningOne" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ff7a59" />
          <stop offset="100%" stopColor="#ffb347" />
        </linearGradient>
        <linearGradient id="awningTwo" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#1f8f88" />
          <stop offset="100%" stopColor="#53c4a9" />
        </linearGradient>
      </defs>

      <rect x="18" y="18" width="604" height="444" rx="42" fill="#fff8ef" />
      <circle cx="140" cy="128" r="112" fill="#ffe6c4" />
      <circle cx="538" cy="98" r="86" fill="#d8f6ef" />
      <path
        d="M96 346c44-78 101-116 172-116 68 0 135 37 197 109"
        fill="none"
        stroke="url(#bgGlow)"
        strokeLinecap="round"
        strokeWidth="24"
        opacity="0.26"
      />

      <g transform="translate(92 158)">
        <rect x="0" y="76" width="156" height="152" rx="26" fill="#f8f4ee" />
        <rect x="16" y="0" width="124" height="98" rx="22" fill="#fffdfa" />
        <path d="M8 90h140l-12 34H20z" fill="url(#awningOne)" />
        <rect x="42" y="122" width="72" height="78" rx="18" fill="#ffefe1" />
        <rect x="54" y="138" width="48" height="50" rx="12" fill="#ffffff" />
      </g>

      <g transform="translate(250 138)">
        <rect x="0" y="94" width="162" height="170" rx="28" fill="#f2fbf7" />
        <rect x="18" y="0" width="126" height="116" rx="24" fill="#ffffff" />
        <path d="M8 104h146l-12 40H20z" fill="url(#awningTwo)" />
        <rect x="40" y="142" width="82" height="92" rx="18" fill="#daf4ed" />
        <rect x="54" y="158" width="54" height="58" rx="14" fill="#ffffff" />
      </g>

      <g transform="translate(436 174)">
        <rect x="0" y="0" width="136" height="108" rx="28" fill="url(#cardGlow)" />
        <rect x="18" y="18" width="54" height="54" rx="18" fill="#ff7a59" opacity="0.16" />
        <rect x="86" y="24" width="30" height="12" rx="6" fill="#ffd26b" />
        <rect x="86" y="48" width="22" height="10" rx="5" fill="#2a8f89" />
        <rect x="18" y="82" width="98" height="10" rx="5" fill="#eadfce" />
        <path
          d="M36 44l8 14 16 2-12 12 3 16-15-8-15 8 3-16-12-12 16-2z"
          fill="#ffb347"
        />
      </g>

      <g transform="translate(424 62)">
        <rect x="0" y="0" width="120" height="82" rx="24" fill="#ffffff" opacity="0.86" />
        <rect x="18" y="18" width="84" height="12" rx="6" fill="#f1c54d" />
        <rect x="18" y="40" width="58" height="10" rx="5" fill="#d7d2ca" />
        <rect x="18" y="58" width="74" height="10" rx="5" fill="#d7d2ca" />
      </g>

      <g transform="translate(82 70)">
        <circle cx="0" cy="0" r="12" fill="#ff8f5a" />
        <circle cx="26" cy="28" r="7" fill="#ffd26b" />
        <circle cx="54" cy="2" r="5" fill="#2a8f89" />
      </g>
    </svg>
  );
};

export default ShowcaseArt;
