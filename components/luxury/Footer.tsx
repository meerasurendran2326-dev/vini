'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, MessageCircle, Lock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-void/85 border-t border-steel/60 text-ice-white pt-20 pb-12 relative overflow-hidden select-none">
      {/* Ambient background glow: green-tinted dark gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(11,26,18,0.85)_0%,rgba(18,38,27,0.45)_45%,transparent_85%)]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        {/* Brand Promise & Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-steel/40">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-carbon border border-steel/50 text-bright-silver">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-super-wide font-sans text-ice-white font-medium">
                BIS 925 Certified Silver
              </h4>
              <p className="text-xs font-sans text-silver/70 mt-1 leading-relaxed">
                Every piece is assayed, certified, and laser-inscribed with official 925 sterling silver purity hallmarks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-carbon border border-steel/50 text-bright-silver">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-super-wide font-sans text-ice-white font-medium">
                Artisanal Metallurgy
              </h4>
              <p className="text-xs font-sans text-silver/70 mt-1 leading-relaxed">
                Hand-forged and precision-beveled by generational Indian silversmiths using proprietary anti-tarnish rhodium shields.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-carbon border border-steel/50 text-bright-silver">
              <MessageCircle className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-super-wide font-sans text-ice-white font-medium">
                VIP WhatsApp Concierge
              </h4>
              <p className="text-xs font-sans text-silver/70 mt-1 leading-relaxed">
                Direct access to our atelier curators for custom ring sizing, bespoke coordinate engravings, and immediate assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-steel/40 text-xs font-sans tracking-wider">
          {/* Col 1: Collections */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-monumental text-silver/50 font-semibold">
              The Collection
            </h5>
            <ul className="space-y-3">
              <li>
                <Link href="/shop?category=rings" className="text-silver hover:text-ice-white transition-colors">
                  Sovereign Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pendants" className="text-silver hover:text-ice-white transition-colors">
                  Liquid Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-silver hover:text-ice-white transition-colors">
                  Solid Torques & Cuffs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chains" className="text-silver hover:text-ice-white transition-colors">
                  Byzantine & Cuban Chains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bespoke" className="text-silver hover:text-ice-white transition-colors">
                  Bespoke Artefacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: The Atelier */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-monumental text-silver/50 font-semibold">
              The Atelier
            </h5>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-silver hover:text-ice-white transition-colors">
                  Brand Heritage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-silver hover:text-ice-white transition-colors">
                  Exhibition Lookbook
                </Link>
              </li>
              <li>
                <Link href="/about#craft" className="text-silver hover:text-ice-white transition-colors">
                  Craftsmanship & Care
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-silver hover:text-ice-white transition-colors">
                  Track Consignment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Policies */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-monumental text-silver/50 font-semibold">
              Client Service
            </h5>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-silver hover:text-ice-white transition-colors">
                  FAQ & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-silver hover:text-ice-white transition-colors">
                  Private Consultation
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-silver hover:text-ice-white transition-colors">
                  Insured Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#returns" className="text-silver hover:text-ice-white transition-colors">
                  Returns & Guarantee
                </Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="text-silver hover:text-ice-white transition-colors">
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge & Direct */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-monumental text-silver/50 font-semibold">
              Atelier Direct
            </h5>
            <p className="text-silver/70 text-xs leading-relaxed">
              Available 10:00 — 20:00 IST for private consultation and bespoke seal commissions.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-brand-green hover:text-brand-green-light font-medium uppercase tracking-wider"
              >
                <span>WhatsApp Concierge</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 text-steel hover:text-silver text-[11px] tracking-widest uppercase transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Atelier Back Office</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Monolithic Display Typography over green-tinted dark gradient */}
        <div className="pt-12 text-center overflow-hidden">
          <div className="font-display text-[12vw] leading-none tracking-[0.2em] font-light text-transparent bg-clip-text bg-gradient-to-b from-moss/25 via-emerald-shadow/35 to-void select-none pointer-events-none">
            VINI VICI VIDI
          </div>
        </div>

        {/* Bottom Microcopy */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans tracking-super-wide text-silver/50 uppercase space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} VINI VICI VIDI. ALL RIGHTS RESERVED.
          </div>
          <div>
            PREMIUM 925 STERLING SILVER SHOWROOM • INDIA
          </div>
        </div>
      </div>
    </footer>
  );
}
