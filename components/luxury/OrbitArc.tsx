'use client';

import React from 'react';

interface OrbitArcProps {
  className?: string;
  orientation?: 'top-right' | 'bottom-left' | 'center';
  opacity?: number;
}

export default function OrbitArc({
  className = '',
  orientation = 'top-right',
  opacity = 0.45
}: OrbitArcProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none overflow-hidden aria-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="orbitSilverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#BFC3C7" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#6C8F72" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgba(31, 77, 54, 0)" />
          </linearGradient>

          <linearGradient id="orbitSilverEcho" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A9096" stopOpacity="0.3" />
            <stop offset="70%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {orientation === 'top-right' && (
          <g>
            {/* Primary high-specular rim arc */}
            <ellipse
              cx="950"
              cy="50"
              rx="680"
              ry="480"
              transform="rotate(-25 950 50)"
              stroke="url(#orbitSilverGlow)"
              strokeWidth="1.2"
              fill="none"
            />
            {/* Secondary faint orbital echo */}
            <ellipse
              cx="950"
              cy="50"
              rx="710"
              ry="505"
              transform="rotate(-25 950 50)"
              stroke="url(#orbitSilverEcho)"
              strokeWidth="0.8"
              strokeDasharray="4 8"
              fill="none"
            />
          </g>
        )}

        {orientation === 'bottom-left' && (
          <g>
            <ellipse
              cx="50"
              cy="950"
              rx="680"
              ry="480"
              transform="rotate(-25 50 950)"
              stroke="url(#orbitSilverGlow)"
              strokeWidth="1.2"
              fill="none"
            />
            <ellipse
              cx="50"
              cy="950"
              rx="710"
              ry="505"
              transform="rotate(-25 50 950)"
              stroke="url(#orbitSilverEcho)"
              strokeWidth="0.8"
              strokeDasharray="4 8"
              fill="none"
            />
          </g>
        )}

        {orientation === 'center' && (
          <g>
            <ellipse
              cx="500"
              cy="500"
              rx="460"
              ry="320"
              transform="rotate(-15 500 500)"
              stroke="url(#orbitSilverGlow)"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
