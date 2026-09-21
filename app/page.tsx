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
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicOpening from '@/components/luxury/CinematicOpening';
import HeroSection from '@/components/hero/HeroSection';
import ProductCard from '@/components/product/ProductCard';
import Velaris from '@/components/ui/velaris';
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

        // Calculate active scene (1 through 9)
        const sceneNum = Math.min(9, Math.max(1, Math.floor((progress / 100) * 9) + 1));
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

  const featuredPieces = products.filter((p) => p.featured).slice(0, 8);

  // Carousel items map directly to real products
  // PROTECTED: Data fed into CardFanCarousel stays clean
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

      {/* Fixed Hairline Progress Bar in Emerald Green */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-green z-50 pointer-events-none transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Fixed Floating Scene Counter Pill */}
      <div
        className="fixed bottom-6 left-6 z-30 hidden sm:flex items-center space-x-2.5 px-3.5 py-1.5 bg-white/90 border border-line rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(15,46,32,0.08)] text-[10px] font-mono uppercase tracking-[0.16em] text-muted pointer-events-none"
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
        <span className="text-ink font-medium">Scene 0{activeScene}</span>
        <span className="text-muted/40">/</span>
        <span>09</span>
      </div>

      <div ref={containerRef} className="relative bg-ivory text-ink selection:bg-sage/30 selection:text-forest">
        
        {/* =========================================================================
            SCENE 01: HERO — VELORE ATELIER MINIMAL 3D HERO SECTION
        ========================================================================= */}
        <HeroSection />

        {/* =========================================================================
            SCENE 02: COLLECTION INTRO — EDITORIAL ARCHIVE REVEAL ON IVORY STAGE
        ========================================================================= */}
        <section className="border-b border-line relative overflow-hidden py-16 sm:py-20 bg-pearl">
          {/* Faint Giant Serif Word behind */}
          <div className="absolute top-6 right-4 font-editorial italic text-[16vw] leading-none text-forest/[0.04] pointer-events-none select-none">
            Archive
          </div>
          <ChromeRibbon variant="right" opacity={0.35} className="top-0 right-0 w-[450px] h-[300px]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-[6vw]">
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted mb-3">
              <SparkleStar size={12} color="#1F4D36" />
              <span>Scene 02 • Interactive Physical Archive</span>
            </div>
            <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-ink max-w-2xl">
              The Architecture of Solid Silver.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-muted max-w-xl mt-3 leading-relaxed">
              Every ring, cuff, and pendant in this archive is sculpted in monolithic 925 sterling silver. No hollow molds. No industrial compromises. Explore the tactile weight of authentic metallurgy.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SCENE 03: PROTECTED CARD FAN CAROUSEL ON DEEP-EMERALD FULL-BLEED PANEL
            Note: card-fan-carousel.tsx is UNTOUCHED; panel is #0F2E20 with white text
        ========================================================================= */}
        <section className="bg-forest text-white relative overflow-hidden py-20 border-b border-emerald/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.2)]">
          {/* Subtle orbital arcs and sparkle stars */}
          <OrbitArc orientation="top-right" opacity={0.2} />
          <ChromeRibbon variant="left" opacity={0.25} className="top-0 left-0 w-[550px] h-[350px]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-[6vw] mb-6 relative z-10">
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-sage mb-2">
              <SparkleStar size={12} color="#A9BFAE" />
              <span>Scene 03 • The Fanned Vault Carousel</span>
            </div>
            <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-white">
              Tactile Collection Carousel.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-mist max-w-xl mt-2 leading-relaxed">
              Slide and expand across our 925 solid sterling collection. Each piece expands in tactile motion to reveal individual hallmarked specifications.
            </p>
          </div>

          {/* PROTECTED: UNTOUCHED CARD FAN CAROUSEL */}
          <div className="max-w-7xl mx-auto relative z-10">
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
            SCENE 04: 50% CELEBRATION METALLIC MARQUEE STRIP
        ========================================================================= */}
        {initialSettings.globalFiftyPercentActive && (
          <section className="border-b border-line bg-gradient-to-r from-pearl via-white to-pearl py-4 relative overflow-hidden select-none">
            <div className="flex items-center space-x-8 whitespace-nowrap animate-shimmer text-[11px] font-mono uppercase tracking-[0.18em] text-ink">
              <div className="flex items-center space-x-8">
                <span className="text-emerald font-semibold">50% Celebration Offer Active</span>
                <SparkleStar size={12} color="#1F4D36" />
                <span>Direct Atelier Pricing On All 925 Pieces</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span>Complimentary Insured Courier Across India</span>
                <SparkleStar size={12} color="#1F4D36" />
                <span>BIS 925 Hallmark Laser Certified</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span className="text-emerald font-semibold">50% Celebration Offer Active</span>
                <SparkleStar size={12} color="#1F4D36" />
                <span>Direct Atelier Pricing On All 925 Pieces</span>
                <SparkleStar size={12} color="#6C8F72" />
                <span>Complimentary Insured Courier Across India</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SCENE 05: CRAFTSMANSHIP — PINNED NARRATIVE SCENE WITH CLIP-PATH REVEALS
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-[6vw] border-b border-line relative overflow-hidden bg-ivory">
          <SceneBackground withHalftone theme="light" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Image Strip with Corner Brackets & Clip Path */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] bg-pearl border border-line overflow-hidden shadow-[0_12px_40px_rgba(15,46,32,0.08)] rounded-[2px]">
                <CornerBrackets size={16} color="rgba(31,77,54,0.6)" />
                <Image
                  src={craftStagesData[craftStage].image}
                  alt={craftStagesData[craftStage].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent pointer-events-none" />

                {/* Leader Line to Spec Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                  <LeaderLine length={60} label={craftStagesData[craftStage].spec} />
                  <span className="text-[10px] font-mono text-white px-2.5 py-1 bg-forest/90 border border-emerald/50 rounded-sm">
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
                        ? 'border-emerald bg-emerald text-white shadow-sm'
                        : 'border-line bg-white/75 text-muted hover:border-emerald/40 hover:text-ink'
                    }`}
                  >
                    Phase {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-green inline-block animate-pulse" />
                <span>Scene 05 • The Generational Silversmith Atelier</span>
              </div>

              <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-ink">
                {craftStagesData[craftStage].title}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed max-w-lg">
                {craftStagesData[craftStage].desc}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-line text-xs font-mono">
                <div className="p-4 bg-white border border-line rounded-[2px] shadow-sm">
                  <div className="text-2xl font-bold text-ink">92.5%</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted mt-1">
                    Assay Certified Fine Silver
                  </div>
                </div>
                <div className="p-4 bg-white border border-line rounded-[2px] shadow-sm">
                  <div className="text-2xl font-bold text-emerald">0% Ni</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted mt-1">
                    Hypoallergenic & Nickel Free
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 06: FEATURED PIECES — EDITORIAL SHOWCASE WITH CLEAN LIGHT CARDS
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-[6vw] border-b border-line relative bg-pearl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-line">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted block mb-2">
                  Scene 06 • Primary Exhibition Floor
                </span>
                <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-ink">
                  The Exhibition Floor.
                </h2>
              </div>
              <Link
                href="/shop"
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.14em] text-ink hover:text-emerald font-semibold transition-colors"
              >
                <span>View All {products.length} Silver Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald" />
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
                    <div className="absolute -top-10 -right-4 font-sans font-black text-6xl text-forest/[0.04] pointer-events-none select-none uppercase">
                      925
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 07: MATERIAL SPECIFICATION PANEL
        ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-[6vw] border-b border-line bg-white relative">
          <div className="max-w-6xl mx-auto bg-ivory border border-line p-8 sm:p-12 rounded-[2px] relative overflow-hidden shadow-sm">
            <CornerBrackets size={16} color="rgba(31,77,54,0.4)" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-emerald font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  <span>Scene 07 • Metallurgy Standard</span>
                </div>
                <h3 className="font-sans font-medium text-2xl sm:text-3xl uppercase tracking-tight text-ink">
                  Certified 925 Solid Sterling
                </h3>
                <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed">
                  Every gram of silver in our atelier is guaranteed 92.5% purity, alloyed without nickel or harmful base metals, and shielded with electrolytic rhodium for everlasting luster.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-white border border-line rounded-[2px]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block">Hallmark</span>
                  <span className="text-sm font-bold text-ink mt-1 block">BIS 925 Laser</span>
                </div>
                <div className="p-4 bg-white border border-line rounded-[2px]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block">Allergy Free</span>
                  <span className="text-sm font-bold text-emerald mt-1 block">100% Nickel-0</span>
                </div>
                <div className="p-4 bg-white border border-line rounded-[2px] col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block">Packaging</span>
                  <span className="text-sm font-bold text-ink mt-1 block">Signature Box</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 08: BRAND STORY WITH VELARIS LIVING GRADIENT ON DEEP EMERALD PANEL
        ========================================================================= */}
        <section className="border-b border-emerald/30 relative overflow-hidden">
          <Velaris
            bg="#0F2E20"
            colors={["#1F4D36", "#0F2E20", "#2C6347", "#0A2016"]}
            height="auto"
            grain={0.2}
            speed={1.5}
            className="py-28 px-6 sm:px-10 lg:px-[6vw] text-white"
          >
            <OrbitArc orientation="top-right" opacity={0.3} />

            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-sage">
                Scene 08 • The Sovereign Manifesto
              </span>

              <h2 className="font-sans font-medium text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
                I Came. I Conquered. <br />
                <span className="font-editorial italic font-light text-sage">
                  Permanent
                </span>{' '}
                Presence.
              </h2>

              <p className="font-editorial italic text-xl sm:text-2xl text-mist leading-relaxed max-w-2xl mx-auto">
                "We reject hollow jewellery that pretends to be precious. We build heavy, unapologetic silver for those who command their own presence."
              </p>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.14em] text-white hover:text-sage transition-colors underline decoration-sage/40 underline-offset-8"
                >
                  <span>Read The Silversmith Manifesto</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sage" />
                </Link>
              </div>
            </div>
          </Velaris>
        </section>

        {/* =========================================================================
            SCENE 09: SHOP CTA & VIP CONCIERGE ACCESS ON IVORY STAGE
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-[6vw] border-b border-line bg-ivory relative">
          <div className="max-w-4xl mx-auto bg-white border border-line p-8 sm:p-14 text-center relative overflow-hidden rounded-[2px] shadow-[0_12px_40px_rgba(15,46,32,0.06)]">
            <CornerBrackets size={18} color="rgba(31,77,54,0.5)" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2">
                <SparkleStar size={16} color="#1F4D36" />
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald font-semibold">
                  Scene 09 • Guest Acquisition
                </span>
              </div>

              <h2 className="font-sans font-medium text-3xl sm:text-5xl uppercase tracking-tight text-ink">
                Acquire Signature Silver
              </h2>

              <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                Guest checkout with Razorpay. No account creation required. Seamless delivery throughout India with live status tracking.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all shadow-[0_4px_20px_rgba(31,77,54,0.25)] rounded-[2px]"
                >
                  Enter Catalog ({products.length} Pieces)
                </Link>

                <a
                  href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20would%20like%20to%20consult%20with%20an%20atelier%20specialist."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 border border-line hover:border-emerald bg-white text-ink hover:text-emerald font-mono text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center space-x-2 rounded-[2px] shadow-sm"
                >
                  <span>WhatsApp Atelier Concierge</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald" />
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
            className="fixed inset-0 bg-forest/60 backdrop-blur-sm"
            onClick={() => setQuickProduct(null)}
          />
          <div className="relative w-full max-w-3xl bg-white border border-line shadow-2xl p-6 sm:p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden rounded-[2px]">
            <div className="aspect-[4/5] bg-pearl border border-line overflow-hidden relative rounded-sm">
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
                  <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-muted">
                    {quickProduct.sku}
                  </span>
                  <button
                    onClick={() => setQuickProduct(null)}
                    className="text-muted hover:text-ink text-sm p-1"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-sans font-medium text-2xl uppercase tracking-tight text-ink mt-2">
                  {quickProduct.name}
                </h3>
                <p className="font-editorial italic text-sm text-muted mt-1">
                  {quickProduct.tagline}
                </p>

                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="font-mono text-xl font-semibold text-ink">
                    ₹{quickProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickProduct.originalPrice > quickProduct.price && (
                    <span className="font-mono text-sm text-muted line-through">
                      ₹{quickProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {quickProduct.isFiftyPercentOffer && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-semibold">
                      50% Offer Active
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs font-sans text-muted leading-relaxed">
                  {quickProduct.description}
                </p>

                <div className="mt-4 pt-4 border-t border-line text-[11px] font-mono space-y-1 text-muted">
                  <div>• Material: {quickProduct.specifications.material} ({quickProduct.specifications.purity})</div>
                  <div>• Weight: {quickProduct.specifications.weight}</div>
                  <div>• Hallmark: {quickProduct.specifications.hallmark}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-line flex items-center space-x-3">
                <Link
                  href={`/product/${quickProduct.slug}`}
                  onClick={() => setQuickProduct(null)}
                  className="flex-1 py-3 text-center bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-sm"
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
