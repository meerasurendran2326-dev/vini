'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles, Check, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/lib/types';
import { initialProducts } from '@/lib/data/initialProducts';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [onlyFiftyPercent, setOnlyFiftyPercent] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.warn('Error fetching dynamic products', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Artefacts' },
    { id: 'rings', label: 'Sovereign Rings' },
    { id: 'pendants', label: 'Liquid Pendants' },
    { id: 'bracelets', label: 'Torques & Cuffs' },
    { id: 'chains', label: 'Chains & Weaves' },
    { id: 'bespoke', label: 'Bespoke Commissions' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (onlyFiftyPercent && !p.isFiftyPercentOffer) return false;
        if (onlyInStock && p.stock <= 0) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesSku = p.sku.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, onlyFiftyPercent, onlyInStock, sortBy]);

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-line bg-pearl/60">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-2">
            The Permanent Archive • 925 Solid Sterling Silver
          </span>
          <h1 className="font-sans text-4xl sm:text-6xl uppercase tracking-tight text-ink font-medium">
            Collection Catalogue
          </h1>
          <p className="mt-3 font-editorial italic text-lg sm:text-xl text-muted max-w-2xl">
            {filteredProducts.length} archival silver specimens available for immediate dispatch or bespoke personal engraving.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-line">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] whitespace-nowrap transition-all duration-300 rounded-[2px] border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald text-white border-emerald font-semibold shadow-sm'
                    : 'bg-white text-muted hover:text-ink border-line hover:border-emerald/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Search, Sort, 50% Toggle */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* 50% Offer Filter */}
            <button
              onClick={() => setOnlyFiftyPercent(!onlyFiftyPercent)}
              className={`flex items-center space-x-2 px-3.5 py-2 border rounded-[2px] transition-colors ${
                onlyFiftyPercent
                  ? 'bg-emerald/15 border-emerald text-emerald font-semibold'
                  : 'bg-white border-line text-muted hover:text-ink hover:border-emerald/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald" />
              <span className="uppercase tracking-wider text-[11px]">50% Offer Only</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 bg-white border border-line px-3 py-1.5 text-ink rounded-[2px]">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-ink focus:outline-none uppercase tracking-wider cursor-pointer font-mono"
              >
                <option value="featured">Curated Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || onlyFiftyPercent || selectedCategory !== 'all') && (
          <div className="pt-4 flex items-center space-x-3 text-xs text-muted font-mono">
            <span>Filtering by:</span>
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink rounded-sm">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink rounded-sm">
                "{searchQuery}"
              </span>
            )}
            {onlyFiftyPercent && (
              <span className="px-2.5 py-1 bg-emerald/10 border border-emerald text-[10px] uppercase tracking-wider text-emerald font-semibold rounded-sm">
                50% Offer
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyFiftyPercent(false);
              }}
              className="text-[10px] uppercase tracking-widest text-emerald hover:underline ml-2 font-semibold"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="pt-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-line p-12 bg-white rounded-[2px]">
              <span className="font-sans font-bold text-3xl text-emerald/40 block mb-3">VVV</span>
              <p className="font-editorial italic text-2xl text-ink">
                No matching specimens found in the current archive.
              </p>
              <p className="text-xs font-sans text-muted mt-2">
                Try modifying your search criteria or explore our complete 925 collection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFiftyPercent(false);
                }}
                className="mt-6 px-6 py-3 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold rounded-[2px] shadow-sm transition-colors"
              >
                Reset Catalog View
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-muted text-xs font-mono uppercase tracking-widest">Opening Archive...</div>}>
      <ShopContent />
    </Suspense>
  );
}
