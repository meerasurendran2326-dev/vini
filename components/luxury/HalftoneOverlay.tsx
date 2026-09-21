'use client';

import React from 'react';

interface HalftoneOverlayProps {
  className?: string;
  opacity?: number;
  dotColor?: string;
}

export default function HalftoneOverlay({
  className = '',
  opacity = 0.09,
  dotColor = '#8A9096'
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
            id="halftoneDotsLight"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1.1" fill={dotColor} />
          </pattern>
          {/* Radial mask to fade out smoothly at edges */}
          <radialGradient id="halftoneFadeLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="65%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="halftoneMaskLight">
            <rect width="100%" height="100%" fill="url(#halftoneFadeLight)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#halftoneDotsLight)"
          mask="url(#halftoneMaskLight)"
        />
      </svg>
    </div>
  );
}
