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
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            The Permanent Archive • 925 Solid Sterling Silver
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-ice-white font-normal">
            Collection Catalogue
          </h1>
          <p className="mt-3 font-editorial italic text-lg sm:text-xl text-silver/80 max-w-2xl">
            {filteredProducts.length} archival silver specimens available for immediate dispatch or bespoke personal engraving.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-steel/40">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-sans uppercase tracking-super-wide whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === cat.id
                    ? 'bg-bright-silver text-void border-bright-silver font-semibold'
                    : 'bg-carbon text-silver hover:text-ice-white border-steel/50 hover:border-silver/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Search, Sort, 50% Toggle */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
            {/* 50% Offer Filter */}
            <button
              onClick={() => setOnlyFiftyPercent(!onlyFiftyPercent)}
              className={`flex items-center space-x-2 px-3.5 py-2 border transition-colors ${
                onlyFiftyPercent
                  ? 'bg-brand-green/20 border-brand-green text-brand-green font-medium'
                  : 'bg-carbon border-steel/50 text-silver hover:text-ice-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[11px]">50% Offer Only</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 bg-carbon border border-steel/50 px-3 py-1.5 text-silver">
              <ArrowUpDown className="w-3.5 h-3.5 text-silver/70" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-ice-white focus:outline-none uppercase tracking-wider cursor-pointer"
              >
                <option value="featured" className="bg-graphite">Curated Sort</option>
                <option value="price-asc" className="bg-graphite">Price: Low to High</option>
                <option value="price-desc" className="bg-graphite">Price: High to Low</option>
                <option value="name" className="bg-graphite">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || onlyFiftyPercent || selectedCategory !== 'all') && (
          <div className="pt-4 flex items-center space-x-3 text-xs text-silver">
            <span>Filtering by:</span>
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 bg-carbon border border-steel/50 text-[10px] uppercase tracking-wider text-ice-white">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-1 bg-carbon border border-steel/50 text-[10px] uppercase tracking-wider text-ice-white">
                "{searchQuery}"
              </span>
            )}
            {onlyFiftyPercent && (
              <span className="px-2.5 py-1 bg-carbon border border-steel/50 text-[10px] uppercase tracking-wider text-brand-green">
                50% Offer
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyFiftyPercent(false);
              }}
              className="text-[10px] uppercase tracking-widest text-bright-silver hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="pt-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-steel/40 p-12 bg-carbon/50">
              <span className="font-display text-3xl text-silver/40 block mb-3">VVV</span>
              <p className="font-editorial italic text-2xl text-silver">
                No matching specimens found in the current archive.
              </p>
              <p className="text-xs font-sans text-chrome mt-2">
                Try modifying your search criteria or explore our complete 925 collection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFiftyPercent(false);
                }}
                className="mt-6 px-6 py-3 bg-bright-silver text-void text-xs font-sans uppercase tracking-super-wide font-semibold"
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
    <Suspense fallback={<div className="min-h-screen bg-void flex items-center justify-center text-silver text-xs uppercase tracking-widest">Opening Archive...</div>}>
      <ShopContent />
    </Suspense>
  );
}
