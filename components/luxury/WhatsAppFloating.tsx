'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloating({
  phoneNumber = '+919876543210',
  defaultMessage = 'Hello VINI VICI VIDI, I would like to inquire about a piece in your silver collection.'
}: WhatsAppFloatingProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(defaultMessage);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect on WhatsApp"
        className="group flex items-center space-x-3 px-4 py-3 bg-graphite/90 hover:bg-carbon border border-steel/80 hover:border-brand-green/60 text-ice-white backdrop-blur-md transition-all duration-300 shadow-xl"
      >
        <div className="relative">
          <MessageCircle className="w-4 h-4 text-brand-green transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-sans uppercase tracking-widest text-silver/60">
            Concierge
          </span>
          <span className="text-[11px] font-sans uppercase tracking-wider text-ice-white group-hover:text-brand-green-light transition-colors">
            WhatsApp Atelier
          </span>
        </div>
      </a>
    </div>
  );
}
