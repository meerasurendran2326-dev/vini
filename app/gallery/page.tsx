'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const [selectedImg, setSelectedImg] = useState<{ src: string; caption: string; title: string } | null>(null);

  const lookbookItems = [
    { src: '/images/inspo/inspo-1.jpeg', title: 'The Forging Vault', caption: 'Atmospheric light across molten 925 alloy' },
    { src: '/images/inspo/inspo-2.jpeg', title: 'Architectural Shadow', caption: 'High-contrast editorial serif framing solid silver' },
    { src: '/images/inspo/inspo-3.jpeg', title: 'Liquid Chrome Horizon', caption: 'Reflective sculptural chrome surfaces' },
    { src: '/images/inspo/inspo-4.jpeg', title: 'Generational Chisel', caption: 'Hand carving of signet seals and deep intaglio' },
    { src: '/images/inspo/inspo-5.jpeg', title: 'Specular Glint', caption: 'Controlled showroom spotlights revealing metallic grain' },
    { src: '/images/inspo/inspo-6.jpeg', title: 'Brutalist Form', caption: 'Heavy monolithic silhouettes forged in India' },
    { src: '/images/inspo/inspo-7.jpeg', title: 'Velvet Darkness', caption: 'Black titanium void framing precious white metal' },
    { src: '/images/inspo/inspo-8.jpeg', title: 'Heirloom Ingot', caption: 'Solid investment assay stamps and serial seals' },
    { src: '/images/products/pdt-1.jpeg', title: 'Aethelgard Signet', caption: 'Hand-carved sovereign ring in 925 fine silver' },
    { src: '/images/products/pdt-2.jpeg', title: 'Argent L\'Ombre', caption: 'Fluid liquid metal pendant suspended in space' },
    { src: '/images/products/pdt-3.jpeg', title: 'Vesper Torque', caption: 'Solid terminal finial heavy bracelet' },
    { src: '/images/products/pdt-4.jpeg', title: 'Byzantine Weave', caption: 'Eight hundred interlocking four-in-one links' },
  ];

  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            Visual World & Atmosphere
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-ice-white font-normal">
            Exhibition Lookbook
          </h1>
          <p className="mt-3 font-editorial italic text-lg sm:text-xl text-silver/80 max-w-2xl">
            A photographic study in cold reflection, deep shadow, and tactile metallic permanence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        {/* Masonry / Asymmetric Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lookbookItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImg(item)}
              className="group relative bg-carbon border border-steel/50 overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:border-bright-silver/60"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-void">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Caption Overlay */}
              <div className="p-5 bg-carbon flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-monumental text-silver/60">
                  <span>Plate {idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                  <span className="text-bright-silver group-hover:underline">Inspect Lightbox ↗</span>
                </div>
                <h3 className="font-display text-lg uppercase tracking-wider text-ice-white mt-1">
                  {item.title}
                </h3>
                <p className="font-editorial italic text-xs text-silver/70 mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 p-10 bg-graphite border border-steel/60 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-display text-2xl uppercase tracking-wider text-ice-white">
            Transform Art Direction Into Personal Possession
          </h3>
          <p className="text-xs font-sans text-silver/80 max-w-md mx-auto">
            All pieces featured in this photographic study are available in limited studio quantities.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-super-wide font-semibold transition-colors"
            >
              <span>Explore The Full Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div
            className="fixed inset-0 bg-void/95 backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          />
          <div className="relative max-w-4xl max-h-[90vh] bg-graphite border border-steel/80 p-6 z-10 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-steel/40">
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-ice-white">
                  {selectedImg.title}
                </h3>
                <p className="text-xs font-editorial italic text-silver/70">
                  {selectedImg.caption}
                </p>
              </div>
              <button
                onClick={() => setSelectedImg(null)}
                className="p-2 text-silver hover:text-ice-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden mt-4 flex items-center justify-center">
              <img
                src={selectedImg.src}
                alt={selectedImg.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
