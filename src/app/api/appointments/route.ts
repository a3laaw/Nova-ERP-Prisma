import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const items = await db.appointment.findMany({
      include: { client: { select: { nameAr: true, nameEn: true } } },
      orderBy: { appointmentDate: 'asc' }, take: 100,
    });
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cid = (await db.company.findFirst())?.id || '';
    const appt = await db.appointment.create({
      data: {
        title: body.title || 'موعد',
        clientId: body.clientId || null,
        clientName: body.clientName || '',
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : new Date(),
        type: body.type || 'meeting',
        status: 'scheduled',
        notes: body.notes || null,
        companyId: cid,
      },
    });
    return NextResponse.json({ success: true, data: appt });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
