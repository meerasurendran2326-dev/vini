'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { animate, stagger } from 'animejs';

const HeroRing3D = dynamic(() => import('./HeroRing3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-[#0F2A1F]/20 border-t-[#0F2A1F] animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const { openCart, itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // anime.js v4 entrance animation sequence
    const anims: any[] = [];

    try {
      // 1. Staggered slide up for wordmark letters
      const wordmarkAnim = animate('.hero-letter', {
        translateY: ['100%', '0%'],
        opacity: [0, 1],
        delay: stagger(80),
        duration: 800,
        ease: 'outExpo',
      });
      anims.push(wordmarkAnim);

      // 2. Scale (0.9 to 1) & fade in for 3D Ring
      const ringAnim = animate('.hero-ring-container', {
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 900,
        delay: 250,
        ease: 'outExpo',
      });
      anims.push(ringAnim);

      // 3. Fade in supporting elements
      const fadeAnim = animate('.hero-fade-in', {
        opacity: [0, 1],
        translateY: ['16px', '0px'],
        delay: stagger(100, { start: 450 }),
        duration: 750,
        ease: 'outExpo',
      });
      anims.push(fadeAnim);
    } catch (err) {
      console.warn('Anime.js sequence error:', err);
    }

    return () => {
      anims.forEach((a) => {
        if (a && typeof a.pause === 'function') a.pause();
      });
    };
  }, []);

  const line1 = 'VINI VICI'.split('');
  const line2 = 'VIDI'.split('');

  return (
    <section className="relative min-h-[100vh] min-h-[720px] bg-[#F4F4F0] text-[#0F2A1F] font-sans overflow-hidden flex flex-col justify-between selection:bg-[#0F2A1F]/10">
      
      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#0F2A1F]/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#F4F4F0] border border-[#0F2A1F]/20 p-6 shadow-2xl rounded-[2px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#0F2A1F]/15">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0F2A1F] font-semibold">
                Search Collection
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-mono text-[#0F2A1F]/60 hover:text-[#0F2A1F]"
              >
                [CLOSE]
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="mt-4 flex items-center space-x-3"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sovereign rings, pendants..."
                className="flex-1 px-4 py-2 bg-white border border-[#0F2A1F]/20 text-[#0F2A1F] text-xs font-sans focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F2A1F] text-[#F4F4F0] text-xs font-mono uppercase tracking-wider font-semibold"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HERO MAIN STAGE */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex flex-col justify-between pt-4 pb-6">
        
        {/* TOP SUPPORTING ROW */}
        <div className="grid grid-cols-12 items-start z-20 relative pt-2">
          {/* Top-Left: Tagline */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 hero-fade-in">
            <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#0F2A1F]/70 uppercase">
              Silver that becomes part of your story
            </p>
          </div>

          {/* Top-Right: Small Cropped Lifestyle Photo */}
          <div className="hidden md:flex col-span-4 col-start-9 justify-end hero-fade-in">
            <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-[#0F2A1F]/15 shadow-sm transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/products/pdt-2.jpeg"
                alt="Silver Lifestyle"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* CENTER STAGE: GIANT WORDMARK (Z-1) + OVERLAPPING HUGE 3D RING (Z-10) */}
        <div className="relative my-auto py-2 sm:py-6 flex items-center justify-center min-h-[500px]">
          
          {/* GIANT FULL-WIDTH ULTRA-BOLD GROTESK WORDMARK (Z-1 BEHIND RING) */}
          <div className="w-full flex flex-col space-y-0 sm:space-y-1 select-none z-1 relative">
            {/* Line 1: VINI VICI (staggered left) */}
            <div className="overflow-hidden flex items-center justify-start text-[15vw] sm:text-[13vw] md:text-[11.5vw] font-extrabold leading-[0.82] tracking-tighter text-[#0F2A1F] uppercase">
              {line1.map((char, i) => (
                <span
                  key={i}
                  className={`inline-block hero-letter ${char === ' ' ? 'w-[0.3em]' : ''}`}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Line 2: VIDI (staggered right like reference velora / atelier) */}
            <div className="overflow-hidden flex items-center justify-end text-[15vw] sm:text-[13vw] md:text-[11.5vw] font-extrabold leading-[0.82] tracking-tighter text-[#0F2A1F] uppercase pr-2 sm:pr-6">
              {line2.map((char, i) => (
                <span key={i} className="inline-block hero-letter">
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* HUGE 3D INTERACTIVE RING FIGURE (Z-10 IN FRONT OF WORDMARK) */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <HeroRing3D
              imageSrc="/images/ring-cutout.png"
              fallbackWebp="/images/ring-cutout.webp"
              productName="Aethelgard Hand-Carved Sovereign Ring"
            />
          </div>

          {/* ANNOTATION LINE & MICRO-LABEL ATTACHED TO RING'S RIGHT SIDE */}
          <div className="hidden lg:flex absolute right-[10%] top-[45%] items-center space-x-3 z-20 pointer-events-none hero-fade-in">
            <div className="w-20 h-[1px] bg-[#0F2A1F]/30" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#0F2A1F] bg-[#F4F4F0]/95 px-2.5 py-1 border border-[#0F2A1F]/20 rounded-[2px] shadow-sm">
              925 STERLING SILVER · HAND-CARVED
            </span>
          </div>
        </div>

        {/* BOTTOM ROW: CRAFTSMANSHIP PARAGRAPH, HAND PHOTO, "vini / 01" & "EXPLORE COLLECTION" */}
        <div className="grid grid-cols-12 items-end z-20 relative pt-2">
          {/* Left-Middle Paragraph + Left-Bottom Hand Photo */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 space-y-3 hero-fade-in">
            <p className="text-xs text-[#0F2A1F]/75 leading-relaxed max-w-[34ch] font-sans">
              Forged from certified 925 solid sterling silver. Precision-beveled planar signets, fluid torque bangles, and generational bespoke metallurgy.
            </p>

            <div className="hidden sm:block relative w-24 h-24 rounded-lg overflow-hidden border border-[#0F2A1F]/15 shadow-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/products/pdt-3.jpeg"
                alt="Silver Hand Carved Detail"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Right: "vini / 01" and Underlined EXPLORE COLLECTION */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-8 flex items-end justify-between sm:justify-end space-x-8 pt-4 sm:pt-0 hero-fade-in">
            <span className="text-xs font-mono tracking-widest text-[#0F2A1F]/60 uppercase">
              vini / 01
            </span>

            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-[0.18em] font-semibold text-[#0F2A1F] hover:opacity-75 transition-opacity underline underline-offset-8 decoration-[#0F2A1F]/40 hover:decoration-[#0F2A1F]"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </div>
      </div>

      {/* SOFT WHITE FLOOR SECTION ACROSS BOTTOM 25% OF HERO */}
      <div className="w-full h-24 bg-gradient-to-b from-[#F4F4F0] to-[#FFFFFF] border-b border-[#0F2A1F]/10 relative z-10 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-6 bg-[#0F2A1F]/12 blur-lg rounded-full" />
      </div>
    </section>
  );
}
