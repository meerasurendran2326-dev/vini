'use client';

import React from 'react';

interface SparkleStarProps {
  className?: string;
  size?: number; // size in px (default 16)
  withHalo?: boolean;
  color?: string; // default white/silver
  animate?: boolean;
}

export default function SparkleStar({
  className = '',
  size = 16,
  withHalo = true,
  color = '#F2F2F2',
  animate = true
}: SparkleStarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className} ${
        animate ? 'animate-pulse' : ''
      }`}
      style={{
        width: size,
        height: size,
        animationDuration: '3.5s'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Thin halo ring */}
        {withHalo && (
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke={color}
            strokeWidth="0.6"
            strokeOpacity="0.28"
          />
        )}
        {/* 4-point elongated sparkle star */}
        <path
          d="M12 2 C12 7.5 10 10.5 4 12 C10 13.5 12 16.5 12 22 C12 16.5 14 13.5 20 12 C14 10.5 12 7.5 12 2 Z"
          fill={color}
        />
      </svg>
    </span>
  );
}
