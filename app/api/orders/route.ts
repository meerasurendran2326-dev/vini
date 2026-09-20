import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
