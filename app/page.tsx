'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Clock,
  Compass,
  CheckCircle2,
  Lock
} from 'lucide-react';
import CinematicOpening from '@/components/luxury/CinematicOpening';
import SilverJewellery3D from '@/components/luxury/SilverJewellery3D';
import ProductCard from '@/components/product/ProductCard';
import { CardFanCarousel, CardFanItem } from '@/components/ui/card-fan-carousel';
import { Product } from '@/lib/types';
import { initialProducts } from '@/lib/data/initialProducts';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Check if intro has already played in this browser session
    const seen = sessionStorage.getItem('vvv_intro_seen');
    if (seen === 'true') {
      setShowIntro(false);
    }

    // Fetch dynamic products from API to ensure real-time price & stock updates
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.warn('Using initial products cache', err));
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('vvv_intro_seen', 'true');
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

  return (
    <>
      {/* 7-Stage Cinematic Vault Entry Experience */}
      {showIntro && <CinematicOpening onComplete={handleIntroComplete} />}

      <div className="relative bg-[#030504] text-[#F2F2F2] selection:bg-[#6C8F72]/30 selection:text-[#F2F2F2]">
        
        {/* =========================================================================
            SCENE 01-04: GROK-STYLE CINEMATIC ARCHITECTURAL SILVER VOID
        ========================================================================= */}
        <section className="relative min-h-[calc(100svh-104px)] flex flex-col justify-between px-6 sm:px-10 lg:px-[6vw] pt-6 sm:pt-8 pb-10 overflow-hidden border-b border-[rgba(242,242,242,0.10)]">
          {/* Subtle Ambient Radial Glow centered behind the 3D showcase */}
          <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(108,143,114,0.07)_0%,rgba(11,26,18,0.04)_45%,transparent_70%)] pointer-events-none" />

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
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Micro-label kicker */}
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] border border-[rgba(242,242,242,0.12)] bg-[#0A0F0C]/80 text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] w-fit mb-5">
                <Sparkles className="w-3 h-3 text-[#8FB89A]" />
                <span>Exhibition Catalog 2026</span>
              </div>

              {/* Headline */}
              <h1 className="font-sans font-medium text-4xl sm:text-6xl lg:text-[clamp(2.75rem,5vw,5.25rem)] leading-[1.03] tracking-[-0.03em] text-[#F2F2F2] mb-6 uppercase">
                Liquid Chrome. <br />
                <span className="font-editorial italic font-light text-[#9AA39D] lowercase">
                  architectural
                </span>{' '}
                Silver.
              </h1>

              {/* Subheading / Description */}
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

            {/* Right Column: 3D Interactive Silver Jewellery Studio (Cols 8-12) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <SilverJewellery3D />
              </div>
            </div>
          </div>

          {/* Bottom Scene Ticker */}
          <div className="relative z-10 pt-4 border-t border-[rgba(242,242,242,0.08)] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D]">
            <span>Scene 01–04 • Pure Material Induction</span>
            <div className="flex items-center space-x-1.5">
              <span>Scroll to Enter Curated Exhibition</span>
              <span className="animate-bounce text-[#6C8F72]">↓</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 05: CURATED COLLECTION CATEGORIES
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-steel/30 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-steel/40">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
                  Scene 05 • Taxonomy
                </span>
                <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
                  Curated Categories
                </h2>
              </div>
              <p className="mt-4 md:mt-0 font-editorial italic text-base sm:text-lg text-silver/80 max-w-md text-left md:text-right">
                Engineered for daily resilience, formal authority, and bespoke individuality.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className="group flex flex-col bg-carbon/90 border border-steel/60 hover:border-moss transition-all duration-500 overflow-hidden rounded-sm"
                >
                  <div className="relative aspect-[3/4] w-full bg-void overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,5,0.45)_95%)]" />
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-graphite/90 border border-steel/60 text-[9px] font-mono text-silver">
                      {cat.count} PIECES
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-xs uppercase tracking-super-wide font-medium text-ice-white group-hover:text-bright-silver transition-colors">
                        {cat.title}
                      </h3>
                      <p className="mt-1 text-[11px] font-editorial italic text-silver/70 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-steel/30 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-silver/60 group-hover:text-ice-white">
                      <span>Browse category</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-signature-green" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            INTERACTIVE CARD FAN CAROUSEL SHOWCASE (21ST.DEV INTEGRATION)
        ========================================================================= */}
        <section className="border-b border-steel/30 bg-gradient-to-b from-void via-[#0B1A12]/20 to-void relative">
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
            SCENE 06: ASYMMETRIC EDITORIAL PRODUCT GALLERY (SHOWCASING MANY PIECES)
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-[#0B1A12]/30 to-void">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-steel/40">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
                  Scene 06 • The Primary Discovery
                </span>
                <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
                  The Exhibition Floor
                </h2>
              </div>
              <Link
                href="/shop"
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs uppercase tracking-super-wide text-bright-silver hover:text-white"
              >
                <span>View All {products.length} Silver Pieces</span>
                <ArrowRight className="w-4 h-4 text-signature-green" />
              </Link>
            </div>

            {/* Asymmetric Product Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPieces.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 07: 50% CELEBRATION OFFER METALLIC MARQUEE
        ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-[#0B1A12]/40 to-void relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 border border-signature-green/40 bg-forest-deep/60 text-[10px] font-sans uppercase tracking-monumental text-signature-green font-semibold rounded-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-signature-green inline-block animate-pulse" />
              <span>Limited Atelier Campaign</span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-ice-white font-normal leading-tight">
              50% Royal Celebration Offer
            </h2>

            <p className="font-editorial italic text-lg sm:text-2xl text-silver/90 max-w-2xl mx-auto">
              For a limited window, our signature 925 sterling pieces are presented at direct atelier pricing. Fully hallmarked, guaranteed for lifetime purity.
            </p>

            <div className="pt-4 flex items-center justify-center space-x-6 text-xs font-sans uppercase tracking-widest text-silver/70">
              <span>✓ Applied Automatically At Checkout</span>
              <span className="text-signature-green">•</span>
              <span>✓ Insured Pan-India Transit</span>
            </div>

            <div className="pt-6">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-3 px-10 py-5 gothic-btn-primary font-sans text-xs uppercase tracking-monumental font-semibold transition-all duration-300 shadow-2xl rounded-sm"
              >
                <span>Acquire Signature Pieces</span>
                <ArrowRight className="w-4 h-4 text-signature-green" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 08: METALLURGY & CRAFTSMANSHIP (PINNED NARRATIVE)
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-[#0B1A12]/20 to-void relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Lookbook Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] bg-carbon border border-steel/60 hover:border-moss transition-all duration-500 overflow-hidden shadow-2xl rounded-sm">
                <img
                  src="/images/products/pdt-8.jpeg"
                  alt="Silver Craftsmanship Atelier - Hand Finished 925 Solid Sterling"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/70 block">
                    Assay & Forging Protocol
                  </span>
                  <p className="font-editorial italic text-xl text-ice-white mt-1">
                    "Metal must not merely be bent; it must be taught to remember light."
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
                  Scene 08 • Craftsmanship
                </span>
                <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal leading-tight">
                  The Generational Silversmith Atelier
                </h2>
              </div>

              <div className="space-y-6 text-xs sm:text-sm font-sans text-silver/80 leading-relaxed">
                <p>
                  Every VINI VICI VIDI artefact begins as molten fine grain silver alloyed strictly to 92.5% purity. We eschew mass die-stamping in favor of heavy hydraulic casting and individual jewelers’ chisel work.
                </p>
                <p>
                  Each piece undergoes a proprietary microscopic micro-polishing cycle followed by a clear electrolytic rhodium barrier layer. This shields your silver against premature atmospheric oxidation while maintaining the cold, tactile brilliance of authentic metal.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-steel/40 text-xs font-sans">
                <div>
                  <div className="font-display text-2xl text-bright-silver">92.5%</div>
                  <div className="text-[10px] uppercase tracking-widest text-silver/60 mt-1">
                    Certified Fine Silver
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl text-bright-silver">0% Ni</div>
                  <div className="text-[10px] uppercase tracking-widest text-silver/60 mt-1">
                    100% Nickel-Free & Hypoallergenic
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 09 & 10: REAL-TIME LOW-STOCK URGENCY & INVENTORY INTEGRITY
        ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-[#0B1A12]/30 to-void">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-steel/40">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-monumental text-signature-green font-semibold mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Scene 09–10 • Limited Stock Vault</span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
                  Remaining Studio Specimens
                </h2>
              </div>
              <p className="mt-4 md:mt-0 font-editorial italic text-base text-silver/70 max-w-sm">
                Live backend inventory: When quantity drops to 3 or fewer, pieces are queued for vault archival.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {urgentPieces.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 11: BRAND STORY & PHILOSOPHY
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-graphite/40 to-void relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
              Scene 11 • The Sovereign Manifesto
            </span>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase text-ice-white font-normal leading-tight">
              I Came. I Conquered. I Saw.
            </h2>

            <p className="font-editorial italic text-xl sm:text-2xl text-silver/90 leading-relaxed">
              "We reject hollow jewellery that pretends to be precious. We build heavy, unapologetic silver for those who command their own presence."
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-super-wide text-bright-silver hover:text-white"
              >
                <span>Read The Full Manifesto</span>
                <ArrowRight className="w-4 h-4 text-signature-green" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 12 & 13: SHOP CONVERSION & PRIVATE WHATSAPP CONCIERGE
        ========================================================================= */}
        <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-steel/40 bg-gradient-to-b from-void via-[#0B1A12]/40 to-void">
          <div className="max-w-5xl mx-auto bg-carbon/90 border border-steel/60 hover:border-moss transition-all duration-500 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl rounded-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-display text-8xl pointer-events-none select-none text-signature-green">
              VVV
            </div>

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-[10px] font-sans uppercase tracking-monumental text-signature-green font-semibold">
                Scene 12–13 • Guest Conversion
              </span>

              <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
                Begin Your Silver Collection
              </h2>

              <p className="font-sans text-xs sm:text-sm text-silver/80 leading-relaxed">
                Guest checkout with Razorpay. No account creation required. Seamless delivery throughout India with live status tracking.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 gothic-btn-primary font-sans text-xs uppercase tracking-monumental font-semibold transition-all shadow-xl rounded-sm"
                >
                  Enter Catalog ({products.length} Pieces)
                </Link>

                <a
                  href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20would%20like%20to%20consult%20with%20an%20atelier%20specialist."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 border border-signature-green/60 text-signature-green hover:bg-forest-deep/50 font-sans text-xs uppercase tracking-monumental transition-colors flex items-center justify-center space-x-2 rounded-sm"
                >
                  <span>WhatsApp VIP Concierge</span>
                  <ArrowRight className="w-4 h-4" />
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
            className="fixed inset-0 bg-void/85 backdrop-blur-md"
            onClick={() => setQuickProduct(null)}
          />
          <div className="relative w-full max-w-3xl bg-carbon border border-steel/70 shadow-2xl p-6 sm:p-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden rounded-sm">
            <div className="aspect-[4/5] bg-void border border-steel/40 overflow-hidden relative">
              <img
                src={quickProduct.images[0] || '/images/products/pdt-1.jpeg'}
                alt={quickProduct.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-sans tracking-monumental uppercase text-silver/60">
                    {quickProduct.sku}
                  </span>
                  <button
                    onClick={() => setQuickProduct(null)}
                    className="text-silver hover:text-ice-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-display text-2xl uppercase tracking-wider text-ice-white mt-2">
                  {quickProduct.name}
                </h3>
                <p className="font-editorial italic text-sm text-silver/70 mt-1">
                  {quickProduct.tagline}
                </p>

                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="font-mono text-xl font-semibold text-ice-white">
                    ₹{quickProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickProduct.originalPrice > quickProduct.price && (
                    <span className="font-mono text-sm text-chrome line-through">
                      ₹{quickProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {quickProduct.isFiftyPercentOffer && (
                    <span className="text-[10px] font-sans uppercase tracking-widest text-brand-green font-semibold">
                      50% Offer Applied
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs font-sans text-silver/80 leading-relaxed">
                  {quickProduct.description}
                </p>

                <div className="mt-4 pt-4 border-t border-steel/40 text-[11px] font-sans space-y-1 text-silver/70">
                  <div>• Material: {quickProduct.specifications.material} ({quickProduct.specifications.purity})</div>
                  <div>• Weight: {quickProduct.specifications.weight}</div>
                  <div>• Hallmark: {quickProduct.specifications.hallmark}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-steel/40 flex items-center space-x-3">
                <Link
                  href={`/product/${quickProduct.slug}`}
                  onClick={() => setQuickProduct(null)}
                  className="flex-1 py-3 text-center bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-super-wide font-semibold transition-colors"
                >
                  Full Object Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
