'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, MessageCircle, Lock, ArrowUpRight } from 'lucide-react';
import HalftoneOverlay from './HalftoneOverlay';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F2E20] border-t border-[rgba(191,195,199,0.2)] text-[#F6F5F0] pt-20 pb-8 relative overflow-hidden select-none">
      {/* Emerald silk glow + subtle Halftone */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(31,77,54,0.6)_0%,rgba(15,46,32,0.95)_60%,transparent_100%)]" />
      <HalftoneOverlay opacity={0.04} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-[6vw] relative z-10">
        {/* Brand Promise & Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-[rgba(246,245,240,0.12)]">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#163D2B] border border-[rgba(191,195,199,0.25)] text-[#A9BFAE] rounded-[2px]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.14em] font-mono text-[#F6F5F0] font-medium">
                BIS 925 Certified Silver
              </h4>
              <p className="text-xs font-sans text-[#DDE5DE] mt-1 leading-relaxed">
                Assayed, certified, and laser-inscribed with official 925 sterling silver purity hallmarks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#163D2B] border border-[rgba(191,195,199,0.25)] text-[#A9BFAE] rounded-[2px]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.14em] font-mono text-[#F6F5F0] font-medium">
                Artisanal Metallurgy
              </h4>
              <p className="text-xs font-sans text-[#DDE5DE] mt-1 leading-relaxed">
                Hand-forged and precision-beveled by Indian silversmiths using proprietary anti-tarnish rhodium shields.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#163D2B] border border-[rgba(191,195,199,0.25)] text-[#A9BFAE] rounded-[2px]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.14em] font-mono text-[#F6F5F0] font-medium">
                VIP WhatsApp Concierge
              </h4>
              <p className="text-xs font-sans text-[#DDE5DE] mt-1 leading-relaxed">
                Direct access to atelier curators for custom ring sizing, bespoke coordinate engravings, and assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-[rgba(246,245,240,0.12)] text-xs font-mono tracking-wider">
          {/* Col 1: Collections */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#A9BFAE] font-semibold">
              The Collection
            </h5>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/shop?category=rings" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Sovereign Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=pendants" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Liquid Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Solid Torques & Cuffs
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chains" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Byzantine & Cuban Chains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bespoke" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Bespoke Artefacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: The Atelier */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#A9BFAE] font-semibold">
              The Atelier
            </h5>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/about" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Brand Heritage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Exhibition Lookbook
                </Link>
              </li>
              <li>
                <Link href="/about#craft" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Craftsmanship & Care
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Track Consignment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Policies */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#A9BFAE] font-semibold">
              Client Service
            </h5>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/faq" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  FAQ & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Private Consultation
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Insured Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#returns" className="text-[#DDE5DE] hover:text-[#FFFFFF] transition-colors">
                  Returns & Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge & Direct */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.18em] text-[#A9BFAE] font-semibold">
              Atelier Direct
            </h5>
            <p className="text-[#DDE5DE] text-xs font-sans leading-relaxed">
              Available 10:00 — 20:00 IST for private consultation and bespoke seal commissions.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[#A9BFAE] hover:text-[#FFFFFF] font-medium uppercase tracking-wider text-[11px]"
              >
                <span>WhatsApp Concierge</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 text-[#DDE5DE]/60 hover:text-[#FFFFFF] text-[10px] tracking-widest uppercase transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Atelier Back Office</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enormous Cropped Silver-Gradient Wordmark Bleeding Off Bottom */}
        <div className="pt-16 -mb-6 text-center overflow-hidden">
          <div className="font-sans font-extrabold text-[15vw] leading-none tracking-[-0.03em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#F6F5F0]/25 via-[#BFC3C7]/15 to-transparent select-none pointer-events-none whitespace-nowrap">
            VINI VICI VIDI
          </div>
        </div>

        {/* Bottom Microcopy */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-[0.16em] text-[#DDE5DE]/70 uppercase space-y-3 sm:space-y-0">
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
