import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      db.client.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { _count: { select: { transactions: true, quotations: true } } } }),
      db.client.count(),
    ]);
    return NextResponse.json({ success: true, count: clients.length, total, page, limit, data: clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب العملاء' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await db.client.create({
      data: {
        nameAr: body.nameAr || null,
        nameEn: body.nameEn || null,
        mobile: body.mobile || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        governorate: body.governorate || null,
        city: body.city || null,
        status: body.status || 'new',
        clientType: body.clientType || 'registered',
        companyId: body.companyId || 'company-1',
      },
    });
    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
