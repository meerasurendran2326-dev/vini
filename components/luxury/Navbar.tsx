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
      {/* Top Promotional Metallic Marquee */}
      <div className="w-full gothic-offer-strip text-silver/90 text-[10px] sm:text-[11px] font-sans tracking-widest uppercase py-2 px-4 text-center overflow-hidden relative">
        <div className="flex items-center justify-center space-x-6 font-medium">
          <span className="text-bright-silver flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-signature-green inline-block animate-pulse" />
            50% CELEBRATION OFFER ON ALL SIGNATURE PIECES
          </span>
          <span className="hidden sm:inline text-silver/70">• COMPLIMENTARY INSURED COURIER ACROSS INDIA •</span>
          <span className="text-silver/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-signature-green inline-block" />
            BIS 925 HALLMARK CERTIFIED
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-[33px] inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-void/90 backdrop-blur-md border-b border-steel/40 py-4 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-1 text-ice-white hover:text-bright-silver transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-super-wide font-sans text-silver/80">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-ice-white transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-bright-silver transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Centered Brand Title */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.25em] text-ice-white font-normal uppercase block transition-colors group-hover:text-bright-silver">
                VINI VICI VIDI
              </span>
              <span className="block text-[8px] sm:text-[9px] font-sans tracking-monumental text-silver/60 uppercase mt-0.5">
                Silver Collection
              </span>
            </Link>
          </div>

          {/* Right Navigation & Commerce Controls */}
          <div className="flex items-center space-x-6 sm:space-x-8 text-xs uppercase tracking-super-wide font-sans text-silver/80">
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-ice-white transition-colors duration-200 relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-bright-silver transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Live Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="hover:text-ice-white transition-colors p-1"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative p-1 text-ice-white hover:text-bright-silver transition-colors flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[11px] font-mono font-medium">
                ({itemCount})
              </span>
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
