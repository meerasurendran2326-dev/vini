import { NextResponse } from 'next/server';
import { getProductById, getSettings } from '@/lib/db';

interface CartInputItem {
  productId: string;
  quantity: number;
  size?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: CartInputItem[] = body.items || [];

    if (!items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const settings = await getSettings();
    let validatedItems = [];
    let calculatedSubtotal = 0;
    let calculatedDiscount = 0;
    let errors: string[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        errors.push(`Product with ID ${item.productId} was not found.`);
        continue;
      }

      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for ${product.name}.`);
        continue;
      }

      if (item.quantity > product.stock) {
        errors.push(`Insufficient stock for ${product.name}. Only ${product.stock} units remaining.`);
        continue;
      }

      // Authoritative pricing from server
      const itemPrice = product.price;
      const itemOriginalPrice = product.originalPrice;
      const lineSubtotal = itemOriginalPrice * item.quantity;
      const lineFinal = itemPrice * item.quantity;
      const lineDiscount = lineSubtotal - lineFinal;

      calculatedSubtotal += lineSubtotal;
      calculatedDiscount += lineDiscount;

      validatedItems.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: itemPrice,
        originalPrice: itemOriginalPrice,
        quantity: item.quantity,
        image: product.images[0] || '/images/products/pdt-1.jpeg',
        size: item.size,
        availableStock: product.stock
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: errors.join(' '),
        details: errors
      }, { status: 400 });
    }

    const shippingFee = 0; // Complimentary luxury delivery
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + shippingFee;

    return NextResponse.json({
      success: true,
      validated: true,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shippingFee,
      total: calculatedTotal,
      currency: "INR"
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
