'use client';

import React from 'react';

interface ChromeRibbonProps {
  className?: string;
  variant?: 'left' | 'right' | 'diagonal' | 'horizontal';
  opacity?: number;
}

export default function ChromeRibbon({
  className = '',
  variant = 'diagonal',
  opacity = 0.65
}: ChromeRibbonProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none overflow-hidden aria-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Liquid Silver & Emerald specular multi-stop gradient (No Black) */}
          <linearGradient id="liquidSilverGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#E4E7EA" stopOpacity="0.9" />
            <stop offset="48%" stopColor="#BFC3C7" stopOpacity="0.85" />
            <stop offset="68%" stopColor="#8A9096" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#1F4D36" stopOpacity="0.75" />
            <stop offset="95%" stopColor="#6C8F72" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="liquidSilverEdge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#BFC3C7" stopOpacity="0.8" />
            <stop offset="88%" stopColor="#6C8F72" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Micro specular ripple filter */}
          <filter id="liquidRipple" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {variant === 'diagonal' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M-100 450 C 200 600, 450 150, 800 350 C 1050 500, 1150 100, 1350 200"
              stroke="url(#liquidSilverGrad)"
              strokeWidth="52"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-80 430 C 220 580, 470 130, 820 330 C 1070 480, 1170 80, 1370 180"
              stroke="url(#liquidSilverEdge)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        )}

        {variant === 'right' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M600 -50 C 850 150, 700 400, 1050 350 C 1180 330, 1220 550, 1300 600"
              stroke="url(#liquidSilverGrad)"
              strokeWidth="64"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M620 -40 C 870 160, 720 410, 1070 360 C 1200 340, 1240 560, 1320 610"
              stroke="url(#liquidSilverEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {variant === 'left' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M-50 100 C 200 120, 150 450, 400 400 C 600 350, 550 580, 700 650"
              stroke="url(#liquidSilverGrad)"
              strokeWidth="56"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-40 85 C 210 105, 160 435, 410 385 C 610 335, 560 565, 710 635"
              stroke="url(#liquidSilverEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {variant === 'horizontal' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M-100 300 C 250 180, 600 420, 950 220 C 1100 120, 1250 350, 1350 280"
              stroke="url(#liquidSilverGrad)"
              strokeWidth="44"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-80 290 C 270 170, 620 410, 970 210 C 1120 110, 1270 340, 1370 270"
              stroke="url(#liquidSilverEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
