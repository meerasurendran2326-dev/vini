'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicOpening from '@/components/luxury/CinematicOpening';
import SilverJewellery3D from '@/components/luxury/SilverJewellery3D';
import ProductCard from '@/components/product/ProductCard';
import { CardFanCarousel, CardFanItem } from '@/components/ui/card-fan-carousel';
import SceneBackground from '@/components/luxury/SceneBackground';
import ChromeRibbon from '@/components/luxury/ChromeRibbon';
import SparkleStar from '@/components/luxury/SparkleStar';
import OrbitArc from '@/components/luxury/OrbitArc';
import { HudLabel, CornerBrackets, LeaderLine } from '@/components/luxury/HudAnnotation';
import { Product } from '@/lib/types';
import { initialProducts, initialSettings } from '@/lib/data/initialProducts';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [activeScene, setActiveScene] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [craftStage, setCraftStage] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scroll and ScrollTrigger
  useEffect(() => {
    // Check if intro has already played in this browser session
    try {
      const seen = sessionStorage.getItem('vvv_intro_seen');
      if (seen === 'true') {
        setShowIntro(false);
      }
    } catch {
      // Ignore in strict privacy sandbox
    }

    // Dynamic product fetch from API to ensure real-time inventory
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.warn('Using initial products cache', err));

    // Lenis smooth scroll setup
    let lenisInstance: any;
    import('lenis').then((LenisModule) => {
      const Lenis = LenisModule.default;
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }).catch(() => {
      // Fallback if Lenis is not available
    });

    // Scroll progress & active scene listener
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);

        // Calculate active scene (1 through 8)
        const sceneNum = Math.min(8, Math.max(1, Math.floor((progress / 100) * 8) + 1));
        setActiveScene(sceneNum);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('vvv_intro_seen', 'true');
    } catch {
      // Ignore
    }
    setShowIntro(false);
  };

  const categories = [
    {
      id: 'rings',
      title: 'Sovereign Rings',
      description: 'Solid 925 architectural bands, heavy seals, and brutalist knife-edges.',
      image: '/images/products/pdt-1.jpeg',
      count: products.filter((p) => p.category === 'rings').length,
    },
    {
      id: 'pendants',
      title: 'Liquid Pendants',
      description: 'Molten chrome drops, sacred geometry lockets, and certified ingots.',
      image: '/images/products/pdt-2.jpeg',
      count: products.filter((p) => p.category === 'pendants').length,
    },
    {
      id: 'bracelets',
      title: 'Torques & Cuffs',
      description: 'Hand-forged heavy bangles, articulated armor plates, and mesh weaves.',
      image: '/images/products/pdt-3.jpeg',
      count: products.filter((p) => p.category === 'bracelets').length,
    },
    {
      id: 'chains',
      title: 'Byzantine Chains',
      description: 'Diamond-cut cuban links, historical link weaves, and rope spirals.',
      image: '/images/products/pdt-4.jpeg',
      count: products.filter((p) => p.category === 'chains').length,
    },
    {
      id: 'bespoke',
      title: 'Bespoke Artefacts',
      description: 'Custom family heraldry, constellation coordinates, and hand engravings.',
      image: '/images/products/pdt-6.jpeg',
      count: products.filter((p) => p.category === 'bespoke').length,
    },
  ];

  const featuredPieces = products.filter((p) => p.featured).slice(0, 8);
  const urgentPieces = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).slice(0, 4);

  // Carousel items map directly to real products
  const fanItems: CardFanItem[] = products.slice(0, 10).map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: `${p.specifications.purity} • ${p.category.toUpperCase()}`,
    image: p.images[0] || '/images/products/pdt-1.jpeg',
    price: p.price,
    originalPrice: p.originalPrice,
    link: `/product/${p.slug}`,
    badge: p.isFiftyPercentOffer ? '50% OFFER' : p.stock <= p.lowStockThreshold ? `ONLY ${p.stock} LEFT` : 'SIGNATURE',
    product: p,
  }));

  const craftStagesData = [
    {
      step: '01 / 03',
      title: 'Hydraulic Casting & 925 Ingot Forging',
      desc: 'Molten grain silver is alloyed strictly with deoxidized copper to 92.5% purity under heavy hydraulic pressure, ensuring monumental density with zero internal air pockets.',
      image: '/images/products/pdt-8.jpeg',
      spec: '14.8 - 54.0g Solid Mass'
    },
    {
      step: '02 / 03',
      title: 'Hand-Chiseled Intaglio & Faceted Bevels',
      desc: 'Master jewelers hand-cut planar signets with geometric chisels, carving deep relief intaglios and razor-beveled edges that catch directional showroom light.',
      image: '/images/products/pdt-6.jpeg',
      spec: 'Diamond-Carved In India'
    },
    {
      step: '03 / 03',
      title: 'Electrolytic Liquid-Chrome Rhodium Shield',
      desc: 'Finished with a molecular liquid-rhodium barrier that resists atmospheric oxidation, endowing the silver with mirror-polished liquid brilliance designed to outlive the century.',
      image: '/images/products/pdt-9.jpeg',
      spec: 'Lifelong Specular Purity'
    }
  ];

  return (
    <>
      {/* Cinematic Entry Sequence */}
      {showIntro && <CinematicOpening onComplete={handleIntroComplete} />}

      {/* Fixed Hairline Progress Bar in Green */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-[#6C8F72] z-50 pointer-events-none transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Fixed Floating Scene Counter Pill */}
      <div
        className="fixed bottom-6 left-6 z-30 hidden sm:flex items-center space-x-2.5 px-3.5 py-1.5 bg-[#0A0F0C]/85 border border-[rgba(242,242,242,0.12)] rounded-full backdrop-blur-md shadow-2xl text-[10px] font-mono uppercase tracking-[0.16em] text-[#9AA39D] pointer-events-none"
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] animate-pulse" />
        <span className="text-[#F2F2F2]">Scene 0{activeScene}</span>
        <span className="text-[rgba(242,242,242,0.3)]">/</span>
        <span>08</span>
      </div>

      <div ref={containerRef} className="relative bg-[#030504] text-[#F2F2F2] selection:bg-[#6C8F72]/30 selection:text-[#F2F2F2]">
        
        {/* =========================================================================
            SCENE 01: HERO — GIANT CHROME-GRADIENT TYPE & 3D REAL PRODUCT VOID
        ========================================================================= */}
        <section className="relative min-h-[calc(100svh-104px)] flex flex-col justify-between px-6 sm:px-10 lg:px-[6vw] pt-6 sm:pt-8 pb-10 overflow-hidden border-b border-[rgba(242,242,242,0.10)]">
          {/* Background stack with subtle fog and film grain */}
          <SceneBackground withStars greenFogIntensity="low" />

          {/* Top Meta Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] pt-2 pb-6 border-b border-[rgba(242,242,242,0.06)]">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] inline-block animate-pulse" />
              <span className="text-[#F2F2F2]">Atelier Online Showroom</span>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-[rgba(242,242,242,0.6)]">
              <span>Pure 92.5% Sterling Metallurgy</span>
              <span className="text-[#6C8F72]">•</span>
              <span>Handcrafted In India</span>
            </div>
            <div>
              <button
                onClick={() => setShowIntro(true)}
                className="hover:text-[#F2F2F2] transition-colors underline decoration-[rgba(242,242,242,0.25)] underline-offset-4"
              >
                Replay Vault Intro
              </button>
            </div>
          </div>

          {/* Center Stage: 12-Column Asymmetric Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
            {/* Left Content Column (Cols 1-7) */}
            <div ref={heroTextRef} className="lg:col-span-7 flex flex-col justify-center">
              {/* Micro-label kicker */}
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] border border-[rgba(242,242,242,0.12)] bg-[#0A0F0C]/80 text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] w-fit mb-5">
                <Sparkles className="w-3 h-3 text-[#8FB89A]" />
                <span>Exhibition Catalog 2026</span>
              </div>

              {/* Headline with clean negative space */}
              <h1 className="font-sans font-medium text-4xl sm:text-6xl lg:text-[clamp(2.75rem,5vw,5.25rem)] leading-[1.03] tracking-[-0.03em] text-[#F2F2F2] mb-6 uppercase">
                Liquid Chrome. <br />
                <span className="font-editorial italic font-light text-[#9AA39D] lowercase">
                  architectural
                </span>{' '}
                Silver.
              </h1>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#9AA39D] max-w-[54ch] leading-relaxed tracking-normal mb-8">
                Forged from certified 925 solid sterling silver. Precision-beveled planar signets, fluid torque bangles, and generational bespoke metallurgy designed to outlive the century.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-[#F2F2F2] hover:bg-white text-[#030504] text-[11px] font-mono uppercase tracking-[0.14em] font-semibold rounded-[2px] transition-all duration-300 shadow-xl flex items-center space-x-2.5 group"
                >
                  <span>Explore Exhibition</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="group px-7 py-3.5 border border-[rgba(242,242,242,0.14)] hover:border-[#6C8F72] text-[#F2F2F2] hover:bg-[#0A0F0C] text-[11px] font-mono uppercase tracking-[0.14em] rounded-[2px] transition-colors"
                >
                  The Silversmith Story
                </Link>
              </div>

              {/* Meta Scarcity & Offer Row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono uppercase tracking-[0.12em] text-[#9AA39D]">
                <span className="flex items-center space-x-1.5 text-[#6C8F72]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>50% Celebration Discount Active</span>
                </span>
                <span className="text-[rgba(242,242,242,0.2)] hidden sm:inline">•</span>
                <span>Guest Checkout Enabled</span>
                <span className="text-[rgba(242,242,242,0.2)] hidden sm:inline">•</span>
                <span className="hidden sm:inline">Lifetime Metallurgy Guarantee</span>
              </div>
            </div>

            {/* Right Column: 3D Interactive Real Product Studio (Cols 8-12) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <SilverJewellery3D />
              </div>
            </div>
          </div>

          {/* Bottom Scene Ticker */}
          <div className="relative z-10 pt-4 border-t border-[rgba(242,242,242,0.08)] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D]">
            <span>Scene 01 • Pure Material Induction</span>
            <div className="flex items-center space-x-1.5">
              <span>Scroll To Enter Vault</span>
              <span className="animate-bounce text-[#6C8F72]">↓</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 02: COLLECTION INTRO & UNTOUCHED CARD FAN CAROUSEL
        ========================================================================= */}
        <section className="border-b border-[rgba(242,242,242,0.10)] relative overflow-hidden py-16">
          {/* Faint Giant Serif Word behind + Cropped Chrome Ribbon */}
          <div className="absolute top-10 right-0 font-editorial italic text-[18vw] leading-none text-[#F2F2F2]/[0.035] pointer-events-none select-none">
            Archive
          </div>
          <ChromeRibbon variant="left" opacity={0.3} className="top-0 left-0 w-[600px] h-[350px]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-[6vw] mb-8">
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] mb-2">
              <SparkleStar size={12} color="#6C8F72" />
              <span>Scene 02 • Interactive Physical Archive</span>
            </div>
            <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-[#F2F2F2]">
              The Fanned Vault Carousel.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#9AA39D] max-w-xl mt-2 leading-relaxed">
              Hover and slide across our 925 solid sterling collection. Each piece expands in tactile motion to reveal individual hallmarked specifications.
            </p>
          </div>

          {/* PROTECTED: UNTOUCHED CARD FAN CAROUSEL */}
          <div className="max-w-7xl mx-auto">
            <CardFanCarousel
              items={fanItems}
              title="The Fanned Vault Carousel"
              subtitle="Interactive Archive • 925 Solid Sterling Collection"
              onSelect={(item) => {
                if (item.product) {
                  setQuickProduct(item.product);
                }
              }}
            />
          </div>
        </section>

        {/* =========================================================================
            SCENE 03: 50% CELEBRATION METALLIC MARQUEE STRIP
        ========================================================================= */}
        {initialSettings.globalFiftyPercentActive && (
          <section className="border-y border-[#6C8F72]/40 bg-gradient-to-r from-[#030504] via-[#0B1A12] to-[#030504] py-4 relative overflow-hidden select-none">
            <div className="flex items-center space-x-8 whitespace-nowrap animate-shimmer text-[11px] font-mono uppercase tracking-[0.18em] text-[#F2F2F2]">
              <div className="flex items-center space-x-8">
                <span className="text-[#8FB89A] font-semibold">50% Celebration Offer Active</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span>Direct Atelier Pricing On All 925 Pieces</span>
                <SparkleStar size={12} color="#8FB89A" />
                <span>Complimentary Insured Courier Across India</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span>BIS 925 Hallmark Laser Certified</span>
                <SparkleStar size={12} color="#8FB89A" />
                <span className="text-[#8FB89A] font-semibold">50% Celebration Offer Active</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span>Direct Atelier Pricing On All 925 Pieces</span>
                <SparkleStar size={12} color="#8FB89A" />
                <span>Complimentary Insured Courier Across India</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SCENE 04: CRAFTSMANSHIP — PINNED NARRATIVE SCENE WITH CLIP-PATH REVEALS
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-[6vw] border-b border-[rgba(242,242,242,0.10)] relative overflow-hidden bg-[#06110C]/40">
          <SceneBackground withHalftone greenFogIntensity="low" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Image Strip with Corner Brackets & Clip Path */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] bg-[#030504] border border-[rgba(242,242,242,0.12)] overflow-hidden shadow-2xl rounded-[2px]">
                <CornerBrackets size={16} color="rgba(108,143,114,0.6)" />
                <Image
                  src={craftStagesData[craftStage].image}
                  alt={craftStagesData[craftStage].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030504]/90 via-transparent to-transparent pointer-events-none" />

                {/* Leader Line to Spec Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                  <LeaderLine length={60} label={craftStagesData[craftStage].spec} />
                  <span className="text-[10px] font-mono text-[#8FB89A] px-2 py-0.5 bg-[#0A0F0C]/80 border border-[rgba(242,242,242,0.10)]">
                    {craftStagesData[craftStage].step}
                  </span>
                </div>
              </div>

              {/* Stage Selector Tabs */}
              <div className="flex items-center gap-3 mt-4">
                {craftStagesData.map((stage, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCraftStage(idx)}
                    className={`flex-1 py-2 px-3 border text-left font-mono text-[10px] uppercase tracking-[0.14em] transition-all rounded-[2px] ${
                      craftStage === idx
                        ? 'border-[#6C8F72] bg-[#0B1A12] text-[#F2F2F2]'
                        : 'border-[rgba(242,242,242,0.10)] bg-[#0A0F0C]/60 text-[#9AA39D] hover:border-[rgba(242,242,242,0.25)]'
                    }`}
                  >
                    Phase {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C8F72] inline-block animate-pulse" />
                <span>Scene 04 • The Generational Silversmith Atelier</span>
              </div>

              <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-[#F2F2F2]">
                {craftStagesData[craftStage].title}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#9AA39D] leading-relaxed max-w-lg">
                {craftStagesData[craftStage].desc}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[rgba(242,242,242,0.08)] text-xs font-mono">
                <div className="p-4 bg-[#0A0F0C] border border-[rgba(242,242,242,0.10)] rounded-[2px]">
                  <div className="text-2xl font-bold text-[#F2F2F2]">92.5%</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#9AA39D] mt-1">
                    Assay Certified Fine Silver
                  </div>
                </div>
                <div className="p-4 bg-[#0A0F0C] border border-[rgba(242,242,242,0.10)] rounded-[2px]">
                  <div className="text-2xl font-bold text-[#8FB89A]">0% Ni</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#9AA39D] mt-1">
                    Hypoallergenic & Nickel Free
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 05: FEATURED PIECES — LARGE EDITORIAL SCENES WITH HUD LABELS
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-[6vw] border-b border-[rgba(242,242,242,0.10)] relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(242,242,242,0.10)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] block mb-2">
                  Scene 05 • Primary Exhibition Floor
                </span>
                <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-[#F2F2F2]">
                  The Exhibition Floor.
                </h2>
              </div>
              <Link
                href="/shop"
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#F2F2F2] hover:text-[#8FB89A] transition-colors"
              >
                <span>View All {products.length} Silver Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6C8F72]" />
              </Link>
            </div>

            {/* Asymmetric Product Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPieces.map((product, idx) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    product={product}
                    onQuickView={(p) => setQuickProduct(p)}
                  />
                  {/* Faint watermark behind first item in row */}
                  {idx === 0 && (
                    <div className="absolute -top-10 -right-4 font-sans font-black text-6xl text-[#F2F2F2]/[0.03] pointer-events-none select-none uppercase">
                      925
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 06: BRAND STORY WITH ORBITAL ARCS & CALLIGRAPHIC ACCENT
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-[6vw] border-b border-[rgba(242,242,242,0.10)] bg-gradient-to-b from-[#030504] via-[#0B1A12]/30 to-[#030504] relative overflow-hidden">
          <OrbitArc orientation="top-right" opacity={0.35} />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9AA39D]">
              Scene 06 • The Sovereign Manifesto
            </span>

            <h2 className="font-sans font-medium text-4xl sm:text-6xl uppercase tracking-tight text-[#F2F2F2] leading-tight">
              I Came. I Conquered. <br />
              <span className="font-editorial italic font-light text-[#8FB89A]">
                Permanent
              </span>{' '}
              Presence.
            </h2>

            <p className="font-editorial italic text-xl sm:text-2xl text-[#9AA39D] leading-relaxed max-w-2xl mx-auto">
              "We reject hollow jewellery that pretends to be precious. We build heavy, unapologetic silver for those who command their own presence."
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#F2F2F2] hover:text-[#8FB89A] transition-colors"
              >
                <span>Read The Silversmith Manifesto</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6C8F72]" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 07: SHOP CTA & VIP CONCIERGE ACCESS
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-[6vw] border-b border-[rgba(242,242,242,0.10)] bg-[#030504] relative">
          <div className="max-w-4xl mx-auto bg-[#0A0F0C] border border-[rgba(242,242,242,0.12)] p-8 sm:p-14 text-center relative overflow-hidden rounded-[2px] shadow-2xl">
            <CornerBrackets size={18} color="rgba(108,143,114,0.5)" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2">
                <SparkleStar size={16} color="#8FB89A" />
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#6C8F72]">
                  Scene 07 • Guest Acquisition
                </span>
              </div>

              <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-[#F2F2F2]">
                Acquire Signature Silver
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#9AA39D] leading-relaxed">
                Guest checkout with Razorpay. No account creation required. Seamless delivery throughout India with live status tracking.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#F2F2F2] hover:bg-white text-[#030504] font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all shadow-xl rounded-[2px]"
                >
                  Enter Catalog ({products.length} Pieces)
                </Link>

                <a
                  href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20would%20like%20to%20consult%20with%20an%20atelier%20specialist."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 border border-[#6C8F72] text-[#6C8F72] hover:bg-[#0B1A12] font-mono text-xs uppercase tracking-[0.14em] transition-colors flex items-center justify-center space-x-2 rounded-[2px]"
                >
                  <span>WhatsApp Atelier Concierge</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Quick View Modal */}
      {quickProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#030504]/90 backdrop-blur-md"
            onClick={() => setQuickProduct(null)}
          />
          <div className="relative w-full max-w-3xl bg-[#0A0F0C] border border-[rgba(242,242,242,0.14)] shadow-2xl p-6 sm:p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden rounded-[2px]">
            <div className="aspect-[4/5] bg-[#030504] border border-[rgba(242,242,242,0.10)] overflow-hidden relative">
              <Image
                src={quickProduct.images[0] || '/images/products/pdt-1.jpeg'}
                alt={quickProduct.name}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#9AA39D]">
                    {quickProduct.sku}
                  </span>
                  <button
                    onClick={() => setQuickProduct(null)}
                    className="text-[#9AA39D] hover:text-[#F2F2F2] text-sm"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-sans font-medium text-2xl uppercase tracking-tight text-[#F2F2F2] mt-2">
                  {quickProduct.name}
                </h3>
                <p className="font-editorial italic text-sm text-[#9AA39D] mt-1">
                  {quickProduct.tagline}
                </p>

                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="font-mono text-xl font-semibold text-[#F2F2F2]">
                    ₹{quickProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickProduct.originalPrice > quickProduct.price && (
                    <span className="font-mono text-sm text-[#9AA39D] line-through">
                      ₹{quickProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {quickProduct.isFiftyPercentOffer && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6C8F72] font-semibold">
                      50% Offer Active
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs font-sans text-[#9AA39D] leading-relaxed">
                  {quickProduct.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[rgba(242,242,242,0.08)] text-[11px] font-mono space-y-1 text-[#9AA39D]">
                  <div>• Material: {quickProduct.specifications.material} ({quickProduct.specifications.purity})</div>
                  <div>• Weight: {quickProduct.specifications.weight}</div>
                  <div>• Hallmark: {quickProduct.specifications.hallmark}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[rgba(242,242,242,0.08)] flex items-center space-x-3">
                <Link
                  href={`/product/${quickProduct.slug}`}
                  onClick={() => setQuickProduct(null)}
                  className="flex-1 py-3 text-center bg-[#F2F2F2] hover:bg-white text-[#030504] font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px]"
                >
                  View Full Object Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
