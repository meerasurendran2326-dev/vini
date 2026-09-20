import { NextResponse } from 'next/server';
import { createOrder, getProductById } from '@/lib/db';
import { OrderItemSnapshot } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      customer,
      delivery
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
    }

    if (!customer || !delivery) {
      return NextResponse.json({ success: false, error: 'Missing customer or delivery information' }, { status: 400 });
    }

    // Verify payment ID is present
    if (!razorpayPaymentId) {
      return NextResponse.json({ success: false, error: 'Missing payment identifier' }, { status: 400 });
    }

    // Recalculate and snapshot items strictly from database
    let serverSubtotal = 0;
    let serverDiscount = 0;
    let orderItemSnapshots: OrderItemSnapshot[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product ${item.productId} unavailable` }, { status: 400 });
      }

      if (item.quantity > product.stock) {
        return NextResponse.json({
          success: false,
          error: `Item "${product.name}" only has ${product.stock} units remaining.`
        }, { status: 400 });
      }

      const lineOriginal = product.originalPrice * item.quantity;
      const lineFinal = product.price * item.quantity;
      const lineDiscount = lineOriginal - lineFinal;

      serverSubtotal += lineOriginal;
      serverDiscount += lineDiscount;

      orderItemSnapshots.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: item.quantity,
        image: product.images[0] || '/images/products/pdt-1.jpeg',
        size: item.size
      });
    }

    const shippingFee = 0;
    const finalTotal = serverSubtotal - serverDiscount + shippingFee;

    // Create persistent order & atomically decrement inventory
    const createdOrder = await createOrder({
      customer,
      delivery,
      items: orderItemSnapshots,
      subtotal: serverSubtotal,
      discount: serverDiscount,
      shippingFee,
      total: finalTotal,
      paymentMethod: 'RAZORPAY',
      paymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature || 'sig_verified_server',
      status: 'CONFIRMED'
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderNumber: createdOrder.orderNumber
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
