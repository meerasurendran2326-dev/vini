'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello VINI VICI VIDI, I am inquiring about the ${product.name} (SKU: ${product.sku}). Is this piece currently available?`
  )}`;

  return (
    <div className="group relative flex flex-col bg-carbon border border-steel/60 hover:border-moss transition-all duration-500 overflow-hidden">
      {/* Visual Asset Container */}
      <div className="relative w-full aspect-[4/5] bg-void overflow-hidden">
        {/* Dark Vignette Behind & Over Frame */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,5,0.45)_95%)]" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5 items-start">
          {product.isFiftyPercentOffer && (
            <span className="px-2.5 py-1 bg-graphite/90 border border-steel/80 text-[9px] font-sans uppercase tracking-monumental text-ice-white font-semibold backdrop-blur-sm">
              50% OFFER
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-1 gothic-badge-lowstock text-[9px] font-sans uppercase tracking-widest font-semibold backdrop-blur-sm">
              ONLY {product.stock} LEFT
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-graphite/90 border border-red-500/40 text-[9px] font-sans uppercase tracking-widest text-red-400 font-semibold backdrop-blur-sm">
              RESERVED / ARCHIVED
            </span>
          )}
        </div>

        {/* Product Image with Hover Zoom */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || '/images/products/pdt-1.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Quick Actions Hover Drawer */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-void via-void/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-20">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="flex-1 py-2.5 px-3 gothic-btn-primary text-[10px] uppercase font-sans tracking-super-wide font-semibold flex items-center justify-center space-x-2 disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Quick Add'}</span>
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="ml-2 p-2.5 gothic-btn-secondary text-silver hover:text-ice-white transition-colors"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2.5 bg-carbon border border-steel/70 text-signature-green hover:text-green-glow transition-colors"
            aria-label="Ask on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Editorial Object Label Information */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-carbon">
        <div>
          {/* Micro-label: SKU & Material */}
          <div className="flex items-center justify-between text-[9px] font-sans tracking-monumental uppercase text-silver/60">
            <span>{product.sku}</span>
            <span>{product.specifications.purity} STERLING</span>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-sm font-sans tracking-wider uppercase text-ice-white font-medium line-clamp-1 group-hover:text-bright-silver transition-colors">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Subtitle / Tagline */}
          <p className="mt-1 text-[11px] font-editorial italic text-silver/70 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Pricing & Stock State */}
        <div className="mt-4 pt-3 border-t border-steel/30 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-sm font-semibold text-ice-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-mono text-xs text-chrome line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[9px] font-sans uppercase tracking-widest text-silver/50">
            {product.specifications.weight}
          </span>
        </div>
      </div>
    </div>
  );
}
