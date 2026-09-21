'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, discount, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-ivory flex flex-col items-center justify-center text-center px-6 text-ink space-y-4">
        <span className="font-sans font-bold text-4xl text-emerald/30">VVV</span>
        <h1 className="font-editorial italic text-2xl text-muted">
          Your silver vault is currently empty.
        </h1>
        <p className="text-xs font-sans text-muted max-w-sm">
          Select pieces from our 925 solid sterling silver archive to begin your private collection.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold rounded-[2px] shadow-sm transition-colors"
        >
          Explore Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-line bg-pearl/60">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-2">
            Shopping Vault Review
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl uppercase tracking-tight text-ink font-medium">
            Your Selected Pieces ({cart.length})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-line border-y border-line">
              {cart.map((item) => (
                <div key={item.product.id} className="py-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start sm:items-center">
                  <div className="w-24 h-28 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
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
                        className="font-sans uppercase text-sm font-medium text-ink hover:text-emerald transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted hover:text-red-500 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted mt-1">
                      SKU: {item.product.sku} • {item.product.specifications.material} ({item.product.specifications.purity})
                      {item.size && ` • Size: ${item.size}`}
                    </p>

                    {item.product.stock <= item.product.lowStockThreshold && (
                      <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-emerald font-semibold mt-1">
                        Only {item.product.stock} units available
                      </span>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-line bg-white rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-muted hover:text-ink transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-mono font-medium text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 text-muted hover:text-ink disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-ink">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="block font-mono text-xs text-muted line-through">
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
            <div className="p-6 sm:p-8 bg-white border border-line space-y-6 shadow-sm rounded-[2px]">
              <h3 className="font-sans text-lg uppercase tracking-tight text-ink font-medium pb-3 border-b border-line">
                Summary
              </h3>

              <div className="space-y-3 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-muted">
                  <span>Gross Subtotal</span>
                  <span className="font-mono text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald font-semibold">
                    <span>50% Royal Celebration Offer</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-emerald font-semibold">COMPLIMENTARY</span>
                </div>
                <div className="pt-3 border-t border-line flex justify-between text-sm font-semibold text-ink">
                  <span>Estimated Total</span>
                  <span className="font-mono text-xl text-ink font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(31,77,54,0.25)] rounded-[2px]"
              >
                <span>Proceed To Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-[10px] font-mono uppercase tracking-widest text-muted text-center flex items-center justify-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                <span>Guest Checkout • Razorpay Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
