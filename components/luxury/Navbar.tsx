'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
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

  const isHome = pathname === '/';

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
            ? 'bg-[#F4F4F0]/90 backdrop-blur-md border-b border-[rgba(15,46,32,0.12)] shadow-[0_4px_24px_rgba(15,46,32,0.06)]'
            : isHome
            ? 'bg-transparent border-b border-[rgba(15,46,32,0.08)]'
            : 'bg-[#F4F4F0] border-b border-[rgba(15,46,32,0.08)]'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-[6vw] flex items-center justify-between">
          
          {/* SLIM REFERENCE NAV LAYOUT FOR HOME & ALL PAGES */}
          {/* Left: Est. 2026 or Brand Mark */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 text-ink hover:text-emerald lg:hidden transition-colors mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-xs font-sans tracking-widest text-[#0F2A1F] font-semibold uppercase">
                Est. 2026
              </span>
              <span className="text-[10px] font-mono text-[#0F2A1F]/40 hidden sm:inline">•</span>
              <span className="text-xs font-sans tracking-widest text-[#0F2A1F]/70 hidden sm:inline uppercase">
                Vini Vici Vidi
              </span>
            </Link>
          </div>

          {/* Center: Clean links, small sans-serif, no pill borders */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-sans tracking-wide text-[#0F2A1F]/80">
            <Link href="/shop" className="hover:text-[#0F2A1F] transition-colors">
              Collection
            </Link>
            <Link href="/about" className="hover:text-[#0F2A1F] transition-colors">
              About
            </Link>
            <Link href="/gallery" className="hover:text-[#0F2A1F] transition-colors">
              Lookbook
            </Link>
            <Link href="/contact" className="hover:text-[#0F2A1F] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right: Search & Cart (0) (clean sans-serif, no pill borders) */}
          <div className="flex items-center space-x-6 text-xs font-sans tracking-wide">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="flex items-center space-x-1.5 text-[#0F2A1F]/80 hover:text-[#0F2A1F] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="flex items-center space-x-1.5 text-[#0F2A1F] font-semibold hover:opacity-75 transition-opacity"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-forest/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#F4F4F0] border border-line p-6 shadow-2xl rounded-[2px]">
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
                className="flex-1 px-4 py-2.5 bg-white border border-line text-ink placeholder:text-sage text-xs font-sans focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
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
          <div className="relative w-4/5 max-w-sm bg-[#F4F4F0] border-r border-line p-8 flex flex-col justify-between z-10 shadow-2xl">
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
                    className="text-xs font-sans uppercase tracking-widest text-ink hover:text-emerald py-1 border-b border-line/40 transition-colors"
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
