import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const records = await db.clientTransaction.findMany({
      where: clientId ? { clientId } : undefined,
      include: { client: { select: { nameAr: true, nameEn: true } }, stages: true, contract: true, timelineEvents: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.clientTransaction.count();
    const transactionNumber = `TRX-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const tx = await db.clientTransaction.create({
      data: {
        transactionNumber,
        clientId: body.clientId,
        transactionType: body.transactionType,
        subServiceName: body.subServiceName || null,
        notes: body.notes || null,
        status: 'new',
        stages: body.stages?.length > 0 ? {
          create: body.stages.map((s: any, idx: number) => ({
            stageId: s.stageId || `stage-${idx}`,
            name: s.name || `مرحلة ${idx + 1}`,
            status: 'pending',
            order: s.order || idx,
            trackingType: s.trackingType || 'occurrence',
            expectedDurationDays: s.expectedDurationDays || null,
          }))
        } : undefined,
      },
      include: { stages: true },
    });
    return NextResponse.json({ success: true, data: tx });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
