import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.custodyReconciliation.findMany({
      include: { employee: { select: { fullName: true } }, items: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.custodyReconciliation.count();
    const reconciliationNumber = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const item = await db.custodyReconciliation.create({
      data: {
        reconciliationNumber,
        employeeId: body.employeeId,
        date: body.date ? new Date(body.date) : new Date(),
        totalAmount: body.totalAmount || 0,
        notes: body.notes || null,
        status: 'draft',
        items: { create: (body.items || []).map((i: any) => ({ description: i.description, amount: i.amount, action: i.action || 'deduct' })) },
      },
      include: { items: true },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
