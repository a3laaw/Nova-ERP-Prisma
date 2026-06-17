import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const accounts = await db.account.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
    return NextResponse.json({ success: true, count: accounts.length, data: accounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب الحسابات' }, { status: 500 });
  }
}
