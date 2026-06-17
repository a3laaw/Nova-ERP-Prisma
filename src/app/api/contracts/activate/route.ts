import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, clientId, clauses, totalAmount, financialsType, specs, quotationIdToUpdate } = body;

    if (!clientId || !clauses || clauses.length === 0) {
      return NextResponse.json({ success: false, error: 'بيانات ناقصة' }, { status: 400 });
    }

    // Create or update Contract
    let contract;
    if (transactionId) {
      contract = await db.contract.upsert({
        where: { transactionId },
        update: { totalAmount, status: 'active' },
        create: { transactionId, totalAmount, status: 'active', startDate: new Date() },
      });
    } else {
      // Create a new transaction first
      const txCount = await db.clientTransaction.count();
      const tx = await db.clientTransaction.create({
        data: {
          transactionNumber: `TRX-${Date.now()}`,
          clientId,
          transactionType: 'contract',
          status: 'in-progress',
          totalAmount,
        },
      });
      contract = await db.contract.create({
        data: { transactionId: tx.id, totalAmount, status: 'active', startDate: new Date() },
      });
    }

    // Create milestones (contract clauses)
    await db.contractMilestone.deleteMany({ where: { contractId: contract.id } });
    for (const clause of clauses) {
      await db.contractMilestone.create({
        data: {
          contractId: contract.id,
          name: clause.name || 'دفعة',
          amount: clause.amount || 0,
          percentage: financialsType === 'percentage' ? clause.value : null,
          triggerCondition: clause.condition || null,
          clauseStatus: 'غير مستحقة',
          status: 'pending',
          order: clause.order || 0,
        },
      });
    }

    // Update quotation status if provided
    if (quotationIdToUpdate) {
      await db.quotation.update({ where: { id: quotationIdToUpdate }, data: { status: 'accepted' } });
    }

    return NextResponse.json({ success: true, data: { contractId: contract.id, milestonesCount: clauses.length } });
  } catch (error: any) {
    console.error('POST /api/contracts/activate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
