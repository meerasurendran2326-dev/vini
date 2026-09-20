# Implementation Plan: VINI VICI VIDI — Premium Silver Collection E-Commerce Platform

Build a world-class, cinematic digital luxury showroom and complete guest e-commerce platform for **VINI VICI VIDI** based on the 4 comprehensive specification documents:
1. **Strict Website Design & Experience Document** (Liquid-chrome atmosphere, 7-stage cinematic opening, flashlight cursor, 3D interactive hero, architectural typography, 14 scroll scenes).
2. **Recommended Technology Stack + Security Architecture** (Next.js App Router, TypeScript, Tailwind CSS, Three.js / React Three Fiber, GSAP & Lenis smooth scroll, Framer Motion, guest cart, server-authoritative commerce, Razorpay verification, Shopify-like order lifecycle).
3. **Product Requirements Document (PRD)** (Guest checkout, 100+ product catalog foundation, 29 real client products, 50% offer promotion, "3 stocks left" real inventory urgency, WhatsApp concierge, order tracking, Royal Modern admin dashboard).
4. **Client Requirements Document** (B2B & B2C, India focus, Green & White brand accent with Dark Silver/Chrome palette).

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions**:
> 1. **Framework & Architecture**: Next.js 15 / React 19 (or stable React 18/19 with App Router) with Tailwind CSS, Lucide icons, Three.js / R3F for 3D silver jewellery canvas, Framer Motion, and Lenis for smooth scroll inertia.
> 2. **Guest-Only Commerce**: No user passwords or registration accounts on the customer path. Direct checkout with contact & delivery details.
> 3. **Data & Backend Architecture**: Robust server-side storage and API layer (with Prisma / SQLite / local persistent JSON or Supabase compatible ORM structure) ensuring atomic inventory updates, price immutability for historical orders, and server-calculated totals.
> 4. **Payment Gateway**: Razorpay integration with server-side order generation and signature verification, equipped with a seamless Test Mode / Sandbox simulator for instant end-to-end verification without requiring live banking credentials.
> 5. **Client Assets**: All 29 high-resolution client product photos in `pdt/` and editorial campaign photos in `inspo/` will be imported, optimized, and mapped into the catalog.

---

## Proposed System Design & Components

### 1. Visual & Interactive System (Strict Design Lock)
- **Palette Implementation**:
  - `Void` (`#050505`) - Hero void & global background
  - `Graphite` (`#0A0A0A`) - Primary sections & header
  - `Carbon` (`#111111`) - Cards & secondary surfaces
  - `Steel` (`#34383C`) - Subtle metallic borders & dividers
  - `Chrome` (`#6D7277`) - Specular highlights & accents
  - `Silver` (`#BFC3C7`) - Editorial subheadings & text accents
  - `Bright Silver` (`#D4D7DA`) - Highlights & silver luster
  - `Ice White` (`#F2F2F2`) - High-contrast headings & primary typography
  - `Signature Green` (`#6C8F72`) - Minimal brand accent for verified badges, subtle active states, and WhatsApp cues
- **Typography Hierarchy**:
  - Display: Monumental editorial grotesk (`Cinzel` / `Cabinet Grotesk` / high-impact sans)
  - Editorial: High-contrast luxury serif (`Cormorant Garamond` / `Playfair Display`)
  - UI: Clean, legible sans (`Inter` / `Plus Jakarta Sans`)
  - Micro-label: Compact uppercase sans with generous letter spacing (`0.7rem`, `tracking-[0.25em]`)
- **Signature Effects**:
  - **7-Stage Cinematic Vault Opening Sequence**: Black Void -> Silver Light sweep -> Brand Monogram & Name reveal -> 3D Hero Piece spotlight -> Masked typography -> "ENTER THE COLLECTION" magnetic CTA -> Smooth reveal into homepage (with skip button & reduced-motion support).
  - **Showroom Flashlight / Spotlight Cursor**: Fluid radial gradient spotlight following pointer movement with inertia, subtly illuminating metallic surfaces, silver textures, and border glints.
  - **3D Interactive Jewellery Studio**: Interactive WebGL / Three.js 3D silver ring / medallion with realistic metallic roughness, environment reflection mapping, camera drift, and pointer tilt.

### 2. Storefront Pages & Flows
- **Exhibition Homepage (`/`)**:
  - 14 choreographed exhibition scenes:
    1. Void & Atmospheric Ambiance
    2. Silver Light reveal
    3. Brand Identity & Statement
    4. 3D Hero Jewellery Studio
    5. Collection Categories (Rings, Pendants, Chains, Cuffs, Bespoke)
    6. Asymmetric Editorial Showcase (featuring 29 real products)
    7. 50% Royal Festive / Exclusive Offer metallic marquee
    8. Atelier Craftsmanship (Pinned imagery + metallurgical narrative)
    9. Featured Signature Pieces with real-time stock cues ("ONLY 3 LEFT")
    10. Hallmark 925 Certification & Authenticity guarantees
    11. Brand Heritage & Story
    12. Private Atelier Consultation / Shop CTA
    13. WhatsApp Concierge & VIP Inquiries
    14. Monolithic Architectural Footer
- **Shop & Discovery (`/shop`)**:
  - Filters by category, price slider, stock status, 50% offer filter.
  - Live instant search with autocomplete and debounced query.
  - Asymmetric editorial grid layout with quick-view modal, image switcher, and stock status.
- **Product Detail View (`/product/[id]`)**:
  - Multi-image zoom gallery with thumbnail switcher.
  - Interactive 3D / 360 viewer option.
  - Dynamic price display (MRP with strikethrough, discounted price, savings calculator).
  - Inventory-backed stock badge (e.g. "ONLY 3 LEFT" when stock <= 3).
  - Add to Cart, Instant Buy Now, and direct WhatsApp concierge inquiry button ("Ask about this piece" with pre-filled SKU).
  - Technical specs (925 Solid Sterling Silver, Gram weight, Dimensions, Hallmark stamp, Finish).
  - Collapsible luxury accordions: Craftsmanship, Insured Shipping, Lifetime Care.
  - Editorial "Curated With This Piece" recommendations.
- **Brand Story & Atelier (`/about`)**:
  - Dedicated brand heritage, master silversmiths, the purity of 925 sterling silver.
- **Editorial Lookbook Gallery (`/gallery`)**:
  - Curated high-fashion imagery gallery with full-screen lightbox.
- **Client Support & FAQ (`/faq`)**:
  - Categorized accordion covering orders, payments, silver maintenance, and custom engravings.
- **Concierge & Contact (`/contact`)**:
  - WhatsApp VIP chat integration, custom consultation booking form, email, phone, and Atelier location card.
- **Policies (`/policies`)**:
  - Shipping & insured transit, 7-day returns & exchanges, authentic hallmark guarantee, privacy & terms.
- **Order Tracking (`/track`)**:
  - Public order lookup using Order Number (`#VVV-...`) and Phone/Email to view live status timeline and delivery details.

### 3. Commerce & Security Engine
- **Slide-out Cart Drawer (`/cart`)**:
  - Accessible sitewide with backdrop blur, item adjustments, stock boundary validation, subtotal, 50% savings callout, and checkout CTA.
- **Guest Checkout (`/checkout`)**:
  - Seamless 2-step checkout without password/login:
    - Step 1: Customer info (Full name, Email, WhatsApp phone for tracking).
    - Step 2: Shipping address (Street, Landmark, City, State, PIN code across India).
    - Step 3: Server-side pricing verification (prices and discounts re-validated strictly on the server).
- **Payment & Order Creation (`/api/checkout`, `/api/orders`, `/api/payment/razorpay`)**:
  - Razorpay order creation endpoint (`POST /api/payment/razorpay/create-order`).
  - Razorpay signature verification (`POST /api/payment/razorpay/verify`).
  - Interactive Razorpay modal with seamless test gateway fallback for end-to-end purchasing.
  - Atomic stock reduction on confirmed payment.
  - Order snapshot persistence (locks in purchase-time price, quantities, address, and status).
- **Order Confirmation (`/order-confirmation/[orderId]`)**:
  - Visual invoice & order receipt with WhatsApp order confirmation button.

### 4. Admin Dashboard / Back Office (`/admin`)
- Royal Modern dark luxury UI with authenticated session gate.
- **Overview Analytics**: Total Revenue, Total Orders, Average Order Value, Active Inventory Units, Low Stock Alert counters, recent orders stream.
- **Product Management**: Add new product, edit existing product, set MRP, selling price, category, upload/select media from assets, toggle featured state.
- **Inventory Management**: Real-time stock editor, low-stock threshold setting, out-of-stock switcher. Changing stock to 3 immediately triggers "ONLY 3 LEFT" on storefront!
- **Promotions & Offers**: 50% Offer banner controller, promotional text modifier, promotional code engine.
- **Orders Pipeline (Shopify-like)**: Full order queue, search & filter by status, view detailed customer snapshot, update status (`NEW` -> `CONFIRMED` -> `PROCESSING` -> `PACKED` -> `SHIPPED` -> `DELIVERED` -> `CANCELLED`).
- **Store Settings**: WhatsApp support phone number, business email, shipping fee thresholds, banner announcements.

---

## Step-by-Step Implementation Strategy

### Step 1: Project Scaffolding & Setup
- Initialize Next.js with TypeScript, Tailwind CSS, App Router.
- Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`, `clsx`, `tailwind-merge`, `lenis`, `canvas-confetti`.
- Configure Tailwind with the exact design tokens (`void`, `graphite`, `carbon`, `steel`, `chrome`, `silver`, `bright-silver`, `ice-white`, `brand-green`).
- Set up custom fonts (Cinzel / Playfair / Inter) and luxury CSS styling.

### Step 2: Media Asset Migration & Catalog Seed
- Copy all 29 client product images from `pdt/` to `public/images/products/`.
- Copy all lookbook/editorial images from `inspo/` to `public/images/inspo/`.
- Create a comprehensive product catalog database (`lib/db/products.json` or SQLite) featuring all 29 client silver pieces with rich editorial descriptions, metal purity, pricing, categories (Rings, Necklaces, Bracelets, Chains, Earrings), and stock counts.

### Step 3: Visual & 3D Core Components
- Build the **7-stage Cinematic Opening Sequence** with skip control and smooth transition.
- Build the **Pointer Flashlight / Spotlight Cursor** component with inertia.
- Build the **3D Liquid Chrome & Jewellery Studio** component (Three.js procedural silver ring with metallic reflections and mouse interactivity).
- Build the smooth-scrolling wrapper (Lenis).

### Step 4: Storefront & Exhibition Experience
- Assemble the 14-scene Exhibition Homepage (`/`).
- Build the Navigation bar (minimal, transparent, glass-dark on scroll) with Cart icon counter, Search modal, and WhatsApp concierge shortcut.
- Build `/shop` with live filters, sorting, search, and responsive editorial layout.
- Build `/product/[id]` with high-res gallery, specs, stock counter, 50% offer badge, and WhatsApp inquiry CTA.
- Build `/about`, `/gallery`, `/faq`, `/contact`, `/policies`, `/track`.

### Step 5: Guest Checkout, Razorpay & Order Management
- Build Zustand/Context client cart store with localStorage synchronization and server validation.
- Build slide-out Cart Drawer.
- Build `/checkout` with address validation, price snapshotting, and Razorpay integration.
- Implement server-authoritative API routes:
  - `GET/POST /api/products`
  - `POST /api/checkout/validate`
  - `POST /api/payment/razorpay/create-order`
  - `POST /api/payment/razorpay/verify`
  - `GET /api/orders/[id]`
  - `GET/POST/PATCH /api/admin/*`
- Implement atomic stock decrement and Shopify-like status tracking.

### Step 6: Royal Modern Admin Portal (`/admin`)
- Build Admin authentication and layout.
- Build Dashboard stats, charts, and metrics.
- Build Product management table with edit modal (name, price, discount, category, stock).
- Build Inventory manager with low-stock alerts.
- Build Promotion manager (50% offer switch).
- Build Orders management pipeline with status progression buttons.
- Build Settings editor (WhatsApp number, policies).

### Step 7: Verification & Testing
- Test complete guest checkout flow from cart to order confirmation.
- Test server-side price immutability and stock updates (verifying "ONLY 3 LEFT" appears when stock is 3).
- Test Razorpay payment verification flow.
- Test Admin dashboard product/inventory/order status updates.
- Test mobile responsiveness and flashlight/3D fallbacks.

---

## Verification Plan

### Automated & Unit Checks
- Run TypeScript compilation (`npm run build` or `npx tsc --noEmit`) to ensure zero type errors.
- Run Next.js production build to verify SSR/SSG and bundle integrity.
- Run API route tests for checkout validation, order creation, and stock updates.

### Manual Verification Flow
1. **Cinematic Opening**: Verify the 7 stages open smoothly on initial visit, skippable with one click, transition seamlessly to homepage.
2. **Flashlight Effect**: Move mouse across hero and product sections to confirm subtle specular metallic illumination.
3. **3D Jewellery Studio**: Interact with the 3D silver jewellery model (rotate, tilt, inspect reflection).
4. **Product Catalog**: Browse categories in `/shop`, filter by 50% offer, search products by keyword.
5. **Real-Time Stock & Urgency**: Adjust a product's stock in `/admin` to 2; verify the product page and card immediately display "ONLY 2 LEFT".
6. **Guest Checkout**: Add product to cart, open drawer, go to `/checkout`, enter shipping details, trigger Razorpay payment, verify payment verification succeeds, stock reduces by 1, order appears in `/admin` with status `CONFIRMED`.
7. **Order Lifecycle**: In `/admin/orders`, transition the order from `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`, and verify the customer can track it at `/track`.
8. **WhatsApp Concierge**: Click "Ask about this piece" on any product and verify the prefilled WhatsApp URL contains the exact product name and SKU.
