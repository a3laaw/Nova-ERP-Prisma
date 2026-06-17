import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET() {
  try {
    const items = await db.vendor.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cid = (await db.company.findFirst())?.id || '';
    const item = await db.vendor.create({ data: { name: body.name, nameAr: body.nameAr || null, contactPerson: body.contactPerson || null, phone: body.phone || null, email: body.email || null, address: body.address || null, companyId: cid } });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
