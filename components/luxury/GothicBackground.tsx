'use client';

import React from 'react';

/**
 * GothicBackground
 * Purely decorative, zero-interaction background layer implementing:
 * 1. Base #050505 with deep forest-green radial fog in corners & heavy vignette
 * 2. Pointed cathedral arch tracery & gothic architectural line-art (4-7% opacity)
 * 3. 2-3 slow-drifting blurred mist layers (45-60s CSS loops, transform/opacity only)
 * 4. Fixed 35mm cinematic film-grain noise overlay (4-5% opacity)
 * Respects prefers-reduced-motion.
 */
export default function GothicBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Base Void & Deep Vignette + Corner Forest Fog */}
      <div className="absolute inset-0 bg-[#050505]" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 8% 12%, rgba(11, 26, 18, 0.75) 0%, transparent 60%),
            radial-gradient(circle at 92% 16%, rgba(18, 38, 27, 0.65) 0%, transparent 65%),
            radial-gradient(circle at 85% 88%, rgba(11, 26, 18, 0.70) 0%, transparent 60%),
            radial-gradient(circle at 12% 92%, rgba(18, 38, 27, 0.60) 0%, transparent 65%)
          `,
        }}
      />

      {/* Heavy Cinematic Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5, 5, 5, 0.8) 70%, #050505 100%)',
        }}
      />

      {/* 2. Gothic Cathedral Window & Pointed Arch Tracery (Drawn in --steel & --moss at 6-8% opacity) */}
      <svg
        className="absolute inset-0 w-full h-full stroke-steel/70 text-moss/50 opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <defs>
          <linearGradient id="gothicStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6C8F72" stopOpacity="0.14" />
            <stop offset="35%" stopColor="#34383C" stopOpacity="0.10" />
            <stop offset="70%" stopColor="#2E4A37" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0B1A12" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Left Cathedral Lancet Arch */}
        <g stroke="url(#gothicStrokeGrad)" strokeWidth="1.2">
          {/* Main pointed arch outer */}
          <path d="M 80 900 V 380 Q 80 160 220 60 Q 360 160 360 380 V 900" />
          {/* Inner concentric arch */}
          <path d="M 120 900 V 400 Q 120 220 220 120 Q 320 220 320 400 V 900" />
          {/* Vertical mullions */}
          <line x1="220" y1="120" x2="220" y2="900" strokeDasharray="4 8" />
          <line x1="170" y1="420" x2="170" y2="900" />
          <line x1="270" y1="420" x2="270" y2="900" />
          {/* Trefoil cusps in arch apex */}
          <circle cx="220" cy="240" r="38" strokeDasharray="3 5" />
          <circle cx="180" cy="300" r="28" />
          <circle cx="260" cy="300" r="28" />
        </g>

        {/* Right Cathedral Lancet Arch (Mirrored & Slightly Cropped) */}
        <g stroke="url(#gothicStrokeGrad)" strokeWidth="1.2">
          <path d="M 1080 900 V 380 Q 1080 160 1220 60 Q 1360 160 1360 380 V 900" />
          <path d="M 1120 900 V 400 Q 1120 220 1220 120 Q 1320 220 1320 400 V 900" />
          <line x1="1220" y1="120" x2="1220" y2="900" strokeDasharray="4 8" />
          <line x1="1170" y1="420" x2="1170" y2="900" />
          <line x1="1270" y1="420" x2="1270" y2="900" />
          <circle cx="1220" cy="240" r="38" strokeDasharray="3 5" />
          <circle cx="1180" cy="300" r="28" />
          <circle cx="1260" cy="300" r="28" />
        </g>

        {/* Central Top Rose Tracery (Cropped Arc) */}
        <g stroke="url(#gothicStrokeGrad)" strokeWidth="1">
          <circle cx="720" cy="-60" r="260" />
          <circle cx="720" cy="-60" r="180" strokeDasharray="4 8" />
          <circle cx="720" cy="-60" r="110" />
          {/* Radial Spokes */}
          <line x1="720" y1="-60" x2="520" y2="120" />
          <line x1="720" y1="-60" x2="920" y2="120" />
          <line x1="720" y1="-60" x2="620" y2="180" />
          <line x1="720" y1="-60" x2="820" y2="180" />
          <line x1="720" y1="-60" x2="720" y2="200" />
        </g>
      </svg>

      {/* 3. Slow-Moving Atmospheric Fog / Mist Layers (40s - 60s loops) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mist Layer 1 */}
        <div
          className="absolute -top-[20%] -left-[15%] w-[80vw] h-[80vh] rounded-full blur-[110px] opacity-35 animate-gothic-fog-1"
          style={{
            background: 'radial-gradient(circle, rgba(18, 38, 27, 0.55) 0%, rgba(11, 26, 18, 0.25) 50%, transparent 75%)',
          }}
        />

        {/* Mist Layer 2 */}
        <div
          className="absolute top-[40%] -right-[15%] w-[75vw] h-[75vh] rounded-full blur-[120px] opacity-30 animate-gothic-fog-2"
          style={{
            background: 'radial-gradient(circle, rgba(46, 74, 55, 0.45) 0%, rgba(11, 26, 18, 0.2) 55%, transparent 80%)',
          }}
        />

        {/* Mist Layer 3 (Low floating haze) */}
        <div
          className="absolute -bottom-[20%] left-[20%] w-[85vw] h-[60vh] rounded-full blur-[130px] opacity-35 animate-gothic-fog-3"
          style={{
            background: 'radial-gradient(circle, rgba(18, 38, 27, 0.6) 0%, rgba(5, 5, 5, 0.3) 60%, transparent 80%)',
          }}
        />
      </div>

      {/* 4. Film Grain Overlay (Fixed SVG Noise, 4-6% opacity) */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
