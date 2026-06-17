import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await db.transaction.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب البيانات' }, { status: 500 });
  }
}
