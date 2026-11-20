import { NextResponse } from 'next/server';
import { readPurchases, writePurchases } from '@/lib/module-purchase-store';

export async function GET() {
  try {
    const data = await readPurchases();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error reading purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid purchase payload' }, { status: 400 });
    }
    await writePurchases(payload);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving purchases:', error);
    return NextResponse.json({ error: 'Failed to save purchases' }, { status: 500 });
  }
}
