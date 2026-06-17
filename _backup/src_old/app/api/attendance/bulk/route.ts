import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records } = body;
    if (!records || !Array.isArray(records)) return NextResponse.json({ success: false, error: 'بيانات غير صالحة' }, { status: 400 });
    let savedCount = 0;
    for (const record of records) {
      const emp = await db.employee.findFirst({ where: { employeeNumber: record.employeeNumber } });
      if (emp) {
        const date = new Date(record.date);
        const existing = await db.attendanceRecord.findFirst({ where: { employeeId: emp.id, date } });
        if (!existing) {
          await db.attendanceRecord.create({
            data: {
              employeeId: emp.id,
              date,
              checkIn: record.punches?.[0] ? new Date(`${record.date}T${record.punches[0]}:00`) : null,
              checkOut: record.punches?.length > 1 ? new Date(`${record.date}T${record.punches[record.punches.length - 1]}:00`) : null,
              status: 'present',
            },
          });
          savedCount++;
        }
      }
    }
    return NextResponse.json({ success: true, savedCount });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
