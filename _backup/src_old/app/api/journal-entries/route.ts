import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.journalEntry.findMany({
      include: { lines: { include: { account: true } } },
      orderBy: { date: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب القيود' }, { status: 500 });
  }
}
