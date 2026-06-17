import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.appointment.findMany({
      include: { client: { select: { nameAr: true, nameEn: true } } },
      orderBy: { appointmentDate: 'asc' },
      take: 100,
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب المواعيد' }, { status: 500 });
  }
}
