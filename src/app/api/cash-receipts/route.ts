import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.cashReceipt.findMany({
      include: { client: { select: { nameAr: true, nameEn: true } } },
      orderBy: { date: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب السندات' }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.cashReceipt.count();
    const receiptNumber = `CR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const item = await db.cashReceipt.create({
      data: {
        receiptNumber,
        clientId: body.clientId,
        amount: Number(body.amount) || 0,
        paymentMethod: body.paymentMethod || 'cash',
        date: body.date ? new Date(body.date) : new Date(),
        reference: body.reference || null,
        notes: body.notes || null,
        status: 'draft',
        companyId: body.companyId || 'company-1',
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
