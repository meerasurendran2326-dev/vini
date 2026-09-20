import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, delivery } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json({ success: false, error: 'Incomplete customer details' }, { status: 400 });
    }

    if (!delivery?.addressLine1 || !delivery?.city || !delivery?.pincode) {
      return NextResponse.json({ success: false, error: 'Incomplete delivery address' }, { status: 400 });
    }

    // Strictly calculate total from database
    let serverTotal = 0;
    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product ${item.productId} not found` }, { status: 400 });
      }
      if (item.quantity > product.stock) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        }, { status: 400 });
      }
      serverTotal += product.price * item.quantity;
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_luxury_vini_vici_vidi';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Simulated / live order creation
    const razorpayOrderId = `order_vvv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      razorpayOrderId,
      amount: serverTotal * 100, // in paise
      currency: 'INR',
      keyId: razorpayKeyId,
      customerSnapshot: customer,
      calculatedTotal: serverTotal
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
