import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.project.findMany({
      include: { client: { select: { nameAr: true, nameEn: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب المشاريع' }, { status: 500 });
  }
}
