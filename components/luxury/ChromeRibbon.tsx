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
  opacity = 0.55
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
          {/* Liquid Chrome specular multi-stop gradient */}
          <linearGradient id="liquidChromeGrad1" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#030504" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#0B1A12" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2E4A37" stopOpacity="0.7" />
            <stop offset="72%" stopColor="#BFC3C7" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#F2F2F2" stopOpacity="0.95" />
            <stop offset="92%" stopColor="#6C8F72" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06110C" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="liquidChromeEdge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#030504" stopOpacity="0" />
            <stop offset="40%" stopColor="#8FB89A" stopOpacity="0.3" />
            <stop offset="65%" stopColor="#F2F2F2" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#BFC3C7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#030504" stopOpacity="0" />
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
              stroke="url(#liquidChromeGrad1)"
              strokeWidth="56"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-80 430 C 220 580, 470 130, 820 330 C 1070 480, 1170 80, 1370 180"
              stroke="url(#liquidChromeEdge)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        )}

        {variant === 'right' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M600 -50 C 850 150, 700 400, 1050 350 C 1180 330, 1220 550, 1300 600"
              stroke="url(#liquidChromeGrad1)"
              strokeWidth="72"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M620 -40 C 870 160, 720 410, 1070 360 C 1200 340, 1240 560, 1320 610"
              stroke="url(#liquidChromeEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {variant === 'left' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M-50 100 C 200 120, 150 450, 400 400 C 600 350, 550 580, 700 650"
              stroke="url(#liquidChromeGrad1)"
              strokeWidth="64"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-40 85 C 210 105, 160 435, 410 385 C 610 335, 560 565, 710 635"
              stroke="url(#liquidChromeEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {variant === 'horizontal' && (
          <g filter="url(#liquidRipple)">
            <path
              d="M-100 300 C 250 180, 600 420, 950 220 C 1100 120, 1250 350, 1350 280"
              stroke="url(#liquidChromeGrad1)"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-80 290 C 270 170, 620 410, 970 210 C 1120 110, 1270 340, 1370 270"
              stroke="url(#liquidChromeEdge)"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
