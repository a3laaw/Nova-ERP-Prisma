import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '200');
    const employees = await db.employee.findMany({
      where: status ? { status } : undefined, take: limit,
      orderBy: { createdAt: 'desc' }, include: { company: { select: { name: true } } },
    });
    return NextResponse.json({ success: true, count: employees.length, data: employees });
  } catch (error: any) { return NextResponse.json({ success: false, error: 'فشل جلب الموظفين' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.employee.count();
    const employeeNumber = body.employeeNumber || `EMP-${String(count + 1).padStart(3, '0')}`;
    const basicSalary = Number(body.basicSalary) || 0;
    const housingAllowance = Number(body.housingAllowance) || 0;
    const transportAllowance = Number(body.transportAllowance) || 0;
    const cid = (await db.company.findFirst())?.id || '';
    const emp = await db.employee.create({
      data: {
        employeeNumber, fullName: body.fullName, civilId: body.civilId || null, mobile: body.mobile || null,
        email: body.email || null, department: body.department || null, jobTitle: body.jobTitle || null,
        basicSalary, housingAllowance, transportAllowance,
        totalSalary: basicSalary + housingAllowance + transportAllowance,
        status: 'active', hireDate: body.hireDate ? new Date(body.hireDate) : new Date(), companyId: cid,
      },
    });
    return NextResponse.json({ success: true, data: emp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
