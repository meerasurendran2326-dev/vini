'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validatedData, setValidatedData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [simulatedRzpOrder, setSimulatedRzpOrder] = useState<any>(null);

  // Revalidate cart with server
  useEffect(() => {
    if (!cart.length) return;

    const payload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size,
      })),
    };

    fetch('/api/checkout/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setValidatedData(data);
        } else {
          setErrorMessage(data.error || 'Failed to validate pricing with atelier.');
        }
      })
      .catch((err) => {
        setErrorMessage('Failed to connect to atelier server.');
      });
  }, [cart]);

  if (!cart.length && !isProcessing) {
    return (
      <div className="min-h-[80vh] bg-void flex flex-col items-center justify-center text-center px-6 text-ice-white space-y-4">
        <span className="font-display text-4xl text-silver/30">VVV</span>
        <h1 className="font-editorial italic text-2xl text-silver">
          Your vault cart is currently empty.
        </h1>
        <p className="text-xs font-sans text-chrome">
          Select items from our 925 sterling collection before proceeding to guest checkout.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3 bg-bright-silver text-void font-sans text-xs uppercase tracking-super-wide font-semibold"
        >
          Return To Exhibition
        </Link>
      </div>
    );
  }

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage('Please complete all mandatory delivery and contact fields.');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Request Razorpay Order from server
      const orderPayload = {
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size,
        })),
        customer: {
          fullName,
          email,
          phone,
          whatsappPhone: phone,
        },
        delivery: {
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          pincode,
          country: 'India',
        },
      };

      const res = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment gateway session.');
      }

      setSimulatedRzpOrder(data);
      setShowPaymentModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async (simulatedPaymentId: string) => {
    try {
      // Step 2: Server-Side Verification of Razorpay Payment
      const verifyPayload = {
        razorpayOrderId: simulatedRzpOrder.razorpayOrderId,
        razorpayPaymentId: simulatedPaymentId,
        razorpaySignature: `sig_verified_${Date.now()}`,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size,
        })),
        customer: {
          fullName,
          email,
          phone,
          whatsappPhone: phone,
        },
        delivery: {
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          pincode,
          country: 'India',
        },
      };

      const res = await fetch('/api/payment/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Server payment verification failed.');
      }

      // Celebrate success
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4D7DA', '#BFC3C7', '#6C8F72', '#FFFFFF'],
      });

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please contact concierge.');
      setShowPaymentModal(false);
      setIsProcessing(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const subtotal = validatedData ? validatedData.subtotal : cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
  const discount = validatedData ? validatedData.discount : (subtotal - cart.reduce((s, i) => s + i.product.price * i.quantity, 0));
  const total = validatedData ? validatedData.total : cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-6 border-b border-steel/30 flex items-center justify-between text-[10px] font-sans uppercase tracking-monumental text-silver/60">
        <Link href="/cart" className="inline-flex items-center space-x-2 hover:text-ice-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return To Bag</span>
        </Link>
        <div className="flex items-center space-x-2 text-brand-green">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted Guest Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Guest Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-1">
                Step 01 & 02 • Frictionless Commerce
              </span>
              <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ice-white">
                Guest Checkout
              </h1>
              <p className="mt-1 font-editorial italic text-silver/70 text-sm">
                No passwords or account creation needed. Enter your transit details for insured dispatch.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-sans flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleInitiatePayment} className="space-y-8">
              {/* Section 1: Customer Contact */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-super-wide font-sans text-bright-silver font-semibold flex items-center space-x-2 pb-2 border-b border-steel/40">
                  <span>01. Recipient Contact</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Devika Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                      Email Address (For Tax Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="devika@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                      WhatsApp & Mobile Phone (For Real-Time Transit SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Insured Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-super-wide font-sans text-bright-silver font-semibold flex items-center space-x-2 pb-2 border-b border-steel/40">
                  <span>02. Insured Delivery Destination (PAN India)</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                      Street Address / Apartment / Suite *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 14B, Imperial Residences"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        Landmark / Locality (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Near High Street Phoenix"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        City / Metro *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        State / Union Territory *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white focus:outline-none focus:border-bright-silver cursor-pointer"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st} className="bg-graphite">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="400026"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit to Payment Gateway */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-5 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-monumental font-semibold transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3 disabled:opacity-40"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Verifying with Atelier...' : `Pay ₹${total.toLocaleString('en-IN')} via Razorpay`}
                  </span>
                </button>
                <div className="flex items-center justify-center space-x-4 mt-3 text-[10px] font-sans uppercase tracking-widest text-silver/60">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                    <span>Razorpay Verified</span>
                  </span>
                  <span>•</span>
                  <span>Atomic Stock Reservation</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Review Snapshot */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-carbon border border-steel/60 space-y-6">
              <h3 className="font-display text-lg uppercase tracking-wider text-ice-white pb-3 border-b border-steel/40">
                Order Review ({cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex space-x-4 pb-4 border-b border-steel/20 last:border-0">
                    <div className="w-16 h-20 bg-void border border-steel/40 overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || '/images/products/pdt-1.jpeg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-sans uppercase font-medium text-ice-white line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] font-sans uppercase tracking-wider text-silver/60 mt-0.5">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                      </div>
                      <div className="mt-2 font-mono text-sm font-semibold text-bright-silver">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-steel/40 space-y-2 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-silver">
                  <span>Gross Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>50% Celebration Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-silver">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-brand-green">COMPLIMENTARY</span>
                </div>
                <div className="pt-3 border-t border-steel/40 flex justify-between text-base font-semibold text-ice-white">
                  <span>Total Payable</span>
                  <span className="font-mono text-xl text-bright-silver">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Server-Verified Notice */}
              <div className="p-3 bg-graphite border border-steel/50 text-[10px] font-sans text-silver/70 leading-relaxed flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-bright-silver flex-shrink-0" />
                <span>Price & inventory locked with server authority upon payment completion.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Luxury Payment Gateway Simulation Modal */}
      {showPaymentModal && simulatedRzpOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-void/90 backdrop-blur-md"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="relative w-full max-w-md bg-graphite border border-steel/80 p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-steel/40">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-sans text-xs uppercase tracking-widest font-semibold text-ice-white">
                  Razorpay Secure Gateway
                </span>
              </div>
              <span className="text-[10px] font-mono text-silver/60">
                {simulatedRzpOrder.razorpayOrderId}
              </span>
            </div>

            <div className="text-center py-4 bg-carbon border border-steel/40 space-y-1">
              <span className="text-[10px] font-sans uppercase tracking-wider text-silver/60">
                Amount Payable To VINI VICI VIDI
              </span>
              <div className="font-mono text-3xl font-bold text-ice-white">
                ₹{(simulatedRzpOrder.amount / 100).toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] font-sans uppercase tracking-widest text-brand-green">
                Server-Verified Snapshot
              </span>
            </div>

            <div className="space-y-3 text-xs font-sans text-silver/80">
              <p className="text-[11px] leading-relaxed">
                Choose a payment instrument to verify end-to-end checkout execution:
              </p>
              
              <button
                onClick={() => handleConfirmPayment(`pay_rzp_upi_${Date.now()}`)}
                className="w-full py-3 px-4 bg-carbon hover:bg-steel/30 border border-steel/60 hover:border-bright-silver text-left flex items-center justify-between transition-colors"
              >
                <span>Instant UPI (Google Pay / PhonePe / Paytm)</span>
                <span className="text-[10px] uppercase text-brand-green">Simulate Success →</span>
              </button>

              <button
                onClick={() => handleConfirmPayment(`pay_rzp_card_${Date.now()}`)}
                className="w-full py-3 px-4 bg-carbon hover:bg-steel/30 border border-steel/60 hover:border-bright-silver text-left flex items-center justify-between transition-colors"
              >
                <span>Credit / Debit Card (Visa / Mastercard / Amex)</span>
                <span className="text-[10px] uppercase text-brand-green">Simulate Success →</span>
              </button>

              <button
                onClick={() => handleConfirmPayment(`pay_rzp_netbank_${Date.now()}`)}
                className="w-full py-3 px-4 bg-carbon hover:bg-steel/30 border border-steel/60 hover:border-bright-silver text-left flex items-center justify-between transition-colors"
              >
                <span>NetBanking (HDFC / ICICI / SBI / Axis)</span>
                <span className="text-[10px] uppercase text-brand-green">Simulate Success →</span>
              </button>
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] font-sans text-silver/50">
              <span>Test Sandbox Mode</span>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-red-400 hover:underline uppercase tracking-wider"
              >
                Cancel Attempt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
