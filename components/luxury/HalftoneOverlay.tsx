'use client';

import React from 'react';

interface HalftoneOverlayProps {
  className?: string;
  opacity?: number;
}

export default function HalftoneOverlay({
  className = '',
  opacity = 0.08
}: HalftoneOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden aria-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="halftoneDots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="1.2" fill="#F2F2F2" />
          </pattern>
          {/* Radial mask to fade out smoothly at edges */}
          <radialGradient id="halftoneFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="65%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="halftoneMask">
            <rect width="100%" height="100%" fill="url(#halftoneFade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#halftoneDots)"
          mask="url(#halftoneMask)"
        />
      </svg>
    </div>
  );
}
