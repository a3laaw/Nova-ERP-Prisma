import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await db.leaveRequest.update({ where: { id: params.id }, data: { status: body.status, approvedBy: body.approvedBy || null, approvedAt: body.status !== 'pending' ? new Date() : null } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
