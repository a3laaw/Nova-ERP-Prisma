import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const items = await db.notification.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: 'desc' }, take: 50,
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cid = (await db.company.findFirst())?.id || '';
    const notif = await db.notification.create({
      data: {
        userId: body.userId || 'admin',
        title: body.title || 'إشعار',
        body: body.body || '',
        link: body.link || null,
        type: body.type || 'info',
        companyId: cid,
      },
    });
    return NextResponse.json({ success: true, data: notif });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
