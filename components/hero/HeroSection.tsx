"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const RingViewer = dynamic(() => import("./RingViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-[300px] items-center justify-center sm:h-[520px] sm:w-[420px]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f2a1f]/20 border-t-[#0f2a1f]" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      className={`relative h-[760px] overflow-hidden bg-[#f3f3ee] text-[#111315] sm:h-[820px] ${interTight.className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(94,152,116,0.12),_transparent_52%),linear-gradient(180deg,_#f3f3ee_0%,_#f3f3ee_72%,_#ffffff_100%)]" />

      <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 text-[11px] font-medium uppercase tracking-[0.18em] sm:px-10 lg:px-12">
        <span className="text-[#111315]">Est. 2026</span>
        <div className="hidden items-center gap-8 text-[#111315]/80 sm:flex">
          <span>Collections</span>
          <span>About</span>
          <span>Contacts</span>
        </div>
        <div className="flex items-center gap-5 text-[#111315]">
          <span>Search</span>
          <span>Cart</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto h-full max-w-[1440px] px-5 pb-0 sm:px-8 lg:px-10">
        <div className="relative h-full">
          <div className="pointer-events-none absolute inset-0 flex items-start justify-between px-0 pt-16">
            <div className="hero-wordmark left-0 text-left">VINI</div>
            <div className="hero-wordmark right-0 text-right">VICI VIDI</div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-b from-transparent to-white/10" />

          <div className="absolute left-1/2 top-[19%] z-30 flex -translate-x-1/2 items-center justify-center sm:top-[16%] lg:top-[18%]">
            <div className="ring-area pointer-events-auto h-[330px] w-[300px] sm:h-[440px] sm:w-[420px] lg:h-[560px] lg:w-[620px]">
              <RingViewer />
            </div>
          </div>

          <div className="absolute right-[5%] top-[35%] z-40 hidden items-center gap-4 lg:flex">
            <div className="h-px w-20 bg-[#111315]/25" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#111315]">
              925 Sterling Silver · Faceted Onyx
            </span>
          </div>

          <div className="absolute bottom-[6.5rem] left-0 z-30 hidden max-w-[220px] text-[11px] uppercase tracking-[0.2em] text-[#111315] md:block">
            Jewelry that becomes part of your story
          </div>

          <div className="absolute bottom-[4.5rem] left-0 z-30 max-w-[300px] text-[12px] leading-relaxed text-[#111315]/75 sm:max-w-[340px]">
            Designed with conviction. Crafted to feel as individual as the hand
            that wears it.
          </div>

          <div className="absolute bottom-[1.5rem] left-1/2 z-30 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.28em] text-[#111315]/60">
            vini / 01
          </div>

          <Link
            href="/shop"
            className="absolute bottom-[1.2rem] right-[2%] z-30 text-[11px] font-medium uppercase tracking-[0.22em] text-[#111315] underline decoration-[#111315]/35 underline-offset-[6px] hover:opacity-80"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[34px] bg-white">
        <div className="absolute left-1/2 top-2 h-6 w-[380px] -translate-x-1/2 rounded-full bg-[#111315]/10 blur-xl" />
      </div>
    </section>
  );
}
