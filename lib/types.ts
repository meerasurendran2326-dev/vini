export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'rings' | 'pendants' | 'bracelets' | 'chains' | 'bespoke';
  price: number; // Current selling price in INR
  originalPrice: number; // MRP for discount calculations
  isFiftyPercentOffer: boolean;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  featured: boolean;
  bestseller: boolean;
  specifications: {
    material: string;
    purity: string;
    weight: string;
    finish: string;
    hallmark: string;
    dimensions?: string;
  };
  details: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  size?: string;
}

export interface CustomerSnapshot {
  fullName: string;
  email: string;
  phone: string;
  whatsappPhone?: string;
}

export interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerSnapshot;
  delivery: DeliveryAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'RAZORPAY' | 'CASH_ON_DELIVERY_TEST';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  status: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappPrefillText: string;
  supportEmail: string;
  supportPhone: string;
  bannerNotice: string;
  globalFiftyPercentActive: boolean;
  freeShippingThreshold: number;
  atelierAddress: string;
}
