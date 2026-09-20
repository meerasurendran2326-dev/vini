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
        className="group flex items-center space-x-2.5 px-3.5 py-2 bg-[#0A0F0C]/85 hover:bg-[#0A0F0C] border border-[rgba(242,242,242,0.12)] hover:border-[#6C8F72]/60 text-[#F2F2F2] rounded-full backdrop-blur-md transition-all duration-300 shadow-2xl"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-3.5 h-3.5 text-[#6C8F72] transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#6C8F72] animate-ping" />
        </div>
        <div className="flex items-center space-x-1.5 text-left">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#9AA39D] group-hover:text-[#F2F2F2] transition-colors">
            Atelier WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}
