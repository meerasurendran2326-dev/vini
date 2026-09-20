'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { initialProducts } from '@/lib/data/initialProducts';

interface CinematicOpeningProps {
  onComplete: () => void;
}

export default function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoHandoffTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [hasEntered, setHasEntered] = useState(false);
  const heroProduct = initialProducts[0];

  // Magnetic pointer response for the Enter pill
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    });
  };

  // Exit transition handoff into the live hero
  const triggerHandoff = useCallback(() => {
    if (hasEntered) return;
    setHasEntered(true);

    if (autoHandoffTimerRef.current) {
      clearTimeout(autoHandoffTimerRef.current);
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Smooth clip-path scale expansion into the live page
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1.04,
        opacity: 0,
        clipPath: 'inset(20% 20% 20% 20% round 16px)',
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          onComplete();
        }
      });
    } else {
      onComplete();
    }
  }, [hasEntered, onComplete]);

  // Keyboard accessibility: ESC key to skip and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        triggerHandoff();
      } else if (e.key === 'Tab') {
        // Focus trap between Skip and Enter buttons
        const focusable = [skipBtnRef.current, enterBtnRef.current].filter(Boolean) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerHandoff]);

  // Lock body scroll while intro is playing
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // GSAP Master Timeline Construction
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      triggerHandoff();
      return;
    }

    // Focus skip button on start
    skipBtnRef.current?.focus();

    // Auto-handoff after 9s of inactivity
    autoHandoffTimerRef.current = setTimeout(() => {
      triggerHandoff();
    }, 9200);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // 0.0s: BLACK VOID — tiny white glint drift
      tl.fromTo(
        '#introGlint',
        { scale: 0.5, opacity: 0 },
        { scale: 1.4, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // 0.8s: SILVER LIGHT — thin white beam sweeps across, revealing brushed metal & green fog
      tl.fromTo(
        '#silverLightBeam',
        { x: '-100%', opacity: 0 },
        { x: '100%', opacity: 0.75, duration: 1.0, ease: 'power2.inOut' },
        0.8
      );
      tl.to(
        '#introGreenFog',
        { opacity: 0.5, duration: 1.2, ease: 'power1.out' },
        1.0
      );

      // 1.8s: BRAND — VVV monogram resolves from reflection with light sweep and blur-to-focus
      tl.fromTo(
        '#introMonogramWrap',
        { filter: 'blur(12px)', opacity: 0, scale: 0.92 },
        { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
        1.8
      );

      // 3.0s: HERO PIECE — real product rises with slow push-in and controlled rotation
      tl.fromTo(
        '#introHeroPiece',
        { y: 60, scale: 0.85, opacity: 0, rotateZ: -10 },
        { y: 0, scale: 1, opacity: 1, rotateZ: 0, duration: 1.3, ease: 'power3.out' },
        3.0
      );

      // 4.0s: TYPE — "VINI VICI VIDI" and "THE SILVER COLLECTION" appear line-by-line behind masks
      tl.fromTo(
        '#introKicker',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        4.0
      );
      tl.fromTo(
        '#introHeadline',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        4.2
      );
      tl.fromTo(
        '#introScriptWord',
        { opacity: 0, scale: 0.95 },
        { opacity: 0.85, scale: 1, duration: 0.7, ease: 'power2.out' },
        4.5
      );

      // 5.0s: ENTER — "ENTER THE COLLECTION" pill resolves and focuses
      tl.fromTo(
        '#introEnterBtn',
        { y: 25, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          onComplete: () => {
            enterBtnRef.current?.focus();
          }
        },
        5.0
      );
    }, containerRef);

    return () => {
      if (autoHandoffTimerRef.current) clearTimeout(autoHandoffTimerRef.current);
      ctx.revert();
    };
  }, [triggerHandoff]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Exhibition Entry"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030504] text-[#F2F2F2] select-none overflow-hidden"
    >
      {/* 1. Skip Button (Available from t=0) */}
      <button
        ref={skipBtnRef}
        onClick={triggerHandoff}
        aria-label="Skip Cinematic Intro (Esc)"
        className="absolute top-8 right-8 z-40 text-[10px] font-mono uppercase tracking-[0.16em] text-[#9AA39D] hover:text-[#F2F2F2] transition-colors duration-300 px-3.5 py-1.5 border border-[rgba(242,242,242,0.12)] hover:border-[#6C8F72] bg-[#0A0F0C]/80 backdrop-blur-md rounded-[2px]"
      >
        Skip Intro [Esc]
      </button>

      {/* 2. Background Stack: Void, Green Fog, Film Grain, and Sweeping Beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sweeping Silver Light Beam */}
        <div
          id="silverLightBeam"
          className="absolute -top-40 -left-1/4 w-[150vw] h-[500px] -rotate-12 bg-[radial-gradient(ellipse_at_center,rgba(242,242,242,0.18)_0%,rgba(108,143,114,0.08)_40%,transparent_70%)] blur-2xl"
        />

        {/* Deep Green Fog in the wake */}
        <div
          id="introGreenFog"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,53,36,0.22)_0%,rgba(6,17,12,0.4)_50%,transparent_80%)] opacity-0"
        />

        {/* Film grain SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="introGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#introGrain)" />
        </svg>

        {/* Edge Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(3,5,4,0.92)_100%)]" />
      </div>

      {/* 3. Stage 0.0s Glint */}
      <div id="introGlint" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-[#F2F2F2] shadow-[0_0_20px_#F2F2F2,0_0_40px_#6C8F72] animate-pulse" />
      </div>

      {/* 4. Center Content Stage */}
      <div className="relative z-20 flex flex-col items-center max-w-3xl px-6 text-center">
        {/* Brand Monogram & Reflection (1.8s) */}
        <div id="introMonogramWrap" className="mb-8 relative flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[rgba(242,242,242,0.18)] p-1 flex items-center justify-center relative bg-gradient-to-b from-[#0A0F0C] via-[#0B1A12] to-[#030504] shadow-[0_0_50px_rgba(108,143,114,0.18)]">
            <div className="absolute inset-1 rounded-full border border-[rgba(242,242,242,0.10)] bg-[radial-gradient(ellipse_at_top,rgba(242,242,242,0.22),transparent_70%)]" />
            <span className="font-sans font-semibold text-2xl tracking-[0.25em] text-[#F2F2F2] relative z-10 pl-1">
              VVV
            </span>
          </div>
        </div>

        {/* Hero Real Product Piece (3.0s) */}
        <div id="introHeroPiece" className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[rgba(242,242,242,0.12)] shadow-[0_0_60px_rgba(108,143,114,0.25)] bg-[#0A0F0C]">
            <Image
              src={heroProduct.images[0] || '/images/products/pdt-1.jpeg'}
              alt={heroProduct.name}
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft radial alpha edge mask */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,5,4,0.75)_95%)] pointer-events-none" />
          </div>
          {/* Subtle contact shadow underneath */}
          <div className="absolute -bottom-4 w-32 h-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(108,143,114,0.5)_0%,transparent_75%)] blur-md" />
        </div>

        {/* Masked Typography (4.0s) */}
        <div className="overflow-hidden">
          <p
            id="introKicker"
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#9AA39D] mb-3"
          >
            The Atelier • 925 Solid Sterling Metallurgy
          </p>
        </div>

        <div className="overflow-hidden mb-3">
          <h1
            id="introHeadline"
            className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-[-0.03em] text-[#F2F2F2]"
          >
            VINI VICI VIDI
          </h1>
        </div>

        <div className="overflow-hidden max-w-lg mb-8">
          <p
            id="introScriptWord"
            className="font-editorial italic text-base sm:text-lg text-[#BFC3C7]"
          >
            "Metal must not merely be bent; it must remember light."
          </p>
        </div>

        {/* Enter CTA with Magnetic Pointer Response (5.0s) */}
        <div id="introEnterBtn" className="opacity-0">
          <button
            ref={enterBtnRef}
            onClick={triggerHandoff}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative inline-flex items-center space-x-3 px-8 py-3.5 border border-[rgba(242,242,242,0.25)] hover:border-[#6C8F72] bg-[#0A0F0C]/90 hover:bg-[#F2F2F2] text-[#F2F2F2] hover:text-[#030504] transition-all duration-300 shadow-[0_0_40px_rgba(108,143,114,0.2)] rounded-[2px]"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] font-semibold">
              Enter The Collection
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Stage Micro-Labels */}
      <div className="absolute bottom-8 left-8 text-[9px] font-mono uppercase tracking-[0.16em] text-[#9AA39D]/60 hidden sm:block">
        Atmospheric Induction • Scene 00 / 08
      </div>
      <div className="absolute bottom-8 right-8 text-[9px] font-mono uppercase tracking-[0.16em] text-[#6C8F72] flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] animate-pulse" />
        <span>Atelier Active</span>
      </div>
    </div>
  );
}
