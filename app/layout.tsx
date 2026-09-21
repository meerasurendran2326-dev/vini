import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import Navbar from '@/components/luxury/Navbar';
import Footer from '@/components/luxury/Footer';
import FlashlightCursor from '@/components/luxury/FlashlightCursor';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppFloating from '@/components/luxury/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'VINI VICI VIDI | Royal Silver Collection',
  description: 'A royal, classy light luxury digital showroom for hand-crafted 925 Solid Sterling Silver rings, pendants, heavy chains, and bespoke signets. Insured delivery across India.',
  keywords: ['925 silver', 'sterling silver jewellery', 'sovereign ring', 'bespoke signet', 'silver chains India', 'vini vici vidi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-ivory text-ink">
      <body className="bg-ivory text-ink antialiased min-h-screen flex flex-col relative selection:bg-green/30 selection:text-forest">
        <CartProvider>
          {/* Subtle Silver Light Cursor Sheen */}
          <FlashlightCursor />

          {/* Luxury Navigation */}
          <Navbar />

          {/* Slide-out Cart Drawer */}
          <CartDrawer />

          {/* Page Content */}
          <main className="flex-1 pt-[108px] relative z-10">
            {children}
          </main>

          {/* Persistent VIP WhatsApp Support Pathway */}
          <WhatsAppFloating />

          {/* Architectural Monolithic Footer in Deep Emerald */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
