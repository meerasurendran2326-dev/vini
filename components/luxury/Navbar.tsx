'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const { openCart, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
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
      {/* 32px Deep-Emerald Announcement Bar */}
      <div className="w-full h-[32px] bg-[#0F2E20] border-b border-[#1F4D36] text-[#FFFFFF] font-mono text-[10px] tracking-[0.16em] uppercase px-4 flex items-center justify-center overflow-hidden fixed top-0 inset-x-0 z-50 select-none">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FB89A] inline-block animate-pulse" />
            50% CELEBRATION OFFER ON ALL SIGNATURE PIECES
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden sm:inline text-white/80">COMPLIMENTARY INSURED COURIER ACROSS INDIA</span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="text-white/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FB89A] inline-block" />
            BIS 925 HALLMARK CERTIFIED
          </span>
        </div>
      </div>

      {/* Main Header (Exactly 76px tall row) */}
      <header
        className={`fixed top-[32px] inset-x-0 z-40 h-[76px] transition-all duration-300 ${
          scrolled
            ? 'bg-[#F6F5F0]/90 backdrop-blur-md border-b border-[rgba(15,46,32,0.12)] shadow-[0_4px_24px_rgba(15,46,32,0.06)]'
            : 'bg-transparent border-b border-[rgba(15,46,32,0.08)]'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-[6vw] flex items-center justify-between">
          {/* Left: Monogram + Wordmark */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 text-ink hover:text-emerald lg:hidden transition-colors mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center space-x-3 group">
              <span className="w-8 h-8 rounded-[2px] border border-line bg-pearl flex items-center justify-center text-[11px] font-mono tracking-tighter text-ink font-bold group-hover:border-green group-hover:text-emerald transition-colors shadow-sm">
                VVV
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink group-hover:text-emerald transition-colors">
                  Vini Vici Vidi
                </span>
                <span className="text-[8px] font-mono uppercase tracking-widest text-sage">
                  Silver Collection
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Frosted White Pill with unwrapped links */}
          <nav className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full border border-line bg-white/85 backdrop-blur-md shadow-[0_2px_12px_rgba(15,46,32,0.05)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-ink/75 hover:text-emerald hover:bg-green/10 rounded-full transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Cart */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="p-2 text-ink/70 hover:text-emerald rounded-full hover:bg-white border border-transparent hover:border-line transition-all shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-line bg-white hover:border-green text-ink hover:text-emerald transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-green" />
              <span className="text-[11px] font-mono font-semibold text-emerald">({itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-forest/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-line p-6 shadow-2xl rounded-[2px]">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">
                Search Silver Archive
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-sage hover:text-ink transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="mt-4 flex items-center space-x-3"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, pendants, byzantine chains..."
                className="flex-1 px-4 py-2.5 bg-pearl border border-line text-ink placeholder:text-sage text-xs font-mono rounded-[2px] focus:outline-none focus:border-green"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-[2px] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-forest/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-ivory border-r border-line p-8 flex flex-col justify-between z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-line">
                <span className="font-sans text-sm font-semibold uppercase tracking-widest text-ink">
                  VINI VICI VIDI
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-sage hover:text-ink"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-mono uppercase tracking-widest text-ink hover:text-emerald py-1 border-b border-line/40 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="pt-8 border-t border-line text-[10px] font-mono text-sage uppercase">
              Pure 92.5% Sterling Metallurgy • India
            </div>
          </div>
        </div>
      )}
    </>
  );
}
