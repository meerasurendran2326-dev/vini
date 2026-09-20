'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CinematicOpeningProps {
  onComplete: () => void;
}

export default function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const [stage, setStage] = useState<number>(1);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Black void with tiny metallic glint (0ms - 1000ms)
    const t1 = setTimeout(() => setStage(2), 1100);
    // Stage 2: Silver light sweep (1000ms - 2200ms)
    const t2 = setTimeout(() => setStage(3), 2300);
    // Stage 3: Brand reveal (2200ms - 3600ms)
    const t3 = setTimeout(() => setStage(4), 3800);
    // Stage 4: Hero Piece emerges (3800ms - 5200ms)
    const t4 = setTimeout(() => setStage(5), 5200);
    // Stage 5 & 6: Masked typography & Enter Collection CTA
    const t5 = setTimeout(() => setStage(6), 6400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-void text-ice-white transition-opacity duration-1000 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105 transition-transform duration-1000' : 'opacity-100'
      }`}
    >
      {/* Skip Button */}
      <button
        onClick={handleEnter}
        className="absolute top-8 right-8 z-30 text-[11px] font-sans uppercase tracking-super-wide text-silver/60 hover:text-ice-white transition-colors duration-300 px-4 py-2 border border-steel/40 hover:border-silver/60 bg-graphite/40 backdrop-blur-sm"
      >
        Skip Experience
      </button>

      {/* Stage 1 & 2: Ambient Deep Liquid Chrome Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient silver light beam */}
        <div
          className={`absolute w-[120vw] h-[400px] -top-32 -left-[10vw] rotate-[-15deg] bg-gradient-to-r from-transparent via-bright-silver/10 to-transparent blur-3xl transition-all duration-1500 ${
            stage >= 2 ? 'translate-y-48 opacity-70' : 'opacity-0'
          }`}
        />
        {/* Subtle radial spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,215,218,0.06)_0%,rgba(5,5,5,0.95)_70%)]" />
      </div>

      {/* Stage 1 Glint */}
      <div
        className={`absolute transition-opacity duration-700 ${
          stage === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-bright-silver shadow-[0_0_15px_#D4D7DA] animate-ping" />
      </div>

      {/* Stage 3 & 4: Silver Monogram / Hero Ring Reveal */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
        <div
          className={`mb-8 relative transition-all duration-1200 ease-out transform ${
            stage >= 3
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-6'
          }`}
        >
          {/* Subtle liquid metallic medallion placeholder */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-silver/40 p-1 flex items-center justify-center relative bg-gradient-to-b from-graphite via-carbon to-void shadow-[0_0_40px_rgba(212,215,218,0.15)]">
            <div className="absolute inset-1 rounded-full border border-steel/60 bg-[radial-gradient(ellipse_at_top,rgba(212,215,218,0.25),transparent_70%)]" />
            <span className="font-display text-2xl tracking-[0.3em] font-light text-bright-silver relative z-10 pl-1">
              VVV
            </span>
          </div>
          {/* Thin specular light glint */}
          <div className="absolute -inset-2 rounded-full border border-chrome/20 animate-pulse-slow" />
        </div>

        {/* Stage 5: Masked Typography */}
        <div className="overflow-hidden">
          <p
            className={`text-xs uppercase tracking-monumental text-silver/70 font-sans mb-3 transition-all duration-1000 transform ${
              stage >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            The Atelier • 925 Solid Sterling
          </p>
        </div>

        <div className="overflow-hidden mb-6">
          <h1
            className={`font-display text-4xl sm:text-6xl md:text-7xl tracking-widest text-ice-white font-normal transition-all duration-1200 transform ${
              stage >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            VINI VICI VIDI
          </h1>
        </div>

        <div className="overflow-hidden max-w-md">
          <p
            className={`font-editorial italic text-lg sm:text-xl text-silver/80 transition-all duration-1000 delay-200 transform ${
              stage >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            A private exhibition of architectural silver and bespoke heirlooms.
          </p>
        </div>

        {/* Stage 6: Enter CTA */}
        <div
          className={`mt-12 transition-all duration-1000 transform ${
            stage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center space-x-4 px-8 py-4 border border-silver/50 hover:border-bright-silver bg-carbon/80 hover:bg-steel/30 text-ice-white transition-all duration-500 shadow-[0_0_30px_rgba(212,215,218,0.1)] hover:shadow-[0_0_50px_rgba(212,215,218,0.25)]"
          >
            <span className="text-xs uppercase tracking-monumental font-sans">
              Enter The Collection
            </span>
            <ArrowRight className="w-4 h-4 text-bright-silver transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>

      {/* Stage indicator micro-labels */}
      <div className="absolute bottom-8 left-8 text-[10px] font-sans tracking-widest text-chrome/50 uppercase hidden sm:block">
        Stage 0{stage} / 07 • Exhibition Entrance
      </div>
      <div className="absolute bottom-8 right-8 text-[10px] font-sans tracking-widest text-brand-green/70 uppercase flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
        <span>Atelier Active</span>
      </div>
    </div>
  );
}
