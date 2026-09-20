'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, discount, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-void flex flex-col items-center justify-center text-center px-6 text-ice-white space-y-4">
        <span className="font-display text-4xl text-silver/30">VVV</span>
        <h1 className="font-editorial italic text-2xl text-silver">
          Your silver vault is currently empty.
        </h1>
        <p className="text-xs font-sans text-chrome max-w-sm">
          Select pieces from our 925 solid sterling silver archive to begin your private collection.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3 bg-bright-silver text-void font-sans text-xs uppercase tracking-super-wide font-semibold"
        >
          Explore Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            Shopping Vault Review
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
            Your Selected Pieces ({cart.length})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-steel/30 border-y border-steel/30">
              {cart.map((item) => (
                <div key={item.product.id} className="py-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start sm:items-center">
                  <div className="w-24 h-28 bg-carbon border border-steel/50 overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || '/images/products/pdt-1.jpeg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-sans uppercase text-sm font-medium text-ice-white hover:text-bright-silver transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-chrome hover:text-red-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] font-sans uppercase tracking-wider text-silver/60 mt-1">
                      SKU: {item.product.sku} • {item.product.specifications.material} ({item.product.specifications.purity})
                      {item.size && ` • Size: ${item.size}`}
                    </p>

                    {item.product.stock <= item.product.lowStockThreshold && (
                      <span className="inline-block text-[10px] font-sans uppercase tracking-widest text-amber-300 font-semibold mt-1">
                        Only {item.product.stock} units available
                      </span>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-steel/60 bg-carbon">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-silver hover:text-ice-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-mono font-medium text-ice-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 text-silver hover:text-ice-white disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="font-mono text-base font-semibold text-bright-silver">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="block font-mono text-xs text-chrome line-through">
                            ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 bg-carbon border border-steel/60 space-y-6 shadow-xl">
              <h3 className="font-display text-lg uppercase tracking-wider text-ice-white pb-3 border-b border-steel/40">
                Summary
              </h3>

              <div className="space-y-3 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-silver">
                  <span>Gross Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>50% Royal Celebration Offer</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-silver">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-brand-green">COMPLIMENTARY</span>
                </div>
                <div className="pt-3 border-t border-steel/40 flex justify-between text-sm font-semibold text-ice-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-xl text-bright-silver font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-monumental font-semibold transition-all flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>Proceed To Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-[10px] font-sans uppercase tracking-widest text-silver/60 text-center flex items-center justify-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                <span>Guest Checkout • Razorpay Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
