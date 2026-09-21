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
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect on WhatsApp"
        className="group flex items-center space-x-2.5 px-4 py-2 bg-white/90 hover:bg-white border border-line hover:border-green text-ink rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_10px_30px_rgba(15,46,32,0.12)] hover:shadow-[0_14px_35px_rgba(15,46,32,0.18)]"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-3.5 h-3.5 text-emerald transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green animate-ping" />
        </div>
        <div className="flex items-center space-x-1.5 text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted group-hover:text-emerald font-medium transition-colors">
            Atelier WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}
