'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { initialProducts } from '@/lib/data/initialProducts';

interface GalleryPlate {
  id: string;
  type: 'product' | 'atmosphere';
  plateNumber: string;
  src: string;
  title: string;
  subtitle: string;
  material: string;
  aspectRatio: string;
  productSlug?: string;
  price?: number;
  colSpan?: string;
}

// Curate gallery plates strictly from real client product inventory and procedural atmosphere plates
const galleryPlates: GalleryPlate[] = [
  {
    id: 'plate-01',
    type: 'product',
    plateNumber: '01',
    src: '/images/products/pdt-1.jpeg',
    title: initialProducts[0]?.name || 'Aethelgard Hand-Carved Sovereign Ring',
    subtitle: 'Brutalist Geometry • Chiseled Intaglio',
    material: 'Solid Sterling Silver • 925 Certified',
    aspectRatio: 'aspect-[4/5]',
    productSlug: initialProducts[0]?.slug,
    price: initialProducts[0]?.price,
    colSpan: 'lg:col-span-8'
  },
  {
    id: 'plate-02',
    type: 'product',
    plateNumber: '02',
    src: '/images/products/pdt-2.jpeg',
    title: initialProducts[1]?.name || 'Argent L\'Ombre Liquid Drop Pendant',
    subtitle: 'Fluid Gravitational Molten Form',
    material: 'Solid 925 Silver • Liquid Chrome Finish',
    aspectRatio: 'aspect-square',
    productSlug: initialProducts[1]?.slug,
    price: initialProducts[1]?.price,
    colSpan: 'lg:col-span-4'
  },
  {
    id: 'plate-03',
    type: 'product',
    plateNumber: '03',
    src: '/images/products/pdt-3.jpeg',
    title: initialProducts[2]?.name || 'Vesper Heavy Solid Torque Bangle',
    subtitle: 'Tapered Finials • Hand-Finished Satin',
    material: '925 Fine Sterling • 42.6 Grams',
    aspectRatio: 'aspect-square',
    productSlug: initialProducts[2]?.slug,
    price: initialProducts[2]?.price,
    colSpan: 'lg:col-span-5'
  },
  {
    id: 'plate-04',
    type: 'atmosphere',
    plateNumber: '04',
    src: '', // Procedural atmosphere plate (liquid chrome vector study)
    title: 'NON-PRODUCT ATMOSPHERE: SPECULAR METALLURGY VECTOR',
    subtitle: 'Micro-Grain Light Diffraction Simulation (Non-Jewellery Plate)',
    material: 'Procedural Computational Light Study',
    aspectRatio: 'aspect-[16/9]',
    colSpan: 'lg:col-span-7'
  },
  {
    id: 'plate-05',
    type: 'product',
    plateNumber: '05',
    src: '/images/products/pdt-4.jpeg',
    title: initialProducts[3]?.name || 'Ouroboros Diamond-Cut Byzantine Chain',
    subtitle: 'Interlocking Quad-Link Heraldry Weave',
    material: '925 Sterling Silver • 38.2 Grams',
    aspectRatio: 'aspect-[4/5]',
    productSlug: initialProducts[3]?.slug,
    price: initialProducts[3]?.price,
    colSpan: 'lg:col-span-4'
  },
  {
    id: 'plate-06',
    type: 'product',
    plateNumber: '06',
    src: '/images/products/pdt-5.jpeg',
    title: initialProducts[4]?.name || 'Valknut Monolithic Shield Signet',
    subtitle: 'Faceted Knife-Edge Architectural Band',
    material: '925 Sterling Silver • Deep Acid Oxidation',
    aspectRatio: 'aspect-[16/10]',
    productSlug: initialProducts[4]?.slug,
    price: initialProducts[4]?.price,
    colSpan: 'lg:col-span-8'
  },
  {
    id: 'plate-07',
    type: 'product',
    plateNumber: '07',
    src: '/images/products/pdt-6.jpeg',
    title: initialProducts[5]?.name || 'Obsidian Monolith Intaglio Ring',
    subtitle: 'Natural Mineral Inlay In Cast Chasis',
    material: '925 Sterling Silver • Natural Obsidian Matrix',
    aspectRatio: 'aspect-square',
    productSlug: initialProducts[5]?.slug,
    price: initialProducts[5]?.price,
    colSpan: 'lg:col-span-6'
  },
  {
    id: 'plate-08',
    type: 'product',
    plateNumber: '08',
    src: '/images/products/pdt-7.jpeg',
    title: initialProducts[6]?.name || 'Kavach Sacred Geometry Reliquary Locket',
    subtitle: 'Concealed Hinge Bespoke Vessel',
    material: 'Solid 925 Sterling • Micro-Hinge Metallurgy',
    aspectRatio: 'aspect-square',
    productSlug: initialProducts[6]?.slug,
    price: initialProducts[6]?.price,
    colSpan: 'lg:col-span-6'
  },
  {
    id: 'plate-09',
    type: 'product',
    plateNumber: '09',
    src: '/images/products/pdt-8.jpeg',
    title: initialProducts[7]?.name || 'Chronos Ribbed Articulated Armor Cuff',
    subtitle: 'Segmented Ergonomic Wrist Armor',
    material: 'Certified 925 Sterling • 54.0 Grams',
    aspectRatio: 'aspect-[4/5]',
    productSlug: initialProducts[7]?.slug,
    price: initialProducts[7]?.price,
    colSpan: 'lg:col-span-7'
  },
  {
    id: 'plate-10',
    type: 'product',
    plateNumber: '10',
    src: '/images/products/pdt-9.jpeg',
    title: initialProducts[8]?.name || 'Gothic Thorn Floral Seal Ring',
    subtitle: 'Baroque Silhouette Meets Brutalist Steel Cast',
    material: 'Solid 925 Sterling • Hand Carved In Mumbai',
    aspectRatio: 'aspect-[4/5]',
    productSlug: initialProducts[8]?.slug,
    price: initialProducts[8]?.price,
    colSpan: 'lg:col-span-5'
  }
];

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % galleryPlates.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev !== null ? (prev - 1 + galleryPlates.length) % galleryPlates.length : 0
        );
      }
    },
    [activeIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, activeIndex]);

  const activePlate = activeIndex !== null ? galleryPlates[activeIndex] : null;

  return (
    <div className="bg-ivory min-h-screen text-ink selection:bg-sage/30 selection:text-forest">
      {/* Editorial Header */}
      <header className="px-6 sm:px-10 lg:px-[6vw] pt-12 pb-14 border-b border-line bg-pearl/60 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green inline-block animate-pulse" />
            <span className="text-emerald font-semibold">Exhibition Archive • Real Client Inventory Only</span>
          </div>

          <h1 className="font-sans font-medium text-4xl sm:text-6xl uppercase tracking-[-0.03em] text-ink">
            Exhibition Lookbook. <br />
            <span className="font-editorial italic font-light text-emerald lowercase">
              photographic
            </span>{' '}
            Studies.
          </h1>

          <p className="mt-4 font-sans text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Every plate represents authentic handcrafted 925 sterling silver artefacts from the Vini vici vidi atelier. Photographed under controlled showroom illumination to reveal true metallic texture and sculptural weight.
          </p>
        </div>
      </header>

      {/* Asymmetric Editorial Gallery Grid */}
      <main className="px-6 sm:px-10 lg:px-[6vw] py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {galleryPlates.map((plate, index) => (
            <article
              key={plate.id}
              className={`${plate.colSpan || 'lg:col-span-6'} group relative flex flex-col bg-white border border-line hover:border-green transition-all duration-500 overflow-hidden rounded-[2px] shadow-[0_4px_20px_rgba(15,46,32,0.04)] hover:shadow-[0_12px_30px_rgba(15,46,32,0.08)]`}
            >
              {/* Media Container with Desktop Hover Spotlight */}
              <div
                onClick={() => setActiveIndex(index)}
                className={`relative ${plate.aspectRatio} w-full overflow-hidden bg-pearl cursor-pointer`}
              >
                {plate.type === 'product' ? (
                  <>
                    <Image
                      src={plate.src}
                      alt={`${plate.title} - ${plate.material}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={index < 3}
                    />
                  </>
                ) : (
                  /* Procedural Atmosphere Plate (Strictly Non-Product) */
                  <div className="w-full h-full relative flex items-center justify-center p-8 bg-gradient-to-br from-pearl via-mist to-ivory overflow-hidden">
                    <svg className="w-full h-full opacity-70" viewBox="0 0 600 300" fill="none">
                      <defs>
                        <linearGradient id="chromeFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1F4D36" />
                          <stop offset="35%" stopColor="#6C8F72" />
                          <stop offset="70%" stopColor="#BFC3C7" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M-50,150 C150,50 250,250 450,120 C550,50 650,200 700,150"
                        stroke="url(#chromeFlow)"
                        strokeWidth="38"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M-30,220 C180,120 280,320 480,180 C580,120 680,260 720,200"
                        stroke="rgba(31,77,54,0.2)"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-line px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-muted text-center rounded-sm">
                      Atmospheric Ray-Traced Vector Study • Non-Jewellery Plate
                    </div>
                  </div>
                )}

                {/* Plate Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 border border-line text-[10px] font-mono tracking-[0.14em] text-ink backdrop-blur-sm shadow-sm">
                  PLATE {plate.plateNumber}
                </div>

                {/* Inspect Action Hint */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 border border-line text-[10px] font-mono uppercase tracking-[0.12em] text-muted group-hover:text-emerald transition-colors backdrop-blur-sm flex items-center space-x-1 shadow-sm">
                  <span>Enlarge</span>
                  <span>↗</span>
                </div>
              </div>

              {/* Caption Section with Real Metadata */}
              <div className="p-6 flex flex-col justify-between flex-1 border-t border-line bg-white">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-muted mb-1.5">
                    <span>{plate.subtitle}</span>
                    {plate.price && <span className="text-ink font-bold font-mono">₹{plate.price.toLocaleString('en-IN')}</span>}
                  </div>
                  <h2 className="font-sans font-medium text-lg uppercase tracking-tight text-ink group-hover:text-emerald transition-colors">
                    {plate.title}
                  </h2>
                  <p className="text-[11px] font-mono text-muted mt-1 tracking-wide">
                    {plate.material}
                  </p>
                </div>

                {plate.productSlug && (
                  <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                    <Link
                      href={`/product/${plate.productSlug}`}
                      className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald hover:text-forest font-semibold transition-colors flex items-center space-x-1.5"
                    >
                      <span>Acquire Piece In Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => setActiveIndex(index)}
                      className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted hover:text-ink transition-colors"
                    >
                      View Specs ↗
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Exhibition Closing Strip */}
        <section className="mt-24 p-10 sm:p-14 bg-white border border-line text-center max-w-4xl mx-auto rounded-[2px] shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 border border-line bg-pearl text-[10px] font-mono uppercase tracking-[0.14em] text-muted rounded-full">
              <Sparkles className="w-3 h-3 text-emerald" />
              <span className="text-emerald font-semibold">Limited Atelier Inventory</span>
            </div>
            <h2 className="font-sans font-medium text-2xl sm:text-4xl uppercase tracking-tight text-ink">
              Acquire Directly From The Silversmith Vault
            </h2>
            <p className="text-xs sm:text-sm font-sans text-muted max-w-lg mx-auto leading-relaxed">
              Every creation featured in this catalog is cast in solid 925 sterling metallurgy, individually stamped with official hallmarks and shipped in our magnetic presentation case.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all shadow-[0_4px_20px_rgba(31,77,54,0.25)] rounded-[2px]"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Keyboard-Navigable Lightbox Modal */}
      {activePlate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePlate.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-forest/60 backdrop-blur-md"
            onClick={() => setActiveIndex(null)}
          />

          {/* Modal Card */}
          <div className="relative max-w-5xl w-full max-h-[92vh] bg-white border border-line p-6 sm:p-8 z-10 shadow-2xl flex flex-col rounded-[2px]">
            {/* Top Bar */}
            <div className="flex justify-between items-start pb-4 border-b border-line">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block">
                  Plate {activePlate.plateNumber} of {galleryPlates.length < 10 ? `0${galleryPlates.length}` : galleryPlates.length}
                </span>
                <h3 className="font-sans font-medium text-xl uppercase tracking-tight text-ink mt-1">
                  {activePlate.title}
                </h3>
                <p className="text-xs font-mono text-muted mt-0.5">
                  {activePlate.material}
                </p>
              </div>
              <button
                onClick={() => setActiveIndex(null)}
                aria-label="Close Lightbox"
                className="p-2 text-muted hover:text-ink border border-line hover:border-emerald transition-colors rounded-[2px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Area */}
            <div className="relative flex-1 overflow-hidden my-6 flex items-center justify-center min-h-[40vh] max-h-[55vh] bg-pearl rounded-sm">
              {activePlate.type === 'product' ? (
                <div className="relative w-full h-full max-h-[55vh] flex items-center justify-center">
                  <Image
                    src={activePlate.src}
                    alt={activePlate.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-pearl border border-line">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
                    Atmospheric Computational Light Study
                  </p>
                  <p className="text-[11px] text-muted mt-2 max-w-md">
                    Rendered purely from non-jewellery vector calculations to demonstrate silver specular reflectivity without representing any physical jewellery piece.
                  </p>
                </div>
              )}
            </div>

            {/* Lightbox Footer & Pagination */}
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev !== null ? (prev - 1 + galleryPlates.length) % galleryPlates.length : 0
                    )
                  }
                  className="px-3 py-1.5 border border-line hover:border-green text-muted hover:text-ink transition-colors flex items-center space-x-1 rounded-[2px]"
                  aria-label="Previous plate"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV</span>
                </button>
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev !== null ? (prev + 1) % galleryPlates.length : 0
                    )
                  }
                  className="px-3 py-1.5 border border-line hover:border-green text-muted hover:text-ink transition-colors flex items-center space-x-1 rounded-[2px]"
                  aria-label="Next plate"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activePlate.productSlug && (
                <Link
                  href={`/product/${activePlate.productSlug}`}
                  className="px-5 py-1.5 bg-emerald hover:bg-forest text-white font-semibold transition-colors uppercase tracking-[0.14em] text-[11px] rounded-[2px]"
                >
                  View Product Page
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
