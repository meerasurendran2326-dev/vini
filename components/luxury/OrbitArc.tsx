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
  opacity = 0.4
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
          <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2F2F2" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#6C8F72" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#0B1A12" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#030504" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="orbitEcho" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8FB89A" stopOpacity="0.2" />
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
              stroke="url(#orbitGlow)"
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
              stroke="url(#orbitEcho)"
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
              stroke="url(#orbitGlow)"
              strokeWidth="1.2"
              fill="none"
            />
            <ellipse
              cx="50"
              cy="950"
              rx="710"
              ry="505"
              transform="rotate(-25 50 950)"
              stroke="url(#orbitEcho)"
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
              stroke="url(#orbitGlow)"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
