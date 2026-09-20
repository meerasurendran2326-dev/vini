'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, discount, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-graphite border-l border-steel/60 text-ice-white flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-steel/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-display text-lg tracking-widest text-ice-white uppercase">
                Shopping Vault
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-carbon border border-steel/40 text-silver rounded">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-silver hover:text-ice-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full border border-steel/50 flex items-center justify-center text-silver/40">
                  <span className="font-display text-xl">VVV</span>
                </div>
                <p className="font-editorial italic text-xl text-silver/70">
                  Your silver vault is currently empty.
                </p>
                <p className="text-xs font-sans tracking-wide text-chrome max-w-xs">
                  Explore our handcrafted sovereign rings, fluid chrome pendants, and heavy byzantine chains.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 border border-silver/50 hover:border-bright-silver text-xs font-sans uppercase tracking-super-wide text-ice-white hover:bg-carbon transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const isLowStock = item.product.stock <= item.product.lowStockThreshold;
                return (
                  <div
                    key={`${item.product.id}-${item.size || 'default'}`}
                    className="p-4 bg-carbon border border-steel/50 relative group flex space-x-4"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 flex-shrink-0 bg-void border border-steel/40 overflow-hidden">
                      <img
                        src={item.product.images[0] || '/images/products/pdt-1.jpeg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-xs uppercase tracking-wider font-sans font-medium text-ice-white hover:text-bright-silver line-clamp-1 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-chrome hover:text-red-400 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[10px] uppercase font-sans tracking-widest text-silver/60 mt-0.5">
                          {item.product.specifications.purity} • {item.product.specifications.material}
                        </p>

                        {/* Inventory stock alert */}
                        {isLowStock && (
                          <span className="inline-block mt-1 text-[9px] font-sans uppercase tracking-widest text-amber-300 font-semibold">
                            Only {item.product.stock} left in stock
                          </span>
                        )}
                      </div>

                      {/* Pricing & Quantity */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-steel/30">
                        <div className="flex items-center border border-steel/60 bg-void">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-silver hover:text-ice-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-medium text-ice-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 text-silver hover:text-ice-white disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-medium text-ice-white">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.product.originalPrice > item.product.price && (
                            <div className="text-[10px] font-mono text-chrome line-through">
                              ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer: Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-steel/50 bg-carbon/95 space-y-4">
              <div className="space-y-1.5 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-silver">
                  <span>Gross Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>50% Special Celebration Offer</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-silver">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-brand-green">COMPLIMENTARY</span>
                </div>
                <div className="pt-2 border-t border-steel/40 flex justify-between text-sm font-medium text-ice-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base font-semibold text-bright-silver">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guest Checkout Direct Link */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-monumental font-semibold transition-all duration-300 shadow-xl"
              >
                <span>Proceed To Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-4 pt-1 text-[10px] font-sans uppercase tracking-widest text-silver/60">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Razorpay Verified</span>
                </span>
                <span>•</span>
                <span>No Registration Required</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
