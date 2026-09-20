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
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            Logistics & Consignment Tracking
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
            Track Consignment
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-silver/80 max-w-xl mx-auto">
            Real-time status updates from our atelier to your doorstep with end-to-end transit insurance.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-12">
        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="p-6 bg-carbon border border-steel/60 shadow-xl space-y-4">
          <label className="block text-xs uppercase tracking-super-wide font-sans text-silver">
            Enter Your Order Reference (e.g. VVV-89421)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. VVV-89421"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="flex-1 bg-graphite border border-steel/60 px-4 py-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-super-wide font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-40"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Querying...' : 'Track'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-sans flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details */}
        {order && (
          <div className="mt-10 space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="p-6 bg-graphite border border-steel/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60">
                  Consignment #{order.orderNumber}
                </span>
                <h3 className="font-display text-2xl uppercase tracking-wider text-ice-white mt-1">
                  Status: {order.status.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs font-sans text-silver/70 mt-1">
                  Recipient: {order.customer.fullName} • {order.delivery.city}, {order.delivery.state}
                </p>
              </div>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hello VINI VICI VIDI, I am inquiring about tracking for order ${order.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-carbon border border-brand-green/50 text-brand-green text-xs font-sans uppercase tracking-wider hover:bg-brand-green/10 transition-colors self-start sm:self-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Concierge Update</span>
              </a>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-6 bg-carbon border border-steel/50">
              <div className="text-xs uppercase tracking-super-wide font-sans text-bright-silver font-semibold mb-6">
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
                            ? 'bg-bright-silver text-void border-bright-silver font-bold shadow-[0_0_15px_rgba(212,215,218,0.4)]'
                            : isCompleted
                            ? 'bg-carbon text-brand-green border-brand-green'
                            : 'bg-graphite text-silver/40 border-steel/40'
                        }`}
                      >
                        {isCompleted && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span className="text-[11px] font-sans uppercase tracking-wider font-medium text-ice-white">
                        {step.label}
                      </span>
                      <span className="text-[9px] font-sans text-silver/60 leading-tight">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="p-6 bg-carbon border border-steel/50 space-y-4">
              <div className="text-xs uppercase tracking-super-wide font-sans text-silver font-semibold">
                Event Log & Chain of Custody
              </div>
              <div className="space-y-4 text-xs font-sans">
                {order.statusTimeline.map((item, idx) => (
                  <div key={idx} className="flex space-x-4 pb-3 border-b border-steel/20 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-bright-silver mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-ice-white uppercase tracking-wider">
                          {item.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-silver/50">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-silver/80 text-[11px] mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items in Consignment */}
            <div className="p-6 bg-carbon border border-steel/50 space-y-3">
              <div className="text-xs uppercase tracking-super-wide font-sans text-silver font-semibold mb-2">
                Pieces in This Package ({order.items.length})
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-steel/20 last:border-0 text-xs font-sans">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-12 bg-void border border-steel/40 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-medium text-ice-white uppercase">{item.name}</span>
                      <span className="block text-[10px] text-silver/60">SKU: {item.sku} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-bright-silver">
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
    <Suspense fallback={<div className="min-h-screen bg-void flex items-center justify-center text-silver text-xs uppercase tracking-widest">Loading Consignment Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
