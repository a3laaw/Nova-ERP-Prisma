import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const emp = await db.employee.findUnique({ where: { id: params.id }, include: { company: true } });
    return NextResponse.json({ success: true, data: emp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await db.employee.count();
    const employeeNumber = body.employeeNumber || `EMP-${String(count + 1).padStart(3, '0')}`;
    const emp = await db.employee.create({
      data: {
        employeeNumber,
        fullName: body.fullName,
        civilId: body.civilId || null,
        mobile: body.mobile || null,
        email: body.email || null,
        department: body.department || null,
        jobTitle: body.jobTitle || null,
        basicSalary: Number(body.basicSalary) || 0,
        housingAllowance: Number(body.housingAllowance) || 0,
        transportAllowance: Number(body.transportAllowance) || 0,
        totalSalary: (Number(body.basicSalary) || 0) + (Number(body.housingAllowance) || 0) + (Number(body.transportAllowance) || 0),
        status: 'active',
        hireDate: body.hireDate ? new Date(body.hireDate) : new Date(),
        companyId: body.companyId || (await db.company.findFirst())?.id || '',
      },
    });
    return NextResponse.json({ success: true, data: emp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const emp = await db.employee.update({ where: { id: params.id }, data: { ...body } });
    return NextResponse.json({ success: true, data: emp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.employee.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
