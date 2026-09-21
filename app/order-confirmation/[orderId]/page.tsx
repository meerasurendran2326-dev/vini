'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShieldCheck, Truck, MessageCircle, ArrowRight, Package } from 'lucide-react';
import { Order } from '@/lib/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.warn('Order fetch error', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-ivory flex flex-col items-center justify-center text-ink space-y-4">
        <span className="font-sans font-bold text-4xl text-emerald/40">VVV</span>
        <p className="font-editorial italic text-2xl text-muted">
          Retrieving order vault snapshot...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] bg-ivory flex flex-col items-center justify-center text-center px-6 text-ink space-y-4">
        <h1 className="font-sans text-3xl uppercase tracking-tight font-medium">
          Order Not Found
        </h1>
        <p className="text-xs font-sans text-muted max-w-md">
          Could not locate reference {orderId}. Please contact our WhatsApp concierge with your payment receipt.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold rounded-[2px]"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello VINI VICI VIDI, I have completed order ${order.orderNumber}. I would like to receive shipment updates on WhatsApp.`
  )}`;

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-12">
        {/* Success Header */}
        <div className="text-center space-y-4 pb-12 border-b border-line">
          <div className="w-16 h-16 mx-auto rounded-full bg-pearl border border-green/60 flex items-center justify-center text-emerald">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
            Payment Verified & Vault Allocated
          </span>

          <h1 className="font-sans text-3xl sm:text-5xl uppercase tracking-tight text-ink font-medium">
            Order Confirmed: {order.orderNumber}
          </h1>

          <p className="font-editorial italic text-lg sm:text-xl text-muted max-w-lg mx-auto">
            Thank you, {order.customer.fullName}. Your solid 925 sterling pieces are now being prepared at the atelier.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-green text-emerald hover:bg-pearl text-xs font-mono uppercase tracking-[0.14em] transition-colors rounded-[2px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enable WhatsApp Order Updates</span>
            </a>

            <Link
              href={`/track?order=${order.orderNumber}&email=${encodeURIComponent(order.customer.email)}`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Live Consignment Tracking</span>
            </Link>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Items Snapshot */}
          <div className="space-y-6">
            <h3 className="font-sans text-lg uppercase tracking-tight text-ink font-medium pb-2 border-b border-line">
              Purchased Pieces
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex space-x-4 p-4 bg-white border border-line rounded-[2px] shadow-sm">
                  <div className="w-16 h-20 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-sans uppercase font-medium text-ink line-clamp-1">
                      {item.name}
                    </span>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-wider mt-0.5">
                      SKU: {item.sku} {item.size && `• Size: ${item.size}`}
                    </div>
                    <div className="mt-3 flex justify-between items-baseline font-mono">
                      <span className="text-muted">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-ink">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Box */}
            <div className="p-4 bg-white border border-line space-y-2 text-xs font-sans rounded-[2px]">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-mono text-ink">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald font-semibold">
                  <span>50% Celebration Discount</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Insured Transit</span>
                <span className="font-mono text-emerald font-semibold">COMPLIMENTARY</span>
              </div>
              <div className="pt-2 border-t border-line flex justify-between text-sm font-semibold text-ink">
                <span>Total Paid via Razorpay</span>
                <span className="font-mono text-base font-bold text-ink">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Status Timeline */}
          <div className="space-y-6">
            <h3 className="font-sans text-lg uppercase tracking-tight text-ink font-medium pb-2 border-b border-line">
              Delivery & Order State
            </h3>

            {/* Delivery Destination */}
            <div className="p-5 bg-white border border-line space-y-2 text-xs font-sans text-muted rounded-[2px] shadow-sm">
              <div className="text-[10px] uppercase font-mono tracking-widest text-emerald font-semibold mb-1">
                Dispatch Destination
              </div>
              <div className="font-medium text-ink">{order.customer.fullName}</div>
              <div>{order.delivery.addressLine1}</div>
              {order.delivery.addressLine2 && <div>{order.delivery.addressLine2}</div>}
              <div>
                {order.delivery.city}, {order.delivery.state} — {order.delivery.pincode}
              </div>
              <div className="pt-2 text-[10px] text-muted font-mono">
                Contact: {order.customer.phone} • {order.customer.email}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="p-5 bg-white border border-line space-y-4 rounded-[2px] shadow-sm">
              <div className="text-[10px] uppercase font-mono tracking-widest text-muted font-semibold">
                Lifecycle Status
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-line">
                {order.statusTimeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald border-2 border-white" />
                    <div className="text-xs font-mono uppercase tracking-wider font-semibold text-ink">
                      {step.status}
                    </div>
                    <div className="text-[11px] font-sans text-muted mt-0.5">
                      {step.note}
                    </div>
                    <div className="text-[9px] font-mono text-muted/70 mt-1">
                      {new Date(step.timestamp).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 border-t border-line text-center">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.14em] text-emerald hover:text-forest font-semibold transition-colors"
          >
            <span>Continue Exploring Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
