import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '200');

    const employees = await db.employee.findMany({
      where: status ? { status } : undefined,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { company: { select: { name: true } } },
    });
    return NextResponse.json({ success: true, count: employees.length, data: employees });
  } catch (error: any) {
    console.error('GET /api/employees error:', error);
    return NextResponse.json({ success: false, error: 'فشل جلب الموظفين' }, { status: 500 });
  }
}
