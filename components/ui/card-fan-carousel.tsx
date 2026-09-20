'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';

export interface CardFanItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price?: number;
  originalPrice?: number;
  link?: string;
  badge?: string;
  product?: Product;
}

interface CardFanCarouselProps {
  items: CardFanItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  onSelect?: (item: CardFanItem) => void;
}

export function CardFanCarousel({
  items,
  title,
  subtitle,
  className = '',
  onSelect,
}: CardFanCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = items.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Calculate fan transform offsets based on distance from active index & hover state
  const getCardTransform = (index: number) => {
    // Relative circular offset (-3 to +3)
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) {
      offset -= total;
    }

    const absOffset = Math.abs(offset);

    // Visible cards are within distance 3
    if (absOffset > 3) {
      return {
        x: 0,
        y: 80,
        rotate: 0,
        scale: 0.3,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    // Distance coefficients
    const sign = offset < 0 ? -1 : offset > 0 ? 1 : 0;

    // Mobile adjustments for tighter spread
    const xMultiplier = isMobile ? 4.5 : 8.25; // in rem
    const yMultiplier = isMobile ? 1.0 : 1.3;
    const rotateMultiplier = isMobile ? 6 : 7; // in degrees

    let x = 0;
    let y = 0;
    let rotate = 0;
    let scale = 1;
    let zIndex = 10;
    let opacity = 1;

    if (absOffset === 0) {
      x = 0;
      y = 0;
      rotate = 0;
      scale = 1;
      zIndex = 10;
    } else if (absOffset === 1) {
      x = sign * xMultiplier;
      y = 1 * yMultiplier * 16;
      rotate = sign * rotateMultiplier;
      scale = 0.935;
      zIndex = 4;
    } else if (absOffset === 2) {
      x = sign * (xMultiplier * 2.0);
      y = 3.2 * yMultiplier * 16;
      rotate = sign * (rotateMultiplier * 2);
      scale = 0.85;
      zIndex = 3;
    } else if (absOffset === 3) {
      x = sign * (xMultiplier * 2.75);
      y = 5.8 * yMultiplier * 16;
      rotate = sign * (rotateMultiplier * 3);
      scale = 0.775;
      zIndex = 2;
    }

    // DYNAMIC HOVER ENLARGEMENT IN MOTION
    const isHovered = hoveredIndex === index;
    const hasAnyHover = hoveredIndex !== null;

    if (isHovered) {
      // Significantly enlarge the hovered card and lift it toward the viewer
      scale = isMobile ? 1.08 : 1.20;
      y = y - (isMobile ? 16 : 32);
      rotate = rotate * 0.25; // Straighten perspective for clean readability
      zIndex = 50; // Pop above all other cards
      opacity = 1;
    } else if (hasAnyHover) {
      // Slightly dim and contract non-hovered cards to accentuate the hovered piece
      scale = scale * 0.94;
      opacity = 0.75;
    }

    return {
      x: `${x}rem`,
      y: `${y}px`,
      rotate,
      scale,
      opacity,
      zIndex,
      pointerEvents: 'auto' as const,
    };
  };

  if (!items.length) return null;

  const activeItem = items[hoveredIndex !== null ? hoveredIndex : activeIndex];

  return (
    <section className={`flex flex-col items-center w-full py-10 lg:py-16 px-4 md:px-8 relative z-20 overflow-hidden ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          {subtitle && (
            <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
              {title}
            </h2>
          )}
          <p className="text-[11px] font-sans uppercase tracking-widest text-silver/50 hidden md:block">
            Hover over any piece to inspect in high-definition elevation
          </p>
        </div>
      )}

      {/* Fan Layout Stage */}
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] h-[30rem] sm:h-[34rem] md:h-[38rem]">
          {items.map((item, idx) => {
            const transform = getCardTransform(idx);
            const isCenter = idx === activeIndex;
            const isHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={item.id}
                className={`fan-card absolute w-[13rem] h-[20rem] sm:w-[16rem] sm:h-[24rem] md:w-[18rem] md:h-[27rem] rounded-sm cursor-pointer select-none overflow-hidden bg-carbon transition-colors duration-300 ${
                  isHovered
                    ? 'border border-signature-green shadow-[0_12px_36px_rgba(11,26,18,0.7)]'
                    : 'border border-steel/60'
                }`}
                animate={{
                  x: transform.x,
                  y: transform.y,
                  rotate: transform.rotate,
                  scale: transform.scale,
                  opacity: transform.opacity,
                  zIndex: transform.zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 22,
                  mass: 0.7,
                }}
                style={{
                  zIndex: transform.zIndex,
                  pointerEvents: transform.pointerEvents,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(idx);
                  } else if (onSelect) {
                    onSelect(item);
                  }
                }}
              >
                <div className="relative w-full h-full overflow-hidden group">
                  {/* Background Image with subtle radial spotlight */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 ${
                      isHovered ? 'scale-105' : 'group-hover:scale-102'
                    }`}
                  />
                  <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.5)_95%)]" />

                  {/* High-Specular Flashlight Glint when Hovered */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-bright-silver/10 to-transparent z-15 pointer-events-none animate-shimmer" />
                  )}

                  {/* Gradient Lighting & Metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent z-20 flex flex-col justify-between p-5">
                    {/* Badge */}
                    <div className="flex justify-between items-start">
                      {item.badge ? (
                        <span className={`px-2.5 py-1 border text-[9px] font-sans uppercase tracking-monumental font-semibold backdrop-blur-md transition-colors ${
                          isHovered
                            ? 'bg-forest-deep text-ice-white border-signature-green'
                            : 'bg-graphite/90 text-silver border-steel/70'
                        }`}>
                          {item.badge}
                        </span>
                      ) : <span />}

                      <span className="text-[9px] font-mono text-silver/70 bg-void/80 px-2 py-0.5 border border-steel/40 backdrop-blur-sm">
                        0{idx + 1} / {total < 10 ? `0${total}` : total}
                      </span>
                    </div>

                    {/* Card Label Information */}
                    <div className="space-y-1 transform transition-transform duration-300">
                      {item.subtitle && (
                        <div className="text-[9px] font-sans uppercase tracking-widest text-bright-silver font-medium">
                          {item.subtitle}
                        </div>
                      )}
                      <h4 className="font-sans text-sm sm:text-base uppercase tracking-wider font-semibold text-ice-white line-clamp-1">
                        {item.title}
                      </h4>
                      {item.price && (
                        <div className="flex items-baseline space-x-2 pt-1 font-mono text-sm">
                          <span className="text-bright-silver font-semibold">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-chrome line-through">
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View CTA (Visible when hovered or active) */}
                      {(isHovered || isCenter) && item.link && (
                        <div className="pt-2">
                          <Link
                            href={item.link}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center space-x-1.5 text-[10px] font-sans uppercase tracking-widest text-bright-silver hover:text-white underline decoration-steel underline-offset-4"
                          >
                            <span>Inspect Piece</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls & Circular Pagination Dots */}
      <div className="flex items-center justify-center gap-5 mt-6 md:mt-8 z-30">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="relative flex items-center justify-center rounded-full gothic-btn-secondary bg-carbon/90 hover:border-moss text-silver hover:text-ice-white cursor-pointer shrink-0 z-30 outline-none active:opacity-70 transition-all duration-300 w-11 h-11 md:w-12 md:h-12"
        >
          <ChevronLeft className="w-5 h-5 relative z-10" />
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2 max-w-xs overflow-x-auto py-2">
          {items.map((_, idx) => {
            const isActive = idx === activeIndex;
            const isHover = idx === hoveredIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isHover
                    ? 'w-6 h-1.5 bg-ice-white shadow-[0_0_8px_rgba(108,143,114,0.7)]'
                    : isActive
                    ? 'w-6 h-1.5 bg-signature-green shadow-[0_0_8px_rgba(108,143,114,0.5)]'
                    : 'w-1.5 h-1.5 bg-steel/60 hover:bg-silver/60'
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="relative flex items-center justify-center rounded-full gothic-btn-secondary bg-carbon/90 hover:border-moss text-silver hover:text-ice-white cursor-pointer shrink-0 z-30 outline-none active:opacity-70 transition-all duration-300 w-11 h-11 md:w-12 md:h-12"
        >
          <ChevronRight className="w-5 h-5 relative z-10" />
        </button>
      </div>

      {/* Active selection footer */}
      {activeItem && (
        <div className="mt-4 text-center">
          <span className="text-[11px] font-sans uppercase tracking-widest text-silver/60">
            Selected Piece: <strong className="text-ice-white">{activeItem.title}</strong>
          </span>
        </div>
      )}
    </section>
  );
}

export default CardFanCarousel;
