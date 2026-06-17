import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.quotation.findMany({
      include: { client: { select: { nameAr: true, nameEn: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.quotation.count();
    const quotationNumber = `QUO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const quotation = await db.quotation.create({
      data: {
        quotationNumber,
        clientId: body.clientId,
        subject: body.subject || null,
        date: new Date(),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        totalAmount: body.totalAmount || 0,
        status: 'draft',
        financialsType: body.financialsType || 'fixed',
        items: {
          create: (body.items || []).map((item: any, idx: number) => ({
            description: item.description || `بند ${idx + 1}`,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
            total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
            order: idx,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ success: true, data: quotation });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
