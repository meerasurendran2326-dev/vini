'use client';

import React from 'react';
import ChromeRibbon from './ChromeRibbon';
import OrbitArc from './OrbitArc';
import HalftoneOverlay from './HalftoneOverlay';
import SparkleStar from './SparkleStar';

interface SceneBackgroundProps {
  className?: string;
  withRibbon?: boolean;
  ribbonVariant?: 'left' | 'right' | 'diagonal' | 'horizontal';
  withOrbit?: boolean;
  orbitOrientation?: 'top-right' | 'bottom-left' | 'center';
  withHalftone?: boolean;
  withStars?: boolean;
  greenFogIntensity?: 'low' | 'medium' | 'high';
}

export default function SceneBackground({
  className = '',
  withRibbon = false,
  ribbonVariant = 'diagonal',
  withOrbit = false,
  orbitOrientation = 'top-right',
  withHalftone = false,
  withStars = false,
  greenFogIntensity = 'low'
}: SceneBackgroundProps) {
  const fogOpacity = {
    low: 'opacity-25',
    medium: 'opacity-40',
    high: 'opacity-60'
  }[greenFogIntensity];

  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden aria-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Pure Void Black Base */}
      <div className="absolute inset-0 bg-[#030504]" />

      {/* 2. Deep Green Ambient Fog Radials */}
      <div
        className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(18,53,36,0.35)_0%,rgba(11,26,18,0.15)_50%,transparent_75%)] blur-3xl pointer-events-none ${fogOpacity}`}
      />
      <div
        className={`absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(108,143,114,0.18)_0%,rgba(6,17,12,0.3)_50%,transparent_75%)] blur-3xl pointer-events-none ${fogOpacity}`}
      />

      {/* 3. Halftone Dot Matrix Texture (Masked) */}
      {withHalftone && <HalftoneOverlay opacity={0.06} />}

      {/* 4. Procedural Orbital Arc */}
      {withOrbit && (
        <OrbitArc
          orientation={orbitOrientation}
          opacity={0.35}
          className="inset-0"
        />
      )}

      {/* 5. Flowing Liquid Chrome Ribbon */}
      {withRibbon && (
        <ChromeRibbon
          variant={ribbonVariant}
          opacity={0.4}
          className="inset-0"
        />
      )}

      {/* 6. Subtle 3-4% Procedural Film Grain SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="sceneFilmGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sceneFilmGrain)" />
      </svg>

      {/* 7. Ambient Sparkle Stars Accent */}
      {withStars && (
        <>
          <div className="absolute top-[18%] left-[12%] opacity-60">
            <SparkleStar size={14} color="#8FB89A" animate />
          </div>
          <div className="absolute top-[65%] right-[14%] opacity-50">
            <SparkleStar size={16} color="#F2F2F2" animate />
          </div>
          <div className="absolute bottom-[22%] left-[45%] opacity-40">
            <SparkleStar size={12} color="#BFC3C7" animate={false} />
          </div>
        </>
      )}

      {/* 8. Heavy Architectural Edge Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(3,5,4,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
