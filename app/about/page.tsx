import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Header Banner */}
      <div className="pt-16 pb-20 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
            The Atelier & Heritage
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-ice-white font-normal">
            The VINI VICI VIDI Manifesto
          </h1>
          <p className="font-editorial italic text-xl sm:text-2xl text-silver/80 max-w-2xl mx-auto">
            "We do not create delicate ornaments to be tucked away. We forge heavy, architectural silver designed to confront time."
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 space-y-24">
        {/* Section 1: Forging Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/5] bg-carbon border border-steel/60 overflow-hidden shadow-2xl">
            <img
              src="/images/products/pdt-6.jpeg"
              alt="Atelier Craft - Hand Carved Solid 925 Silver"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
              01 • Origin
            </span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ice-white">
              Metallurgy Over Marketplace
            </h2>
            <p className="font-sans text-xs sm:text-sm text-silver/80 leading-relaxed">
              Born from a refusal of modern jewellery shortcuts. While contemporary commercial stores compromise on weight, hollow out signets, and use micro-thin plating, VINI VICI VIDI exists as an architectural atelier.
            </p>
            <p className="font-sans text-xs sm:text-sm text-silver/80 leading-relaxed">
              Every ring, pendant, and torque is cast with authoritative physical density. When you hold our solid 925 sterling pieces in hand, their weight conveys permanent, generational value.
            </p>
          </div>
        </div>

        {/* Section 2: Purity & Assay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 lg:order-1 order-2">
            <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
              02 • Pure Composition
            </span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ice-white">
              The 925 Hallmark Standard
            </h2>
            <p className="font-sans text-xs sm:text-sm text-silver/80 leading-relaxed">
              Pure fine silver is inherently soft. To endow our pieces with architectural fortitude, we alloy fine grain silver to precisely 92.5% purity using deoxidized, hypoallergenic copper and zinc. Zero nickel. Zero toxic binders.
            </p>
            <p className="font-sans text-xs sm:text-sm text-silver/80 leading-relaxed">
              Finished with an electrolytic liquid-chrome rhodium shield, our silver resists atmospheric tarnish while maintaining its cold, luminous specular brilliance.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-super-wide text-bright-silver hover:underline"
              >
                <span>Browse The Silver Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/5] bg-carbon border border-steel/60 overflow-hidden shadow-2xl lg:order-2 order-1">
            <img
              src="/images/products/pdt-9.jpeg"
              alt="Assay and Purity - Solid 925 Sterling Silver"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
