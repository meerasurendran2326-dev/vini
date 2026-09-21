'use client';

import React from 'react';
import ChromeRibbon from './ChromeRibbon';
import OrbitArc from './OrbitArc';
import HalftoneOverlay from './HalftoneOverlay';
import SparkleStar from './SparkleStar';

interface SceneBackgroundProps {
  className?: string;
  theme?: 'light' | 'emerald' | 'pearl' | 'mist';
  withRibbon?: boolean;
  ribbonVariant?: 'left' | 'right' | 'diagonal' | 'horizontal';
  withOrbit?: boolean;
  orbitOrientation?: 'top-right' | 'bottom-left' | 'center';
  withHalftone?: boolean;
  withStars?: boolean;
}

export default function SceneBackground({
  className = '',
  theme = 'light',
  withRibbon = false,
  ribbonVariant = 'diagonal',
  withOrbit = false,
  orbitOrientation = 'top-right',
  withHalftone = false,
  withStars = false,
}: SceneBackgroundProps) {
  const isEmerald = theme === 'emerald';
  const isPearl = theme === 'pearl';
  const isMist = theme === 'mist';

  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden aria-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Layer */}
      <div
        className={`absolute inset-0 ${
          isEmerald
            ? 'bg-[#0F2E20]'
            : isPearl
            ? 'bg-[#ECEFEA]'
            : isMist
            ? 'bg-[#DDE5DE]'
            : 'bg-[#F6F5F0]'
        }`}
      />

      {/* 2. Ambient Fog Radials */}
      {isEmerald ? (
        <>
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(31,77,54,0.5)_0%,rgba(15,46,32,0.3)_50%,transparent_75%)] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(108,143,114,0.25)_0%,rgba(15,46,32,0.4)_50%,transparent_75%)] blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(221,229,222,0.8)_0%,rgba(236,239,234,0.4)_50%,transparent_75%)] blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(169,191,174,0.3)_0%,rgba(246,245,240,0.2)_50%,transparent_75%)] blur-3xl pointer-events-none" />
        </>
      )}

      {/* 3. Halftone Dot Matrix Texture */}
      {withHalftone && (
        <HalftoneOverlay
          opacity={isEmerald ? 0.08 : 0.06}
          dotColor={isEmerald ? '#E4E7EA' : '#8A9096'}
        />
      )}

      {/* 4. Procedural Orbital Arc */}
      {withOrbit && (
        <OrbitArc
          orientation={orbitOrientation}
          opacity={isEmerald ? 0.45 : 0.3}
          className="inset-0"
        />
      )}

      {/* 5. Flowing Liquid Silver Ribbon */}
      {withRibbon && (
        <ChromeRibbon
          variant={ribbonVariant}
          opacity={isEmerald ? 0.5 : 0.4}
          className="inset-0"
        />
      )}

      {/* 6. Brushed Silver / Fine Grain Texture (3-4%) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={`grain-${theme}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${theme})`} />
      </svg>

      {/* 7. Ambient Sparkle Stars */}
      {withStars && (
        <>
          <div className="absolute top-[16%] left-[10%] opacity-70">
            <SparkleStar size={14} color={isEmerald ? '#8FB89A' : '#6C8F72'} animate />
          </div>
          <div className="absolute top-[68%] right-[12%] opacity-60">
            <SparkleStar size={16} color={isEmerald ? '#FFFFFF' : '#8A9096'} animate />
          </div>
          <div className="absolute bottom-[20%] left-[45%] opacity-50">
            <SparkleStar size={12} color={isEmerald ? '#E4E7EA' : '#A9BFAE'} animate={false} />
          </div>
        </>
      )}
    </div>
  );
}
