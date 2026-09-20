import fs from 'fs';
import path from 'path';
import { Product, Order, StoreSettings, OrderStatus } from './types';
import { initialProducts, initialSettings } from './data/initialProducts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}

// In-memory fallback
let memoryDb: DatabaseSchema = {
  products: initialProducts,
  orders: [],
  settings: initialSettings,
};

function ensureDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        products: initialProducts,
        orders: [
          {
            id: "ord-mock-01",
            orderNumber: "VVV-89421",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            customer: {
              fullName: "Devika Singhania",
              email: "devika.s@example.com",
              phone: "+91 98201 12345",
              whatsappPhone: "+91 98201 12345"
            },
            delivery: {
              addressLine1: "Flat 14B, Imperial Towers, Altamount Road",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400026",
              country: "India"
            },
            items: [
              {
                productId: "vvv-pdt-01",
                sku: "VVV-RNG-01",
                name: "Aethelgard Hand-Carved Sovereign Ring",
                price: 4950,
                originalPrice: 9900,
                quantity: 1,
                image: "/images/products/pdt-1.jpeg",
                size: "US 10"
              }
            ],
            subtotal: 9900,
            discount: 4950,
            shippingFee: 0,
            total: 4950,
            paymentMethod: "RAZORPAY",
            paymentId: "pay_RzpMock_091823",
            razorpayOrderId: "order_mock_9812",
            status: "PROCESSING",
            statusTimeline: [
              { status: "PENDING_PAYMENT", timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), note: "Checkout initialized" },
              { status: "PAID", timestamp: new Date(Date.now() - 3600000 * 24 + 120000).toISOString(), note: "Razorpay payment verified" },
              { status: "CONFIRMED", timestamp: new Date(Date.now() - 3600000 * 24 + 180000).toISOString(), note: "Order locked and hallmarked stock reserved" },
              { status: "PROCESSING", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), note: "Under fine inspection at atelier" }
            ]
          }
        ],
        settings: initialSettings
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      memoryDb = initial;
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryDb = parsed;
    return parsed;
  } catch (err) {
    console.warn('Filesystem DB error, using in-memory store:', err);
    return memoryDb;
  }
}

function saveDb(data: DatabaseSchema) {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save to db.json, kept in-memory:', err);
  }
}

export async function getProducts(): Promise<Product[]> {
  const db = ensureDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDb();
  return db.products.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = ensureDb();
  return db.products.find(p => p.slug === slug) || null;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = ensureDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.products[index];
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const db = ensureDb();
  const newProduct: Product = {
    ...product,
    id: `vvv-pdt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.products.unshift(newProduct);
  saveDb(db);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = ensureDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return false;
  db.products.splice(index, 1);
  saveDb(db);
  return true;
}

export async function getOrders(): Promise<Order[]> {
  const db = ensureDb();
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = ensureDb();
  return db.orders.find(o => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusTimeline'>): Promise<Order> {
  const db = ensureDb();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `VVV-${randNum}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    statusTimeline: [
      {
        status: orderData.status,
        timestamp: now,
        note: orderData.status === 'PAID' || orderData.status === 'CONFIRMED'
          ? 'Payment successfully verified by server'
          : 'Order initiated'
      }
    ]
  };

  // Atomically decrement stock
  for (const item of newOrder.items) {
    const pIdx = db.products.findIndex(p => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
      db.products[pIdx].updatedAt = now;
    }
  }

  db.orders.unshift(newOrder);
  saveDb(db);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, note: string): Promise<Order | null> {
  const db = ensureDb();
  const order = db.orders.find(o => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  order.statusTimeline.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note
  });

  saveDb(db);
  return order;
}

export async function getSettings(): Promise<StoreSettings> {
  const db = ensureDb();
  return db.settings;
}

export async function updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const db = ensureDb();
  db.settings = {
    ...db.settings,
    ...updates
  };
  saveDb(db);
  return db.settings;
}
