'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Product } from '@/lib/types';
import { initialProducts } from '@/lib/data/initialProducts';
import { useCart } from '@/lib/context/CartContext';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('US 9 (Standard)');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'craft' | 'shipping' | 'care'>('craft');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Look up in static cache first
    const found =
      initialProducts.find((p) => p.slug === idOrSlug || p.id === idOrSlug) || null;
    if (found) {
      setProduct(found);
      const related = initialProducts
        .filter((p) => p.category === found.category && p.id !== found.id)
        .slice(0, 4);
      setRelatedProducts(related.length ? related : initialProducts.slice(0, 4));
    }

    // Then revalidate with API for live price & stock
    fetch(`/api/products/${idOrSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImageIndex(0);
        }
      })
      .catch((err) => console.warn('Product fetch error:', err));
  }, [idOrSlug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center text-ice-white space-y-4">
        <span className="font-display text-4xl text-silver/40">VVV</span>
        <p className="font-editorial italic text-2xl text-silver">
          Locating archival specimen...
        </p>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  const ringSizes = ['US 7', 'US 8', 'US 9 (Standard)', 'US 10', 'US 11', 'US 12', 'Custom Engraved Size'];

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello VINI VICI VIDI, I would like to enquire about the ${product.name} (SKU: ${product.sku}). Current price ₹${product.price}. Could you assist me?`
  )}`;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push('/checkout');
  };

  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-6 border-b border-steel/30 flex items-center justify-between text-[10px] font-sans uppercase tracking-monumental text-silver/60">
        <Link href="/shop" className="inline-flex items-center space-x-2 hover:text-ice-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>
        <div>
          <span>{product.category} / {product.sku}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Main Image Container */}
            <div className="relative aspect-[4/5] w-full bg-carbon border border-steel/60 overflow-hidden shadow-2xl group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-crosshair"
              />

              {/* Status Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                {product.isFiftyPercentOffer && (
                  <span className="px-3 py-1 bg-graphite/90 border border-steel/80 text-[10px] font-sans uppercase tracking-monumental text-ice-white font-semibold backdrop-blur-md">
                    50% Celebration Offer
                  </span>
                )}
                {isLowStock && (
                  <span className="px-3 py-1 bg-graphite/90 border border-amber-500/50 text-[10px] font-sans uppercase tracking-widest text-amber-300 font-semibold backdrop-blur-md animate-pulse">
                    ONLY {product.stock} PIECES REMAINING
                  </span>
                )}
                {isOutOfStock && (
                  <span className="px-3 py-1 bg-graphite/90 border border-red-500/50 text-[10px] font-sans uppercase tracking-widest text-red-400 font-semibold backdrop-blur-md">
                    VAULT ARCHIVED
                  </span>
                )}
              </div>

              {/* Hallmark Certification Watermark */}
              <div className="absolute bottom-4 right-4 text-[9px] font-sans uppercase tracking-widest text-silver/60 bg-graphite/80 px-2.5 py-1 border border-steel/40">
                BIS 925 Laser Verified
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center space-x-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 bg-carbon border overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? 'border-bright-silver shadow-lg scale-95'
                        : 'border-steel/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Product Information & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
                {product.sku} • {product.specifications.material}
              </div>

              <h1 className="mt-2 font-display text-3xl sm:text-4xl uppercase tracking-wider text-ice-white font-normal leading-tight">
                {product.name}
              </h1>

              <p className="mt-2 font-editorial italic text-base sm:text-lg text-silver/80">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-carbon border border-steel/50 space-y-2">
              <div className="flex items-baseline space-x-4">
                <span className="font-mono text-3xl font-semibold text-ice-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="font-mono text-base text-chrome line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-brand-green font-semibold">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} (50%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] font-sans uppercase tracking-wider text-silver/60">
                Inclusive of all taxes • Free Insured Courier Across India
              </p>
            </div>

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-silver/85 leading-relaxed tracking-wide">
              {product.description}
            </p>

            {/* Ring Size Selection (If Ring) */}
            {product.category === 'rings' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-silver">
                  <span>Select Finger Sizing</span>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-bright-silver hover:underline tracking-widest"
                  >
                    Size Guide / WhatsApp Help
                  </a>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-2 text-[10px] font-sans uppercase tracking-wider border text-center transition-all ${
                        selectedSize === size
                          ? 'bg-bright-silver text-void border-bright-silver font-semibold'
                          : 'bg-carbon text-silver border-steel/50 hover:border-silver/60'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Commerce Actions: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-carbon hover:bg-steel/40 border border-steel/80 hover:border-bright-silver text-ice-white text-xs uppercase font-sans tracking-monumental font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add To Vault Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-bright-silver hover:bg-white text-void text-xs uppercase font-sans tracking-monumental font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl disabled:opacity-30"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Guest Checkout</span>
                </button>
              </div>

              {/* Direct WhatsApp Concierge CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-graphite border border-brand-green/40 hover:border-brand-green text-brand-green text-xs uppercase font-sans tracking-super-wide transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask About This Piece on WhatsApp</span>
              </a>
            </div>

            {/* Trust & Guarantee Box */}
            <div className="pt-6 border-t border-steel/40 space-y-3 text-xs font-sans text-silver/80">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-bright-silver flex-shrink-0" />
                <span>BIS 925 Hallmarked Certified Sterling Silver</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-4 h-4 text-bright-silver flex-shrink-0" />
                <span>Complimentary Insured Courier Dispatch Across India (2–4 Days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-4 h-4 text-bright-silver flex-shrink-0" />
                <span>7-Day Hassle-Free Return & Exchange Policy</span>
              </div>
            </div>

            {/* Collapsible Accordions: Craft / Specs / Care */}
            <div className="pt-6 border-t border-steel/40 space-y-4">
              <div className="border border-steel/40 bg-carbon">
                <div className="flex border-b border-steel/40 text-xs uppercase tracking-wider font-sans">
                  <button
                    onClick={() => setActiveTab('craft')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'craft' ? 'bg-graphite text-ice-white font-semibold' : 'text-silver hover:text-ice-white'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'shipping' ? 'bg-graphite text-ice-white font-semibold' : 'text-silver hover:text-ice-white'
                    }`}
                  >
                    Dispatch & Transit
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'care' ? 'bg-graphite text-ice-white font-semibold' : 'text-silver hover:text-ice-white'
                    }`}
                  >
                    Silver Care
                  </button>
                </div>

                <div className="p-5 text-xs font-sans text-silver/80 leading-relaxed space-y-2">
                  {activeTab === 'craft' && (
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-steel/20">
                        <span className="text-silver/50 uppercase">Purity</span>
                        <span className="text-ice-white font-medium">{product.specifications.purity}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-steel/20">
                        <span className="text-silver/50 uppercase">Weight</span>
                        <span className="text-ice-white font-medium">{product.specifications.weight}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-steel/20">
                        <span className="text-silver/50 uppercase">Finish</span>
                        <span className="text-ice-white font-medium">{product.specifications.finish}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-steel/20">
                        <span className="text-silver/50 uppercase">Hallmark</span>
                        <span className="text-ice-white font-medium">{product.specifications.hallmark}</span>
                      </div>
                      {product.specifications.dimensions && (
                        <div className="flex justify-between py-1 border-b border-steel/20">
                          <span className="text-silver/50 uppercase">Dimensions</span>
                          <span className="text-ice-white font-medium">{product.specifications.dimensions}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2">
                      <p>
                        Dispatched in tamper-proof security vaults via BlueDart or Sequel Logistics with 100% transit insurance.
                      </p>
                      <p>
                        Tracking number and real-time shipment updates transmitted via WhatsApp & SMS upon handoff.
                      </p>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <div className="space-y-2">
                      <p>
                        Protected with an electrolytic rhodium anti-tarnish barrier. Clean with the provided micro-suede cloth.
                      </p>
                      <p>
                        Avoid contact with harsh pool chlorine and industrial solvents. Store in the VINI VICI VIDI obsidian vault.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Editorial Related Products */}
        <div className="mt-32 pt-16 border-t border-steel/40">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-1">
                Atelier Recommendations
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ice-white">
                Harmonious Pairings
              </h2>
            </div>
            <Link href="/shop" className="text-xs uppercase tracking-super-wide text-bright-silver hover:underline">
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
