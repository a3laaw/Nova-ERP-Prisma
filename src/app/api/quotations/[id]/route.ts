import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await db.quotation.findUnique({ where: { id: params.id }, include: { items: true, client: true } });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const item = await db.quotation.update({ where: { id: params.id }, data: { ...body } });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}
