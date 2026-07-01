'use client';

import React from 'react';

export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg 
      className={`${className} transition-all duration-500 hover:rotate-12`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nexivraGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="80%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main logo grouping with shadow filter */}
      <g filter="url(#logoShadow)">
        {/* Outer Circular Ring representing networking & connections */}
        <path 
          d="M 32 80 C 18 70 12 50 18 33 C 24 16 44 8 62 14 C 71 17 78 23 83 31" 
          stroke="url(#nexivraGrad)" 
          strokeWidth="9" 
          strokeLinecap="round"
        />

        {/* Dynamic inner orbital swoosh */}
        <path 
          d="M 23 64 C 32 75 48 76 60 67 C 72 58 75 40 68 27" 
          stroke="url(#nexivraGrad)" 
          strokeWidth="5" 
          strokeLinecap="round"
          strokeDasharray="1 7"
        />

        {/* Main Growth/Career Progress Diagonal Arrow */}
        <path 
          d="M 26 74 L 72 28" 
          stroke="url(#nexivraGrad)" 
          strokeWidth="10" 
          strokeLinecap="round"
        />

        {/* Arrowhead */}
        <path 
          d="M 48 28 L 72 28 L 72 52" 
          stroke="url(#nexivraGrad)" 
          strokeWidth="10" 
          strokeLinejoin="round" 
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
