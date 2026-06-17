import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const records = await db.leaveRequest.findMany({
      where: employeeId ? { employeeId } : undefined,
      include: { employee: { select: { fullName: true, employeeNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'فشل جلب الإجازات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, leaveType, startDate, endDate, totalDays, notes, status } = body;

    if (!employeeId || !leaveType || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 });
    }

    const record = await db.leaveRequest.create({
      data: {
        employeeId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays: totalDays || 0,
        reason: notes || null,
        status: status || 'pending',
      },
    });

    // Update employee's annual leave used if approved
    if (leaveType === 'Annual' && (status === 'approved' || status === 'pending')) {
      await db.employee.update({
        where: { id: employeeId },
        data: { annualLeaveUsed: { increment: totalDays || 0 } },
      });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    console.error('POST /api/leave-requests error:', error);
    return NextResponse.json({ success: false, error: error.message || 'فشل حفظ الإجازة' }, { status: 500 });
  }
}
