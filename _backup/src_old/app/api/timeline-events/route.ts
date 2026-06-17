import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    if (!transactionId) return NextResponse.json({ success: true, data: [] });
    const events = await db.timelineEvent.findMany({ where: { transactionId }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await db.timelineEvent.create({
      data: {
        transactionId: body.transactionId,
        type: body.type || 'comment',
        content: body.content,
        mentionedUserIds: body.mentionedUsernames ? JSON.stringify(body.mentionedUsernames) : null,
      },
    });
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
