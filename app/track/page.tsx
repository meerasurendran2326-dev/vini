'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const initialEmail = searchParams.get('email') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrder);
  const [emailQuery, setEmailQuery] = useState(initialEmail);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${query.trim()}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(`No order found matching "${query}". Please check your order reference number.`);
      }
    } catch (err) {
      setOrder(null);
      setError('Unable to query consignment server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      fetchOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  const statusSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'CONFIRMED', label: 'Confirmed', desc: 'Assayed stock allocated' },
    { status: 'PROCESSING', label: 'In Atelier', desc: 'Hand polish & QC check' },
    { status: 'PACKED', label: 'Vault Sealed', desc: 'Tamper-proof container' },
    { status: 'SHIPPED', label: 'In Transit', desc: 'Handed to BlueDart / Sequel' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', desc: 'Courier on final route' },
    { status: 'DELIVERED', label: 'Delivered', desc: 'Securely received' },
  ];

  const getStatusIndex = (current: OrderStatus) => {
    switch (current) {
      case 'PENDING_PAYMENT': return 0;
      case 'PAID':
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'PACKED': return 3;
      case 'SHIPPED': return 4;
      case 'OUT_FOR_DELIVERY': return 5;
      case 'DELIVERED': return 6;
      default: return 1;
    }
  };

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-line bg-pearl/60">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-2">
            Logistics & Consignment Tracking
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl uppercase tracking-tight text-ink font-medium">
            Track Consignment
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-muted max-w-xl mx-auto">
            Real-time status updates from our atelier to your doorstep with end-to-end transit insurance.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-12">
        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="p-6 bg-white border border-line shadow-sm space-y-4 rounded-[2px]">
          <label className="block text-xs uppercase tracking-[0.14em] font-mono text-muted">
            Enter Your Order Reference (e.g. VVV-89421)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. VVV-89421"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="flex-1 bg-pearl border border-line px-4 py-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald font-mono rounded-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 rounded-[2px] shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Querying...' : 'Track'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start space-x-3 rounded-[2px]">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details */}
        {order && (
          <div className="mt-10 space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="p-6 bg-white border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[2px] shadow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
                  Consignment #{order.orderNumber}
                </span>
                <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium mt-1">
                  Status: {order.status.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs font-sans text-muted mt-1">
                  Recipient: {order.customer.fullName} • {order.delivery.city}, {order.delivery.state}
                </p>
              </div>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hello VINI VICI VIDI, I am inquiring about tracking for order ${order.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-green text-emerald text-xs font-mono uppercase tracking-wider hover:bg-pearl transition-colors self-start sm:self-center rounded-[2px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Concierge Update</span>
              </a>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-6 bg-white border border-line rounded-[2px] shadow-sm">
              <div className="text-xs uppercase tracking-[0.14em] font-mono text-ink font-semibold mb-6">
                Transit Milestones
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
                {statusSteps.map((step, idx) => {
                  const currentIndex = getStatusIndex(order.status);
                  const isCompleted = idx < currentIndex;
                  const isCurrent = idx === currentIndex - 1;

                  return (
                    <div key={step.status} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-mono transition-all ${
                          isCurrent
                            ? 'bg-emerald text-white border-emerald font-bold shadow-md'
                            : isCompleted
                            ? 'bg-pearl text-emerald border-green'
                            : 'bg-pearl text-muted border-line'
                        }`}
                      >
                        {isCompleted && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-medium text-ink">
                        {step.label}
                      </span>
                      <span className="text-[9px] font-sans text-muted leading-tight">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="p-6 bg-white border border-line space-y-4 rounded-[2px] shadow-sm">
              <div className="text-xs uppercase tracking-[0.14em] font-mono text-muted font-semibold">
                Event Log & Chain of Custody
              </div>
              <div className="space-y-4 text-xs font-sans">
                {order.statusTimeline.map((item, idx) => (
                  <div key={idx} className="flex space-x-4 pb-3 border-b border-line last:border-0">
                    <div className="w-2 h-2 rounded-full bg-emerald mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-ink uppercase tracking-wider font-mono">
                          {item.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-muted text-[11px] mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in Consignment */}
            <div className="p-6 bg-white border border-line space-y-3 rounded-[2px] shadow-sm">
              <div className="text-xs uppercase tracking-[0.14em] font-mono text-muted font-semibold mb-2">
                Pieces in This Package ({order.items.length})
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-line last:border-0 text-xs font-sans">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-12 bg-pearl border border-line overflow-hidden rounded-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-medium text-ink uppercase">{item.name}</span>
                      <span className="block text-[10px] text-muted font-mono">SKU: {item.sku} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-ink">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-muted text-xs font-mono uppercase tracking-widest">Loading Consignment Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
