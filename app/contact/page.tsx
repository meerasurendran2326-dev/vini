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
    <div className="bg-void min-h-screen text-ice-white pb-32">
      {/* Editorial Header */}
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            Atelier Liaison & Consultation
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
            Connect With The Atelier
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-silver/80 max-w-xl mx-auto">
            Direct communication for bespoke signet seal commissions, VIP showroom private viewings, and urgent inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Details & Direct Pathways */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-1">
                Direct Communication
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ice-white">
                VIP Concierge Desk
              </h2>
              <p className="mt-2 text-xs font-sans text-silver/80 leading-relaxed">
                We prioritize swift, personalized communication. For immediate real-time response, connect with our concierge curators via WhatsApp.
              </p>
            </div>

            {/* WhatsApp Highlight Box */}
            <div className="p-6 bg-carbon border border-brand-green/40 shadow-xl space-y-4">
              <div className="flex items-center space-x-3 text-brand-green">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs uppercase tracking-super-wide font-sans font-semibold">
                  WhatsApp Concierge
                </span>
              </div>
              <p className="text-xs font-sans text-silver/80 leading-relaxed">
                Connect directly for ring size consultation, custom hallmark queries, and bespoke seal carving.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20am%20reaching%20out%20for%20a%20personal%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 bg-graphite hover:bg-void border border-brand-green/60 text-brand-green text-xs font-sans uppercase tracking-super-wide transition-colors"
              >
                Launch WhatsApp Chat →
              </a>
            </div>

            {/* Channels */}
            <div className="space-y-4 pt-2 text-xs font-sans">
              <div className="flex items-start space-x-4 p-4 bg-carbon border border-steel/40">
                <Mail className="w-4 h-4 text-bright-silver mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-silver/60">Email Liaison</div>
                  <div className="font-medium text-ice-white mt-0.5">concierge@vinivicividi.luxury</div>
                  <div className="text-[10px] text-silver/50 mt-0.5">Response within 4 business hours</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-carbon border border-steel/40">
                <Phone className="w-4 h-4 text-bright-silver mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-silver/60">Phone Support</div>
                  <div className="font-medium text-ice-white mt-0.5">+91 98765 43210</div>
                  <div className="text-[10px] text-silver/50 mt-0.5">Mon – Sat, 10:00 – 20:00 IST</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-carbon border border-steel/40">
                <MapPin className="w-4 h-4 text-bright-silver mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-silver/60">The Atelier & Vault</div>
                  <div className="font-medium text-ice-white mt-0.5">VINI VICI VIDI Atelier</div>
                  <div className="text-[10px] text-silver/70 mt-0.5">High Street, Mumbai / New Delhi, India</div>
                  <div className="text-[10px] text-silver/50 mt-0.5">Private appointments arranged upon request</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-graphite border border-steel/60 shadow-2xl space-y-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-ice-white pb-3 border-b border-steel/40">
                Send A Consultation Request
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-carbon border border-brand-green/60 mx-auto flex items-center justify-center text-brand-green">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-xl uppercase tracking-wider text-ice-white">
                    Request Received
                  </h4>
                  <p className="font-sans text-xs text-silver/80 max-w-sm mx-auto leading-relaxed">
                    Thank you, {formData.name}. Our master silversmith curator has received your inquiry and will respond within 4 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 border border-steel/60 text-xs font-sans uppercase tracking-wider text-silver hover:text-ice-white"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98200 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white focus:outline-none focus:border-bright-silver cursor-pointer"
                      >
                        <option value="Bespoke Commission Inquiry" className="bg-graphite">Bespoke Commission Inquiry</option>
                        <option value="Custom Sizing / Finger Fitting" className="bg-graphite">Custom Sizing / Finger Fitting</option>
                        <option value="Existing Order Assistance" className="bg-graphite">Existing Order Assistance</option>
                        <option value="Private Showroom Viewing" className="bg-graphite">Private Showroom Viewing</option>
                        <option value="Corporate / B2B Gifting" className="bg-graphite">Corporate / B2B Gifting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-silver/70 mb-1.5">
                      Your Message / Piece of Interest *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe the piece or custom engraving requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-carbon border border-steel/60 p-3 text-xs text-ice-white placeholder-silver/40 focus:outline-none focus:border-bright-silver resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-bright-silver hover:bg-white text-void font-sans text-xs uppercase tracking-monumental font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl"
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
