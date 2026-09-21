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
    <div className="group relative flex flex-col bg-white border border-line hover:border-green transition-all duration-500 overflow-hidden rounded-[2px] shadow-[0_4px_20px_rgba(15,46,32,0.04)] hover:shadow-[0_12px_30px_rgba(15,46,32,0.08)]">
      {/* Visual Asset Container */}
      <div className="relative w-full aspect-[4/5] bg-pearl overflow-hidden">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5 items-start">
          {product.isFiftyPercentOffer && (
            <span className="px-2.5 py-1 bg-emerald text-[9px] font-mono uppercase tracking-[0.14em] text-white font-semibold shadow-sm">
              50% OFFER
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-1 bg-pearl/90 border border-green/40 text-[9px] font-mono uppercase tracking-widest text-emerald font-semibold backdrop-blur-sm shadow-sm">
              ONLY {product.stock} LEFT
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-mist/90 border border-line text-[9px] font-mono uppercase tracking-widest text-muted font-semibold backdrop-blur-sm">
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
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white/95 via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-20">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="flex-1 py-2.5 px-3 bg-emerald hover:bg-forest text-white text-[10px] uppercase font-mono tracking-[0.14em] font-semibold flex items-center justify-center space-x-2 disabled:opacity-40 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Quick Add'}</span>
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="ml-2 p-2.5 bg-white border border-line text-ink hover:text-emerald hover:border-green transition-colors shadow-sm"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2.5 bg-white border border-line text-emerald hover:border-green transition-colors shadow-sm"
            aria-label="Ask on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Editorial Object Label Information */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Micro-label: SKU & Material */}
          <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.14em] uppercase text-muted">
            <span>{product.sku}</span>
            <span>{product.specifications.purity} STERLING</span>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-sm font-sans tracking-wider uppercase text-ink font-medium line-clamp-1 group-hover:text-emerald transition-colors">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Subtitle / Tagline */}
          <p className="mt-1 text-[11px] font-editorial italic text-muted line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Pricing & Stock State */}
        <div className="mt-4 pt-3 border-t border-line flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-sm font-semibold text-ink">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-mono text-xs text-muted line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted">
            {product.specifications.weight}
          </span>
        </div>
      </div>
    </div>
  );
}
