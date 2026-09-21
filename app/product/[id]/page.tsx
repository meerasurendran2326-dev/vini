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
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-ink space-y-4">
        <span className="font-sans font-bold text-4xl text-emerald/40">VVV</span>
        <p className="font-editorial italic text-2xl text-muted">
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
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-6 border-b border-line flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-muted">
        <Link href="/shop" className="inline-flex items-center space-x-2 hover:text-emerald transition-colors">
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
            <div className="relative aspect-[4/5] w-full bg-pearl border border-line overflow-hidden shadow-md group rounded-[2px]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-crosshair"
              />

              {/* Status Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                {product.isFiftyPercentOffer && (
                  <span className="px-3 py-1 bg-emerald text-[10px] font-mono uppercase tracking-[0.14em] text-white font-semibold shadow-sm">
                    50% Celebration Offer
                  </span>
                )}
                {isLowStock && (
                  <span className="px-3 py-1 bg-pearl/90 border border-green/50 text-[10px] font-mono uppercase tracking-widest text-emerald font-semibold backdrop-blur-md shadow-sm">
                    ONLY {product.stock} PIECES REMAINING
                  </span>
                )}
                {isOutOfStock && (
                  <span className="px-3 py-1 bg-mist/90 border border-line text-[10px] font-mono uppercase tracking-widest text-muted font-semibold backdrop-blur-md">
                    VAULT ARCHIVED
                  </span>
                )}
              </div>

              {/* Hallmark Certification Watermark */}
              <div className="absolute bottom-4 right-4 text-[9px] font-mono uppercase tracking-widest text-muted bg-white/90 px-2.5 py-1 border border-line rounded-sm shadow-sm">
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
                    className={`relative w-20 h-24 bg-pearl border rounded-sm overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? 'border-emerald shadow-sm scale-95'
                        : 'border-line opacity-60 hover:opacity-100'
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
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted">
                {product.sku} • {product.specifications.material}
              </div>

              <h1 className="mt-2 font-sans text-3xl sm:text-4xl uppercase tracking-tight text-ink font-medium leading-tight">
                {product.name}
              </h1>

              <p className="mt-2 font-editorial italic text-base sm:text-lg text-muted">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-white border border-line space-y-2 rounded-[2px] shadow-sm">
              <div className="flex items-baseline space-x-4">
                <span className="font-mono text-3xl font-bold text-ink">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="font-mono text-base text-muted line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-semibold">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} (50%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Inclusive of all taxes • Free Insured Courier Across India
              </p>
            </div>

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed tracking-normal">
              {product.description}
            </p>

            {/* Ring Size Selection (If Ring) */}
            {product.category === 'rings' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-muted font-mono">
                  <span>Select Finger Sizing</span>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald hover:underline tracking-widest font-semibold"
                  >
                    Size Guide / WhatsApp Help
                  </a>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-2 text-[10px] uppercase tracking-wider border rounded-[2px] text-center transition-all ${
                        selectedSize === size
                          ? 'bg-emerald text-white border-emerald font-semibold shadow-sm'
                          : 'bg-white text-muted border-line hover:border-emerald/40 hover:text-ink'
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
                  className="flex-1 py-4 bg-white hover:bg-pearl border border-line hover:border-emerald text-ink text-xs uppercase font-mono tracking-[0.14em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-30 rounded-[2px]"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add To Vault Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-emerald hover:bg-forest text-white text-xs uppercase font-mono tracking-[0.14em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(31,77,54,0.25)] disabled:opacity-30 rounded-[2px]"
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
                className="w-full py-3.5 bg-white border border-line hover:border-emerald text-emerald hover:text-forest text-xs uppercase font-mono tracking-[0.14em] transition-colors flex items-center justify-center space-x-2 rounded-[2px] shadow-sm font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask About This Piece on WhatsApp</span>
              </a>
            </div>

            {/* Trust & Guarantee Box */}
            <div className="pt-6 border-t border-line space-y-3 text-xs font-sans text-muted">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald flex-shrink-0" />
                <span>BIS 925 Hallmarked Certified Sterling Silver</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-4 h-4 text-emerald flex-shrink-0" />
                <span>Complimentary Insured Courier Dispatch Across India (2–4 Days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-4 h-4 text-emerald flex-shrink-0" />
                <span>7-Day Hassle-Free Return & Exchange Policy</span>
              </div>
            </div>

            {/* Collapsible Accordions: Craft / Specs / Care */}
            <div className="pt-6 border-t border-line space-y-4">
              <div className="border border-line bg-white rounded-[2px] overflow-hidden shadow-sm">
                <div className="flex border-b border-line text-xs uppercase tracking-wider font-mono">
                  <button
                    onClick={() => setActiveTab('craft')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'craft' ? 'bg-pearl text-ink font-semibold' : 'text-muted hover:text-ink'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'shipping' ? 'bg-pearl text-ink font-semibold' : 'text-muted hover:text-ink'
                    }`}
                  >
                    Dispatch & Transit
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`flex-1 py-3 text-center transition-colors ${
                      activeTab === 'care' ? 'bg-pearl text-ink font-semibold' : 'text-muted hover:text-ink'
                    }`}
                  >
                    Silver Care
                  </button>
                </div>

                <div className="p-5 text-xs font-sans text-muted leading-relaxed space-y-2">
                  {activeTab === 'craft' && (
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between py-1 border-b border-line">
                        <span className="text-muted uppercase">Purity</span>
                        <span className="text-ink font-medium">{product.specifications.purity}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-line">
                        <span className="text-muted uppercase">Weight</span>
                        <span className="text-ink font-medium">{product.specifications.weight}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-line">
                        <span className="text-muted uppercase">Finish</span>
                        <span className="text-ink font-medium">{product.specifications.finish}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-line">
                        <span className="text-muted uppercase">Hallmark</span>
                        <span className="text-ink font-medium">{product.specifications.hallmark}</span>
                      </div>
                      {product.specifications.dimensions && (
                        <div className="flex justify-between py-1 border-b border-line">
                          <span className="text-muted uppercase">Dimensions</span>
                          <span className="text-ink font-medium">{product.specifications.dimensions}</span>
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
                        Avoid contact with harsh pool chlorine and industrial solvents. Store in the VINI VICI VIDI presentation box.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Editorial Related Products */}
        <div className="mt-32 pt-16 border-t border-line">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-1">
                Atelier Recommendations
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl uppercase tracking-tight text-ink font-medium">
                Harmonious Pairings
              </h2>
            </div>
            <Link href="/shop" className="text-xs uppercase font-mono tracking-[0.14em] text-emerald hover:underline font-semibold">
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
