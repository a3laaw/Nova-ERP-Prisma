import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.contract.findMany({
      include: { milestones: true, transaction: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب العقود' }, { status: 500 });
  }
}
