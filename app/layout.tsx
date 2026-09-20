import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import Navbar from '@/components/luxury/Navbar';
import Footer from '@/components/luxury/Footer';
import FlashlightCursor from '@/components/luxury/FlashlightCursor';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppFloating from '@/components/luxury/WhatsAppFloating';
import GothicBackground from '@/components/luxury/GothicBackground';

export const metadata: Metadata = {
  title: 'VINI VICI VIDI | Premium Silver Collection',
  description: 'A cinematic digital showroom for hand-crafted 925 Solid Sterling Silver rings, pendants, heavy chains, and bespoke signets. Insured delivery across India.',
  keywords: ['925 silver', 'sterling silver jewellery', 'sovereign ring', 'bespoke signet', 'silver chains India', 'vini vici vidi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-void">
      <body className="bg-transparent text-ice-white antialiased min-h-screen flex flex-col relative selection:bg-moss selection:text-ice-white">
        {/* Purely Decorative Gothic + Cinematic Layer */}
        <GothicBackground />

        <CartProvider>
          {/* Spotlight Cursor Effect with Inertia */}
          <FlashlightCursor />

          {/* Luxury Navigation */}
          <Navbar />

          {/* Slide-out Cart Drawer */}
          <CartDrawer />

          {/* Page Content */}
          <main className="flex-1 pt-[95px] relative z-10">
            {children}
          </main>

          {/* Persistent VIP WhatsApp Support Pathway */}
          <WhatsAppFloating />

          {/* Architectural Monolithic Footer */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
