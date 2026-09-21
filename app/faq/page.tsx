'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is your silver genuine 925 Solid Sterling Silver?",
      a: "Yes, without exception. Every single VINI VICI VIDI creation is cast from solid 925 sterling silver (92.5% pure silver alloyed with deoxidized copper). We do not produce hollowed-out jewellery or silver-plated brass. Each piece bears an official BIS 925 laser hallmark and assay stamp."
    },
    {
      q: "Do I need an account or password to make a purchase?",
      a: "No. In accordance with our frictionless luxury ethos, our website is 100% guest-checkout first. You never have to create an account, remember a password, or register. Simply enter your contact details and shipping address for courier dispatch."
    },
    {
      q: "How does payment through Razorpay work?",
      a: "We process all transactions via Razorpay, India's premier secure payment gateway. You can pay seamlessly using UPI (Google Pay, PhonePe, Paytm), all Indian and International credit/debit cards (Visa, Mastercard, RuPay, Amex), and NetBanking. All payment data is 256-bit encrypted and verified server-side."
    },
    {
      q: "How does the 50% Royal Celebration offer work?",
      a: "Our 50% celebration offer is applied directly to eligible signature collection pieces as configured by our atelier. The final price displayed in your cart and during checkout is fully verified and locked by our backend server."
    },
    {
      q: "What does 'Only 3 Left' or low stock mean?",
      a: "Our inventory system is directly linked to real physical stock at our studio. When an item displays 'Only 3 Left', there are genuinely only three assayed units remaining before the mould is either archived or queued for an extended hand-casting cycle."
    },
    {
      q: "How long does shipping take across India?",
      a: "All orders receive complimentary express courier dispatch with 100% transit insurance via BlueDart or Sequel Logistics. Metropolitan deliveries arrive within 2 to 4 business days. Real-time tracking is sent to your phone and WhatsApp."
    },
    {
      q: "Can I commission custom initials or bespoke family heraldry?",
      a: "Yes. Our 'Bespoke Artefacts' collection includes sovereign rings and talismans engineered specifically for custom seal engraving. After placing your order, our master engraver will reach out via WhatsApp to share a digital preview of your monogram or family crest before carving."
    },
    {
      q: "What is your return and exchange policy?",
      a: "We offer a 7-day hassle-free return or exchange window from the date of delivery for all non-customized pieces. Items must be in unworn condition with the original presentation box and certificate intact."
    }
  ];

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-line bg-pearl/60">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold block mb-2">
            Client Guidance & Assistance
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl uppercase tracking-tight text-ink font-medium">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-muted max-w-xl mx-auto">
            Everything you need to know about our metallurgy, guest checkout, Razorpay, and insured pan-India delivery.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-12">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-line rounded-[2px] transition-colors shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                >
                  <span className="font-sans text-xs sm:text-sm uppercase tracking-wider font-medium text-ink">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm font-sans text-muted leading-relaxed border-t border-line pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Direct Help Banner */}
        <div className="mt-16 p-8 bg-white border border-line text-center space-y-4 rounded-[2px] shadow-sm">
          <h3 className="font-sans text-xl uppercase tracking-tight text-ink font-medium">
            Have a Specific Question About a Piece?
          </h3>
          <p className="text-xs font-sans text-muted max-w-md mx-auto">
            Connect directly with our atelier concierge on WhatsApp for real-time sizing recommendations, styling advice, or order inquiries.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/919876543210?text=Hello%20VINI%20VICI%20VIDI,%20I%20have%20a%20question%20regarding%20the%20silver%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-[0_4px_20px_rgba(31,77,54,0.25)]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
