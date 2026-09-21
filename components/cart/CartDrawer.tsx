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
        className="fixed inset-0 bg-forest/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-line text-ink flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-sans font-medium text-lg tracking-wider text-ink uppercase">
                Shopping Vault
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-pearl border border-line text-muted rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-muted hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full border border-line flex items-center justify-center text-emerald/60 bg-pearl">
                  <span className="font-sans font-bold text-xl">VVV</span>
                </div>
                <p className="font-editorial italic text-xl text-muted">
                  Your silver vault is currently empty.
                </p>
                <p className="text-xs font-sans tracking-wide text-muted max-w-xs leading-relaxed">
                  Explore our handcrafted sovereign rings, fluid chrome pendants, and heavy byzantine chains.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-sm"
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
                    className="p-4 bg-ivory border border-line relative group flex space-x-4 rounded-[2px]"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 flex-shrink-0 bg-pearl border border-line overflow-hidden rounded-sm">
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
                            className="text-xs uppercase tracking-wider font-sans font-medium text-ink hover:text-emerald line-clamp-1 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted hover:text-red-500 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[10px] uppercase font-mono tracking-widest text-muted mt-0.5">
                          {item.product.specifications.purity} • {item.product.specifications.material}
                        </p>

                        {/* Inventory stock alert */}
                        {isLowStock && (
                          <span className="inline-block mt-1 text-[9px] font-mono uppercase tracking-widest text-emerald font-semibold">
                            Only {item.product.stock} left in stock
                          </span>
                        )}
                      </div>

                      {/* Pricing & Quantity */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                        <div className="flex items-center border border-line bg-white rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-muted hover:text-ink transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 text-muted hover:text-ink disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-medium text-ink">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.product.originalPrice > item.product.price && (
                            <div className="text-[10px] font-mono text-muted line-through">
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
            <div className="p-6 border-t border-line bg-white space-y-4">
              <div className="space-y-1.5 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-muted">
                  <span>Gross Subtotal</span>
                  <span className="font-mono text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald font-medium">
                    <span>50% Special Celebration Offer</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-emerald font-semibold">COMPLIMENTARY</span>
                </div>
                <div className="pt-2 border-t border-line flex justify-between text-sm font-medium text-ink">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base font-bold text-ink">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guest Checkout Direct Link */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(31,77,54,0.25)] rounded-[2px]"
              >
                <span>Proceed To Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-4 pt-1 text-[10px] font-mono uppercase tracking-widest text-muted">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
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
