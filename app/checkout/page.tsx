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
      <div className="min-h-[80vh] bg-ivory flex flex-col items-center justify-center text-center px-6 text-ink space-y-4">
        <span className="font-sans font-bold text-4xl text-emerald/30">VVV</span>
        <h1 className="font-editorial italic text-2xl text-muted">
          Your vault cart is currently empty.
        </h1>
        <p className="text-xs font-sans text-muted">
          Select items from our 925 sterling collection before proceeding to guest checkout.
        </p>
        <Link
          href="/shop"
          className="mt-4 px-8 py-3 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold rounded-[2px] shadow-sm transition-colors"
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
        colors: ['#1F4D36', '#6C8F72', '#BFC3C7', '#FFFFFF'],
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
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-6 border-b border-line flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-muted">
        <Link href="/cart" className="inline-flex items-center space-x-2 hover:text-emerald transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return To Bag</span>
        </Link>
        <div className="flex items-center space-x-2 text-emerald font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted Guest Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Guest Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-1">
                Step 01 & 02 • Frictionless Commerce
              </span>
              <h1 className="font-sans text-3xl sm:text-4xl uppercase tracking-tight text-ink font-medium">
                Guest Checkout
              </h1>
              <p className="mt-1 font-editorial italic text-muted text-sm">
                No passwords or account creation needed. Enter your transit details for insured dispatch.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start space-x-3 rounded-[2px]">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleInitiatePayment} className="space-y-8 font-mono">
              {/* Section 1: Customer Contact */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.14em] text-ink font-semibold flex items-center space-x-2 pb-2 border-b border-line">
                  <span>01. Recipient Contact</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Devika Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                      Email Address (For Tax Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="devika@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                      WhatsApp & Mobile Phone (For Real-Time Transit SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Insured Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.14em] text-ink font-semibold flex items-center space-x-2 pb-2 border-b border-line">
                  <span>02. Insured Delivery Destination (PAN India)</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                      Street Address / Apartment / Suite *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 14B, Imperial Residences"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        Landmark / Locality (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Near High Street Phoenix"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        City / Metro *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        State / Union Territory *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald cursor-pointer rounded-sm"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="400026"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
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
                  className="w-full py-5 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(31,77,54,0.25)] flex items-center justify-center space-x-3 disabled:opacity-40 rounded-[2px]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Verifying with Atelier...' : `Pay ₹${total.toLocaleString('en-IN')} via Razorpay`}
                  </span>
                </button>
                <div className="flex items-center justify-center space-x-4 mt-3 text-[10px] font-mono uppercase tracking-widest text-muted">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
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
            <div className="p-6 sm:p-8 bg-white border border-line space-y-6 shadow-sm rounded-[2px]">
              <h3 className="font-sans text-lg uppercase tracking-tight text-ink font-medium pb-3 border-b border-line">
                Order Review ({cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex space-x-4 pb-4 border-b border-line last:border-0">
                    <div className="w-16 h-20 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
                      <img
                        src={item.product.images[0] || '/images/products/pdt-1.jpeg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-xs font-sans">
                      <div className="uppercase font-medium text-ink line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted mt-0.5">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                      </div>
                      <div className="mt-2 font-mono text-sm font-bold text-ink">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-line space-y-2 text-xs font-sans tracking-wide">
                <div className="flex justify-between text-muted">
                  <span>Gross Subtotal</span>
                  <span className="font-mono text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald font-semibold">
                    <span>50% Celebration Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-mono text-emerald font-semibold">COMPLIMENTARY</span>
                </div>
                <div className="pt-3 border-t border-line flex justify-between text-base font-semibold text-ink">
                  <span>Total Payable</span>
                  <span className="font-mono text-xl text-ink font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Server-Verified Notice */}
              <div className="p-3 bg-pearl border border-line text-[10px] font-mono text-muted leading-relaxed flex items-center space-x-2 rounded-sm">
                <ShieldCheck className="w-4 h-4 text-emerald flex-shrink-0" />
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
            className="fixed inset-0 bg-forest/60 backdrop-blur-md"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="relative w-full max-w-md bg-white border border-line p-8 shadow-2xl z-10 space-y-6 rounded-[2px]">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-ink">
                  Razorpay Secure Gateway
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted">
                {simulatedRzpOrder.razorpayOrderId}
              </span>
            </div>

            <div className="text-center py-4 bg-pearl border border-line space-y-1 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Amount Payable To VINI VICI VIDI
              </span>
              <div className="font-mono text-3xl font-bold text-ink">
                ₹{(simulatedRzpOrder.amount / 100).toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald font-semibold">
                Server-Verified Snapshot
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono text-ink">
              <p className="text-[11px] font-sans text-muted leading-relaxed">
                Choose a payment instrument to verify end-to-end checkout execution:
              </p>
              
              <button
                onClick={() => handleConfirmPayment(`pay_rzp_upi_${Date.now()}`)}
                className="w-full py-3 px-4 bg-pearl hover:bg-white border border-line hover:border-emerald text-left flex items-center justify-between transition-colors rounded-sm"
              >
                <span>Instant UPI (Google Pay / PhonePe / Paytm)</span>
                <span className="text-[10px] uppercase text-emerald font-semibold">Simulate Success →</span>
              </button>

              <button
                onClick={() => handleConfirmPayment(`pay_rzp_card_${Date.now()}`)}
                className="w-full py-3 px-4 bg-pearl hover:bg-white border border-line hover:border-emerald text-left flex items-center justify-between transition-colors rounded-sm"
              >
                <span>Credit / Debit Card (Visa / Mastercard / Amex)</span>
                <span className="text-[10px] uppercase text-emerald font-semibold">Simulate Success →</span>
              </button>

              <button
                onClick={() => handleConfirmPayment(`pay_rzp_netbank_${Date.now()}`)}
                className="w-full py-3 px-4 bg-pearl hover:bg-white border border-line hover:border-emerald text-left flex items-center justify-between transition-colors rounded-sm"
              >
                <span>NetBanking (HDFC / ICICI / SBI / Axis)</span>
                <span className="text-[10px] uppercase text-emerald font-semibold">Simulate Success →</span>
              </button>
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-muted">
              <span>Test Sandbox Mode</span>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-red-500 hover:underline uppercase tracking-wider"
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
