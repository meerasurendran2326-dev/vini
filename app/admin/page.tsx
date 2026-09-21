'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Search,
  Sliders,
  DollarSign,
  Truck,
  MessageCircle,
  Eye
} from 'lucide-react';
import { Product, Order, StoreSettings, OrderStatus } from '@/lib/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'promotions' | 'settings'>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Order status filter
  const [orderFilter, setOrderFilter] = useState<string>('ALL');

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, setRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (ordRes.success) setOrders(ordRes.orders);
      if (setRes.success) setSettings(setRes.settings);
    } catch (err) {
      console.warn('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check local session
    if (sessionStorage.getItem('vvv_admin_auth') === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'vinivici2026' || passcode === 'admin') {
      sessionStorage.setItem('vvv_admin_auth', 'true');
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Invalid Atelier Passcode. Default access: admin or vinivici2026');
    }
  };

  const handleQuickStockUpdate = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
        notify(`Stock for ${data.product.name} updated to ${newStock} units`);
      }
    } catch {
      notify('Failed to update stock');
    }
  };

  const handleQuickPriceUpdate = async (productId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
        notify(`Price updated to ₹${newPrice.toLocaleString('en-IN')}`);
      }
    } catch {
      notify('Failed to update price');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isCreatingProduct) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          notify(`Created product "${data.product.name}"`);
          setEditingProduct(null);
          setIsCreatingProduct(false);
        }
      } else {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
          notify(`Updated product "${data.product.name}"`);
          setEditingProduct(null);
        }
      }
    } catch {
      notify('Failed to save product');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
        notify(`Order status moved to ${newStatus}`);
      }
    } catch {
      notify('Failed to update order state');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        notify('Concierge & Storefront settings updated');
      }
    } catch {
      notify('Failed to save settings');
    }
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-ink selection:bg-sage/30 selection:text-forest">
        <div className="w-full max-w-md bg-white border border-line p-8 shadow-md space-y-6 rounded-[2px]">
          <div className="text-center space-y-2">
            <span className="font-sans font-bold text-2xl tracking-widest text-ink">
              VINI VICI VIDI
            </span>
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
              Royal Modern Back Office
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-4 font-mono">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                Atelier Access Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. admin)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-pearl border border-line p-3 text-xs text-ink placeholder-muted focus:outline-none focus:border-emerald font-mono rounded-sm"
              />
              <span className="text-[9px] text-muted mt-1 block">
                Demo access code: <code className="text-emerald font-bold">admin</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-sm"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-[11px] font-mono text-muted hover:text-ink uppercase tracking-wider">
              ← Return to Public Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived dashboard metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const fiftyPercentOfferCount = products.filter((p) => p.isFiftyPercentOffer).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="bg-ivory min-h-screen text-ink pb-32 selection:bg-sage/30 selection:text-forest">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-green text-ink px-5 py-3 shadow-xl flex items-center space-x-3 text-xs font-mono tracking-wider uppercase animate-fade-in backdrop-blur-md rounded-sm">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-white border-b border-line px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-sans font-medium text-lg tracking-wider text-ink uppercase">
            VINI VICI VIDI • Back Office
          </span>
          <span className="text-[9px] font-mono px-2.5 py-0.5 bg-pearl border border-green text-emerald uppercase tracking-widest rounded-full font-semibold">
            Royal Modern v1.0
          </span>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 text-muted hover:text-ink"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="uppercase tracking-wider text-[10px]">Sync DB</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 text-emerald hover:underline uppercase tracking-wider text-[10px] font-semibold"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="border-b border-line bg-pearl px-6 sm:px-10 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs font-mono uppercase tracking-[0.14em]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'dashboard' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'products' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'inventory' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <span>Inventory & Urgency</span>
          {lowStockCount > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald text-white text-[9px] rounded-full">
              {lowStockCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors flex items-center space-x-1.5 ${
            activeTab === 'orders' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <span>Orders Pipeline</span>
          <span className="px-1.5 py-0.2 bg-pearl border border-line text-ink text-[9px] rounded-full">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'promotions' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          50% Offers
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-4 px-4 border-b-2 font-medium transition-colors ${
            activeTab === 'settings' ? 'border-emerald text-emerald font-semibold' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Concierge Settings
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-10">
        
        {/* =========================================================================
            TAB 1: DASHBOARD OVERVIEW
        ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-line rounded-[2px] shadow-sm">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted">
                  Gross Revenue
                </div>
                <div className="font-mono text-3xl font-bold text-ink mt-2">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] font-mono text-emerald mt-1 font-semibold">
                  100% Server Verified
                </div>
              </div>

              <div className="p-6 bg-white border border-line rounded-[2px] shadow-sm">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted">
                  Total Orders
                </div>
                <div className="font-mono text-3xl font-bold text-ink mt-2">
                  {orders.length}
                </div>
                <div className="text-[10px] font-mono text-muted mt-1">
                  Guest-First Checkout
                </div>
              </div>

              <div className="p-6 bg-white border border-line rounded-[2px] shadow-sm">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted">
                  Low Stock Urgency Cues
                </div>
                <div className="font-mono text-3xl font-bold text-emerald mt-2">
                  {lowStockCount}
                </div>
                <div className="text-[10px] font-mono text-emerald mt-1">
                  Triggering "ONLY X LEFT"
                </div>
              </div>

              <div className="p-6 bg-white border border-line rounded-[2px] shadow-sm">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted">
                  Active 50% Offers
                </div>
                <div className="font-mono text-3xl font-bold text-ink mt-2">
                  {fiftyPercentOfferCount}
                </div>
                <div className="text-[10px] font-mono text-muted mt-1">
                  Campaigns active
                </div>
              </div>
            </div>

            {/* Recent Orders Stream */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-line">
                <h3 className="font-sans text-xl uppercase tracking-tight text-ink font-medium">
                  Recent Orders Queue
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono uppercase tracking-wider text-emerald hover:underline font-semibold"
                >
                  Manage All Orders →
                </button>
              </div>

              <div className="overflow-x-auto border border-line rounded-[2px] shadow-sm">
                <table className="w-full text-left text-xs font-sans divide-y divide-line">
                  <thead className="bg-pearl text-muted uppercase text-[10px] font-mono tracking-wider">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Recipient</th>
                      <th className="p-4">City / State</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-pearl/40">
                        <td className="p-4 font-mono font-medium text-emerald">
                          {o.orderNumber}
                        </td>
                        <td className="p-4 text-ink">
                          {o.customer.fullName}
                          <span className="block text-[10px] text-muted">{o.customer.phone}</span>
                        </td>
                        <td className="p-4 text-muted">
                          {o.delivery.city}, {o.delivery.state}
                        </td>
                        <td className="p-4 text-muted">
                          {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="p-4 font-mono font-bold text-ink">
                          ₹{o.total.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider border border-line bg-pearl text-ink rounded">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="text-emerald hover:underline text-[11px] font-mono uppercase tracking-wider font-semibold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCTS MANAGER
        ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-line">
              <div>
                <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium">
                  Silver Collection Archive ({products.length})
                </h3>
                <p className="text-xs font-sans text-muted mt-0.5">
                  Update selling prices, MRPs, categories, and 50% offer status. Changes reflect immediately on storefront.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingProduct(true);
                  setEditingProduct({
                    id: '',
                    sku: `VVV-${Date.now().toString().slice(-4)}`,
                    name: '',
                    slug: '',
                    tagline: '',
                    description: '',
                    category: 'rings',
                    price: 3500,
                    originalPrice: 7000,
                    isFiftyPercentOffer: true,
                    stock: 5,
                    lowStockThreshold: 3,
                    images: ['/images/products/pdt-1.jpeg'],
                    featured: true,
                    bestseller: false,
                    specifications: {
                      material: 'Solid Sterling Silver',
                      purity: '925 Certified',
                      weight: '12.0 grams',
                      finish: 'Mirror Chrome Polish',
                      hallmark: 'BIS 925 Hallmark',
                    },
                    details: ['Handcrafted in India', 'Includes presentation vault'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }}
                className="px-4 py-2.5 bg-emerald hover:bg-forest text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold flex items-center space-x-2 rounded-[2px] shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Silver Piece</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-line rounded-[2px] shadow-sm">
              <table className="w-full text-left text-xs font-sans divide-y divide-line">
                <thead className="bg-pearl text-muted uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="p-4">Piece</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Current Price</th>
                    <th className="p-4">Original MRP</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">50% Offer</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-pearl/40">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="w-12 h-14 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
                          <img src={p.images[0] || '/images/products/pdt-1.jpeg'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-ink">{p.name}</div>
                          <div className="text-[10px] text-muted font-editorial italic">{p.tagline}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-muted">{p.sku}</td>
                      <td className="p-4 uppercase text-[10px] font-mono tracking-wider text-muted">{p.category}</td>
                      <td className="p-4 font-mono font-bold text-ink">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-mono text-muted line-through">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono px-2 py-0.5 text-xs rounded ${
                            p.stock <= p.lowStockThreshold
                              ? 'bg-pearl text-emerald border border-green font-bold'
                              : 'text-muted'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                            p.isFiftyPercentOffer ? 'text-emerald' : 'text-muted'
                          }`}
                        >
                          {p.isFiftyPercentOffer ? 'Active (50%)' : 'Standard'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct({ ...p });
                          }}
                          className="p-1.5 text-muted hover:text-emerald"
                          title="Edit Piece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: INVENTORY & URGENCY CONTROL
        ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-line">
              <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium">
                Live Inventory & Scarcity Controls
              </h3>
              <p className="text-xs font-sans text-muted mt-1 leading-relaxed">
                Demonstrating PRD Requirement: Changing any stock count to <strong>3, 2, or 1</strong> immediately drives the "ONLY X LEFT" urgency message on the public storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const isUrgent = p.stock > 0 && p.stock <= p.lowStockThreshold;
                return (
                  <div
                    key={p.id}
                    className={`p-5 bg-white border transition-colors rounded-[2px] shadow-sm ${
                      isUrgent ? 'border-emerald shadow-md' : 'border-line'
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="w-14 h-16 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
                        <img src={p.images[0] || '/images/products/pdt-1.jpeg'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs uppercase font-medium text-ink line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-muted mt-0.5">
                          SKU: {p.sku}
                        </div>
                        {isUrgent && (
                          <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-emerald font-bold animate-pulse">
                            Triggering: "ONLY {p.stock} LEFT"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                        Current Physical Units:
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, Math.max(0, p.stock - 1))}
                          className="w-7 h-7 bg-pearl border border-line text-ink hover:border-emerald flex items-center justify-center font-mono text-sm rounded-sm"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-ink w-8 text-center">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, p.stock + 1)}
                          className="w-7 h-7 bg-pearl border border-line text-ink hover:border-emerald flex items-center justify-center font-mono text-sm rounded-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2 font-mono">
                      <button
                        onClick={() => handleQuickStockUpdate(p.id, 3)}
                        className="flex-1 py-1 bg-pearl hover:bg-white border border-line text-[9px] uppercase tracking-wider text-emerald font-semibold rounded-sm"
                      >
                        Set to 3 (Urgency)
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(p.id, 10)}
                        className="flex-1 py-1 bg-pearl hover:bg-white border border-line text-[9px] uppercase tracking-wider text-muted rounded-sm"
                      >
                        Restock (10)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ORDERS LIFECYCLE
        ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium">
                  Consignment & Order Operations
                </h3>
                <p className="text-xs font-sans text-muted mt-0.5">
                  Shopify-like lifecycle: Advance orders through processing, vault packing, dispatch, and final delivery.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2 bg-white border border-line px-3 py-1.5 text-xs text-muted rounded-[2px]">
                <span>Filter:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-transparent text-ink focus:outline-none uppercase font-mono tracking-wider cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-line rounded-[2px] shadow-sm">
              <table className="w-full text-left text-xs font-sans divide-y divide-line">
                <thead className="bg-pearl text-muted uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Client Contact</th>
                    <th className="p-4">Delivery PIN</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Gateway ID</th>
                    <th className="p-4">Current State</th>
                    <th className="p-4 text-right">Lifecycle Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-pearl/40">
                      <td className="p-4 font-mono font-medium text-emerald">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 text-muted text-[11px] font-mono">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4 text-ink">
                        <div>{order.customer.fullName}</div>
                        <div className="text-[10px] text-muted">{order.customer.phone}</div>
                      </td>
                      <td className="p-4 text-muted">
                        {order.delivery.city} ({order.delivery.pincode})
                      </td>
                      <td className="p-4 font-mono font-bold text-ink">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-muted">
                        {order.paymentId || 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-[9px] uppercase font-mono tracking-wider border border-line bg-pearl text-ink rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-pearl border border-line hover:border-emerald text-ink text-[10px] font-mono uppercase tracking-wider rounded-sm"
                        >
                          Details & Timeline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: 50% PROMOTIONS & OFFERS
        ========================================================================= */}
        {activeTab === 'promotions' && (
          <div className="space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-line">
              <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium">
                50% Royal Celebration Offer Controller
              </h3>
              <p className="text-xs font-sans text-muted mt-1">
                Toggle the 50% offer on individual pieces or enable the global promotional announcement marquee.
              </p>
            </div>

            <div className="p-6 bg-white border border-line space-y-4 rounded-[2px] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.14em] font-mono text-ink font-semibold">
                    Global Sitewide 50% Campaign Active
                  </h4>
                  <p className="text-[11px] font-sans text-muted mt-0.5">
                    Displays the top metallic marquee and highlights promotional badges across discovery.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!settings) return;
                    const nextVal = !settings.globalFiftyPercentActive;
                    setSettings({ ...settings, globalFiftyPercentActive: nextVal });
                    await fetch('/api/settings', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ globalFiftyPercentActive: nextVal }),
                    });
                    notify(`50% campaign is now ${nextVal ? 'ACTIVE' : 'PAUSED'}`);
                  }}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold border rounded-sm ${
                    settings?.globalFiftyPercentActive
                      ? 'bg-pearl border-green text-emerald'
                      : 'bg-pearl border-line text-muted'
                  }`}
                >
                  {settings?.globalFiftyPercentActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Quick Bulk Toggle for Products */}
            <div className="space-y-4 pt-4">
              <h4 className="font-sans text-lg uppercase tracking-tight text-ink font-medium">
                Per-Product 50% Offer Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="p-4 bg-white border border-line flex items-center justify-between rounded-[2px] shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-12 bg-pearl border border-line overflow-hidden flex-shrink-0 rounded-sm">
                        <img src={p.images[0] || '/images/products/pdt-1.jpeg'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs uppercase font-medium text-ink line-clamp-1">{p.name}</div>
                        <div className="text-[10px] font-mono text-muted">₹{p.price} (MRP: ₹{p.originalPrice})</div>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        const next = !p.isFiftyPercentOffer;
                        await fetch(`/api/products/${p.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isFiftyPercentOffer: next }),
                        });
                        setProducts((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, isFiftyPercentOffer: next } : item))
                        );
                        notify(`Toggled 50% offer for ${p.name}`);
                      }}
                      className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-sm ${
                        p.isFiftyPercentOffer
                          ? 'bg-pearl border-green text-emerald font-semibold'
                          : 'bg-pearl border-line text-muted'
                      }`}
                    >
                      {p.isFiftyPercentOffer ? '50% On' : 'Standard'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CONCIERGE & STORE SETTINGS
        ========================================================================= */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl font-mono">
            <div className="pb-4 border-b border-line">
              <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium">
                Concierge & Store Settings
              </h3>
              <p className="text-xs font-sans text-muted mt-1">
                Configure the WhatsApp customer inquiry pathways and storefront contact references.
              </p>
            </div>

            <div className="p-6 bg-white border border-line space-y-4 rounded-[2px] shadow-sm">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                  WhatsApp Concierge Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-pearl border border-line p-3 text-xs text-ink font-mono focus:outline-none focus:border-emerald rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                  Default WhatsApp Inquiry Message Prefill
                </label>
                <textarea
                  rows={3}
                  value={settings.whatsappPrefillText}
                  onChange={(e) => setSettings({ ...settings, whatsappPrefillText: e.target.value })}
                  className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald resize-none rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                  Top Header Announcement Banner Text
                </label>
                <input
                  type="text"
                  value={settings.bannerNotice}
                  onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                  className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Concierge Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full bg-pearl border border-line p-3 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors rounded-[2px] shadow-sm"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-forest/60 backdrop-blur-md" onClick={() => setEditingProduct(null)} />
          <div className="relative w-full max-w-2xl bg-white border border-line p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 rounded-[2px]">
            <div className="flex justify-between items-center pb-4 border-b border-line">
              <h3 className="font-sans text-xl uppercase tracking-tight text-ink font-medium">
                {isCreatingProduct ? 'Create New Silver Piece' : `Edit Piece: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-muted hover:text-ink">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      })
                    }
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink font-mono focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full bg-pearl border border-line p-2.5 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Selling Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink font-mono focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Original Price (MRP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink font-mono focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink font-mono focus:outline-none focus:border-emerald rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-pearl border border-line p-2.5 text-xs text-ink focus:outline-none focus:border-emerald rounded-sm"
                  >
                    <option value="rings">Sovereign Rings</option>
                    <option value="pendants">Liquid Pendants</option>
                    <option value="bracelets">Torques & Cuffs</option>
                    <option value="chains">Byzantine Chains</option>
                    <option value="bespoke">Bespoke Artefacts</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6 pt-5">
                  <label className="flex items-center space-x-2 text-xs font-mono text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFiftyPercentOffer}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFiftyPercentOffer: e.target.checked })}
                      className="accent-emerald"
                    />
                    <span>50% Offer Flag</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-mono text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="accent-emerald"
                    />
                    <span>Featured In Hero</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-pearl border border-line p-2.5 text-xs text-ink focus:outline-none focus:border-emerald resize-none rounded-sm font-sans"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-line text-xs uppercase tracking-wider text-muted hover:text-ink rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald hover:bg-forest text-white font-mono text-xs uppercase tracking-[0.14em] font-semibold rounded-sm shadow-sm"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail & Status Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-forest/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl bg-white border border-line p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 rounded-[2px]">
            <div className="flex justify-between items-start pb-4 border-b border-line">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
                  Order Management
                </span>
                <h3 className="font-sans text-2xl uppercase tracking-tight text-ink font-medium mt-1">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-ink">
                ✕
              </button>
            </div>

            {/* Lifecycle Progression Buttons */}
            <div className="p-4 bg-pearl border border-line space-y-3 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-emerald font-semibold">
                Lifecycle Progression
              </span>
              <div className="flex flex-wrap gap-2 pt-1 font-mono">
                {(['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleOrderStatusUpdate(selectedOrder.id, st)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border rounded-sm transition-all ${
                      selectedOrder.status === st
                        ? 'bg-emerald text-white border-emerald font-bold shadow-sm'
                        : 'bg-white border-line text-muted hover:text-ink'
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-muted">
              <div className="p-4 bg-pearl border border-line space-y-1 rounded-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald font-semibold">
                  Customer
                </div>
                <div className="font-medium text-ink">{selectedOrder.customer.fullName}</div>
                <div>{selectedOrder.customer.email}</div>
                <div>{selectedOrder.customer.phone}</div>
              </div>

              <div className="p-4 bg-pearl border border-line space-y-1 rounded-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald font-semibold">
                  Delivery Destination
                </div>
                <div>{selectedOrder.delivery.addressLine1}</div>
                <div>{selectedOrder.delivery.city}, {selectedOrder.delivery.state} - {selectedOrder.delivery.pincode}</div>
                <div>Payment ID: {selectedOrder.paymentId || 'N/A'}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-muted font-semibold">
                Purchased Pieces ({selectedOrder.items.length})
              </h4>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-pearl border border-line text-xs font-sans rounded-sm">
                  <div>
                    <span className="font-medium text-ink uppercase">{it.name}</span>
                    <span className="block text-[10px] text-muted font-mono">SKU: {it.sku} • Qty: {it.quantity}</span>
                  </div>
                  <span className="font-mono text-ink font-semibold">
                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-pearl border border-line flex justify-between text-sm font-semibold text-ink rounded-sm">
                <span>Final Paid Total</span>
                <span className="font-mono text-ink font-bold">
                  ₹{selectedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Status Timeline History */}
            <div className="p-4 bg-pearl border border-line space-y-3 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">
                Audit Timeline
              </span>
              <div className="space-y-2 text-xs font-sans">
                {selectedOrder.statusTimeline.map((step, idx) => (
                  <div key={idx} className="flex justify-between text-muted border-b border-line pb-1.5 last:border-0">
                    <div>
                      <span className="font-semibold text-ink uppercase text-[11px] font-mono">{step.status}</span>
                      <span className="text-[10px] block text-muted">{step.note}</span>
                    </div>
                    <span className="text-[9px] font-mono text-muted">
                      {new Date(step.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
