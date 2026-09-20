# VINI VICI VIDI — Premium Silver Collection

A cinematic, luxury e-commerce website for **Vini vici vidi**, a premium silver jewellery brand serving India. The site pairs an immersive, art-directed storefront (3D, liquid-chrome atmosphere, flashlight cursor, editorial typography) with a reliable, server-authoritative commerce backend (guest checkout, Razorpay, live inventory, admin control).

> **Status:** Planning and specification complete. Development has not started. This repository currently holds the project documents in [`source/`](./source).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Planned Project Structure](#planned-project-structure)
- [Getting Started](#getting-started)
- [Order Lifecycle](#order-lifecycle)
- [Security](#security)
- [Documentation](#documentation)
- [Open Decisions](#open-decisions)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

| | |
|---|---|
| **Business** | Vini vici vidi (jewellery) |
| **Product** | Premium Silver Collection e-commerce website |
| **Market** | India |
| **Customer model** | B2C and B2B |
| **Catalogue size** | 100+ products, organised by category |
| **Payments** | Razorpay |
| **Customer accounts** | Not required. Guest checkout only |
| **Support channel** | WhatsApp |

The experience should feel like entering a private silver exhibition, not a standard jewellery store. The visual layer is highly custom; the commerce layer underneath stays predictable, validated and secure.

---

## Key Features

**Storefront and experience**
- Cinematic opening sequence (black void → silver light → brand reveal → hero piece → enter), skippable and respectful of reduced-motion settings
- Liquid-chrome background and physically plausible 3D hero jewellery
- Pointer-driven flashlight / spotlight effect on selected sections
- Scroll-driven, exhibition-style homepage with large editorial typography
- Asymmetric, editorial product gallery that shows many products on the homepage
- Product pages with zoom, secondary views, specifications, and trust information
- Search, category browsing, gallery, About, FAQ, Contact and policy pages
- Responsive design with a lighter 3D and interaction profile on tablet and mobile

**Commerce**
- Guest checkout (contact → delivery → Razorpay payment → confirmation)
- Slide-out cart drawer with quantity, discount, subtotal, shipping and total
- Server-verified Razorpay payments and webhooks
- Order snapshots that preserve the purchase-time price, discount and totals
- Atomic inventory updates so two buyers cannot take the last unit

**Merchandising**
- Admin-controlled **50% OFFER** messaging, shown only where the offer applies
- Inventory-driven low-stock messaging (for example, "ONLY 3 LEFT"), generated from real stock and never hard-coded
- Backend-driven prices that update without a code deployment

**Support**
- WhatsApp integration with contextual calls to action (for example, "Ask about this piece", "Need help?")
- Admin-configurable WhatsApp number and message templates

**Admin back office**
- Products, pricing, inventory, promotions, orders, content, media and settings
- Order search, filtering and status management
- Audit trail for price, stock, promotion and order-status changes

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS + custom CSS |
| 3D | Three.js, React Three Fiber, Drei, postprocessing |
| Animation | GSAP + ScrollTrigger, Lenis (smooth scroll), Framer Motion |
| State | Zustand (guest cart) |
| Database | PostgreSQL |
| Backend platform | Supabase (database, storage, realtime, admin auth) |
| ORM | Drizzle ORM |
| Payments | Razorpay |
| Messaging | WhatsApp link / business integration |
| Hosting | Vercel |
| Version control | GitHub |
| Monitoring | Sentry |

---

## Planned Project Structure

```
vini-vici-vidi/
├── app/
│   ├── (store)/          # Public storefront
│   ├── admin/            # Private admin application
│   └── api/              # Server routes
├── components/
│   ├── luxury/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── three/
│   ├── scenes/
│   ├── materials/
│   ├── environments/
│   └── effects/
├── animations/
│   ├── hero/
│   ├── scroll/
│   └── transitions/
├── lib/
│   ├── supabase/
│   ├── razorpay/
│   ├── pricing/
│   ├── inventory/
│   ├── orders/
│   └── whatsapp/
├── db/
├── public/
├── styles/
└── source/               # Project specification documents
```

---

## Getting Started

The application has not been scaffolded yet, so these are the prerequisites for when development begins.

**Prerequisites**
- Node.js (current LTS)
- A Supabase project
- A Razorpay account (test mode for development)
- A Vercel account for deployment

**Environment variables** (server-only, never commit `.env` files, never prefix secrets with `NEXT_PUBLIC_`):

```
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SENTRY_DSN=
```

Installation and run instructions will be added here once the app is scaffolded.

---

## Order Lifecycle

```
NEW → CONFIRMED → PROCESSING → PACKED → SHIPPED → OUT FOR DELIVERY → DELIVERED
                                   (CANCELLED / REFUNDED supported)
```

Checkout flow: the server calculates the total, creates the Razorpay order, the customer pays, and the server verifies the payment and webhook. The order is then confirmed, inventory is updated, and the order appears in the admin queue.

Final status labels may be adjusted to the business workflow.

---

## Security

The browser is treated as untrusted. The five highest-priority controls:

1. Server-side validation of price, stock, discount and order total
2. Razorpay server-side payment verification and trusted webhook handling
3. Supabase Row Level Security plus strict admin authorisation on every admin route and API
4. Secrets kept in server-only environment variables, with credential rotation if exposed
5. Input validation, rate limiting, audit logging and pre-launch security testing

The frontend must never decide that a payment succeeded.

---

## Documentation

All specifications live in [`source/`](./source):

| Document | Description |
|---|---|
| [PRD](./source/prd.pdf) | Consolidated product requirements: scope, functional requirements, data model, API surface, acceptance criteria, delivery plan |
| [Design Document](./source/_Design_Document.pdf) | Strict design system: palette, typography, cinematic entry, 3D and flashlight system, scroll scenes, acceptance checklist |
| [Tech Stack and Security Architecture](./source/_Tech_Stack_and_Security_Architecture.pdf) | Recommended stack, system architecture, Razorpay flow, admin security, pre-launch security tests |
| [Client Requirements](./source/Client_Requirements.pdf) | Original client questionnaires and confirmed updates |

---

## Open Decisions

Items the documents flag as still to be confirmed with the client:

- Exact categories and subcategories for the silver collection
- Delivery zones and shipping cost rules
- Whether displayed prices include tax
- Order confirmation channel (email, WhatsApp, SMS)
- Return, refund, cancellation and exchange policies
- Scope of the 50% offer (sitewide, category, product or campaign)
- Low-stock display rule (always when stock is 3 or fewer, or only when enabled)
- Target freshness for "real-time" price updates
- Final logo, fonts, imagery and brand guidelines

---

## License

To be decided. All rights reserved by Vini vici vidi until a license is added.

## Contact

- **Business:** Vini vici vidi
- **Email:** _to be added_
- **WhatsApp:** _to be added_
