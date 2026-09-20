'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const { openCart, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collection', href: '/shop' },
    { label: 'Rings', href: '/shop?category=rings' },
    { label: 'Pendants', href: '/shop?category=pendants' },
    { label: 'Bespoke', href: '/shop?category=bespoke' },
    { label: 'The Atelier', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Track Order', href: '/track' },
  ];

  return (
    <>
      {/* 32px Slim Announcement Bar */}
      <div className="w-full h-[32px] bg-bg border-b border-line text-muted font-mono text-[10px] tracking-[0.14em] uppercase px-4 flex items-center justify-center overflow-hidden relative z-50">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          <span className="text-text flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green inline-block animate-pulse" />
            50% CELEBRATION OFFER ON ALL SIGNATURE PIECES
          </span>
          <span className="hidden md:inline text-line-strong">•</span>
          <span className="hidden sm:inline text-muted">COMPLIMENTARY INSURED COURIER ACROSS INDIA</span>
          <span className="hidden md:inline text-line-strong">•</span>
          <span className="text-muted flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-green inline-block" />
            BIS 925 HALLMARK CERTIFIED
          </span>
        </div>
      </div>

      {/* Main Header (Single row, exactly 72px tall) */}
      <header
        className={`fixed top-[32px] inset-x-0 z-40 h-[72px] transition-all duration-300 ${
          scrolled
            ? 'bg-bg/85 backdrop-blur-md border-b border-line shadow-2xl'
            : 'bg-transparent border-b border-line/40'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 flex items-center justify-between">
          {/* Left: Monogram + Small Wordmark */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 text-muted hover:text-text lg:hidden transition-colors mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center space-x-3 group">
              <span className="w-7 h-7 rounded-sm border border-line bg-surface flex items-center justify-center text-[10px] font-mono tracking-tighter text-text font-bold group-hover:border-green transition-colors">
                VVV
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-text group-hover:text-white transition-colors">
                  Vini Vici Vidi
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-muted">
                  Silver Collection
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Frosted Glass Pill with unwrapped links */}
          <nav className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full border border-line bg-surface/70 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted hover:text-text hover:bg-white/[0.04] rounded-full transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Cart (clean, zero stray bars) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="p-2 text-muted hover:text-text rounded-full hover:bg-surface/80 border border-transparent hover:border-line transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-line bg-surface/80 hover:border-green hover:text-white text-text transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-muted" />
              <span className="text-[10px] font-mono font-medium">({itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-void/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-graphite border-r border-steel/60 p-8 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-steel/40">
                <span className="font-display text-lg tracking-widest text-ice-white">
                  VINI VICI VIDI
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-silver hover:text-ice-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-sans uppercase tracking-super-wide text-silver hover:text-ice-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-sans uppercase tracking-super-wide text-silver hover:text-ice-white transition-colors"
                >
                  FAQ & Care
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-sans uppercase tracking-super-wide text-silver hover:text-ice-white transition-colors"
                >
                  Contact Concierge
                </Link>
                <Link
                  href="/policies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-sans uppercase tracking-super-wide text-silver hover:text-ice-white transition-colors"
                >
                  Store Policies
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-steel/40">
              <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-widest text-brand-green">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>925 Certified Sterling Silver</span>
              </div>
              <p className="text-[10px] text-chrome mt-2">
                India Express Insured Delivery • Guest Checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instant Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div
            className="fixed inset-0 bg-void/90 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-carbon border border-steel/70 p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-steel/50">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-5 h-5 text-bright-silver" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search rings, pendants, heavy chains, bespoke signets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="w-full bg-transparent text-ice-white placeholder-silver/50 focus:outline-none text-base tracking-wider font-sans"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-silver hover:text-ice-white ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-silver/60 uppercase tracking-wider font-sans">
              <span>Press Enter to search entire catalogue</span>
              <button
                onClick={() => {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                }}
                className="text-bright-silver hover:underline"
              >
                View Results →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
