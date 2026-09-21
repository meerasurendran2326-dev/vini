'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Commission Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-line bg-pearl/60">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-2">
            Atelier Liaison & Consultation
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl uppercase tracking-tight text-ink font-medium">
            Connect With The Atelier
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-muted max-w-xl mx-auto">
            Direct communication for bespoke signet seal commissions, VIP showroom private viewings, and urgent inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Details & Direct Pathways */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-1">
                Direct Communication
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl uppercase tracking-tight text-ink font-medium">
                VIP Concierge Desk
              </h2>
              <p className="mt-2 text-xs font-sans text-muted leading-relaxed">
                We prioritize swift, personalized communication. For immediate real-time response, connect with our concierge curators via WhatsApp.
              </p>
            </div>

            {/* WhatsApp Highlight Box */}
            <div className="p-6 bg-white border border-green/40 shadow-sm rounded-[2px] space-y-4">
              <div className="flex items-center space-x-3 text-emerald">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.14em] font-mono font-semibold">
                  WhatsApp Concierge
                </span>
              </div>
              <p className="text-xs font-sans text-muted leading-relaxed">
                Connect directly for ring size consultation, custom hallmark queries, and bespoke seal carving.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20am%20reaching%20out%20for%20a%20personal%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 bg-white hover:bg-pearl border border-green text-emerald text-xs font-mono uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px]"
              >
                Launch WhatsApp Chat →
              </a>
            </div>

            {/* Channels */}
            <div className="space-y-4 pt-2 text-xs font-sans">
              <div className="flex items-start space-x-4 p-4 bg-white border border-line rounded-[2px]">
                <Mail className="w-4 h-4 text-emerald mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted">Email Liaison</div>
                  <div className="font-medium text-ink mt-0.5">concierge@vinivicividi.luxury</div>
                  <div className="text-[10px] text-muted mt-0.5">Response within 4 business hours</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white border border-line rounded-[2px]">
                <Phone className="w-4 h-4 text-emerald mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted">Phone Support</div>
                  <div className="font-medium text-ink mt-0.5">+91 98765 43210</div>
                  <div className="text-[10px] text-muted mt-0.5">Mon – Sat, 10:00 – 20:00 IST</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white border border-line rounded-[2px]">
                <MapPin className="w-4 h-4 text-emerald mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted">The Atelier & Vault</div>
                  <div className="font-medium text-ink mt-0.5">VINI VICI VIDI Atelier</div>
                  <div className="text-[10px] text-muted mt-0.5">High Street, Mumbai / New Delhi, India</div>
                  <div className="text-[10px] text-muted mt-0.5">Private appointments arranged upon request</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-white border border-line shadow-sm space-y-6 rounded-[2px]">
              <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium pb-3 border-b border-line">
                Send A Consultation Request
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pearl border border-green/60 mx-auto flex items-center justify-center text-emerald">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-sans text-xl uppercase tracking-tight text-ink font-medium">
                    Request Received
                  </h4>
                  <p className="font-sans text-xs text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you, {formData.name}. Our master silversmith curator has received your inquiry and will respond within 4 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 border border-line text-xs font-mono uppercase tracking-wider text-ink hover:text-emerald rounded-[2px]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98200 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald rounded-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald cursor-pointer rounded-sm"
                      >
                        <option value="Bespoke Commission Inquiry">Bespoke Commission Inquiry</option>
                        <option value="Custom Sizing / Finger Fitting">Custom Sizing / Finger Fitting</option>
                        <option value="Existing Order Assistance">Existing Order Assistance</option>
                        <option value="Private Showroom Viewing">Private Showroom Viewing</option>
                        <option value="Corporate / B2B Gifting">Corporate / B2B Gifting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                      Your Message / Piece of Interest *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe the piece or custom engraving requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald resize-none rounded-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(31,77,54,0.25)] rounded-[2px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
