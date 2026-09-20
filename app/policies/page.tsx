'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText } from 'lucide-react';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'authenticity' | 'privacy'>('shipping');

  return (
    <div className="bg-void min-h-screen text-ice-white pb-32">
      <div className="pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-steel/30 bg-graphite/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-sans uppercase tracking-monumental text-silver/60 block mb-2">
            Compliance & Client Protections
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ice-white font-normal">
            Store Policies & Trust
          </h1>
          <p className="mt-3 font-editorial italic text-base sm:text-lg text-silver/80 max-w-xl mx-auto">
            Clear, uncompromising guarantees regarding our solid sterling purity, insured courier delivery, and customer data security.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-12">
        {/* Policy Tabs */}
        <div className="flex border-b border-steel/50 overflow-x-auto scrollbar-none text-xs font-sans uppercase tracking-super-wide">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === 'shipping'
                ? 'border-bright-silver text-ice-white font-semibold'
                : 'border-transparent text-silver/60 hover:text-silver'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Insured Shipping</span>
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === 'returns'
                ? 'border-bright-silver text-ice-white font-semibold'
                : 'border-transparent text-silver/60 hover:text-silver'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Returns & Exchanges</span>
          </button>
          <button
            onClick={() => setActiveTab('authenticity')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === 'authenticity'
                ? 'border-bright-silver text-ice-white font-semibold'
                : 'border-transparent text-silver/60 hover:text-silver'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>925 Hallmark Guarantee</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === 'privacy'
                ? 'border-bright-silver text-ice-white font-semibold'
                : 'border-transparent text-silver/60 hover:text-silver'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy & Terms</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-10 space-y-6 text-xs sm:text-sm font-sans text-silver/85 leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-4 bg-carbon border border-steel/50 p-8 shadow-xl">
              <h3 className="font-display text-xl uppercase tracking-wider text-ice-white">
                Insured Pan-India Transit Protocol
              </h3>
              <p>
                All pieces dispatched from the VINI VICI VIDI atelier are shipped via dedicated high-value logistics partners (BlueDart Apex Security and Sequel Logistics).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-silver/80">
                <li><strong>Complimentary Courier:</strong> We provide 100% complimentary shipping on all orders throughout India.</li>
                <li><strong>Transit Insurance:</strong> Each shipment is fully covered against damage, loss, or theft during transit until physical signature of receipt.</li>
                <li><strong>Tamper-Evident Packaging:</strong> Pieces are enclosed within the signature obsidian magnetic box and sealed inside an armored serialized security pouch. Do not accept any package if the tamper seal has been severed.</li>
                <li><strong>Delivery Timelines:</strong> Metro cities receive delivery within 2 to 4 business days. Regional destinations within 3 to 6 business days.</li>
              </ul>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4 bg-carbon border border-steel/50 p-8 shadow-xl">
              <h3 className="font-display text-xl uppercase tracking-wider text-ice-white">
                7-Day Atelier Return & Exchange Window
              </h3>
              <p>
                We stand behind the physical substance and finishing of every silver piece we forge.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-silver/80">
                <li><strong>Standard Catalog Pieces:</strong> Eligible for return or exchange within 7 calendar days of confirmed delivery, provided the item is in unworn, original condition with all documentation.</li>
                <li><strong>Complimentary Return Pickup:</strong> We arrange a secure insured return pickup directly from your address.</li>
                <li><strong>Bespoke & Engraved Pieces:</strong> Pieces with custom intaglio initials, bespoke heraldry, or custom astrological charts are crafted uniquely for the patron and are final sale, but covered by our lifetime silversmith repair warranty.</li>
              </ul>
            </div>
          )}

          {activeTab === 'authenticity' && (
            <div className="space-y-4 bg-carbon border border-steel/50 p-8 shadow-xl">
              <h3 className="font-display text-xl uppercase tracking-wider text-ice-white">
                BIS 925 Hallmark & Lifetime Metallurgical Purity
              </h3>
              <p>
                Every single product cast by VINI VICI VIDI is guaranteed to contain a minimum of 92.5% pure elemental silver.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-silver/80">
                <li><strong>Government Hallmark:</strong> Stamped or laser-inscribed with the certified BIS 925 hallmark symbol.</li>
                <li><strong>Laboratory Purity Certificate:</strong> Accompanied by a certificate of authenticity detailing gross weight, net silver weight, and finishing protocol.</li>
                <li><strong>Zero Hazardous Metals:</strong> 100% free of nickel, lead, and cadmium, ensuring safe contact against sensitive skin.</li>
              </ul>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 bg-carbon border border-steel/50 p-8 shadow-xl">
              <h3 className="font-display text-xl uppercase tracking-wider text-ice-white">
                Guest Privacy & Payment Security
              </h3>
              <p>
                We respect client confidentiality. We do not sell, rent, or trade your personal information.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-silver/80">
                <li><strong>No Mandatory Accounts:</strong> We never force customer account creation or store user passwords.</li>
                <li><strong>Payment Encryption:</strong> All transactions are executed via 256-bit encrypted Razorpay protocols. We never store credit card numbers or banking PINs on our servers.</li>
                <li><strong>Communication Consent:</strong> Your WhatsApp and phone details are strictly used for consignment tracking updates and direct customer concierge requests.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
