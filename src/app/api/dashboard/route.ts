import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [employees, clients, projects, contracts, cashReceipts, journalEntries, leaveRequests, tasks] = await Promise.all([
      db.employee.count(),
      db.client.count(),
      db.project.count(),
      db.contract.count(),
      db.cashReceipt.aggregate({ _sum: { amount: true }, where: { status: 'posted' } }),
      db.journalEntry.aggregate({ _sum: { totalDebit: true }, where: { status: 'posted' } }),
      db.leaveRequest.count({ where: { status: 'pending' } }),
      db.task.count({ where: { status: { in: ['pending', 'in-progress'] } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalEmployees: employees,
          totalClients: clients,
          activeProjects: projects,
          activeContracts: contracts,
          totalRevenue: cashReceipts._sum.amount || 0,
          totalJournalEntries: journalEntries._sum.totalDebit || 0,
          pendingLeaveRequests: leaveRequests,
          pendingTasks: tasks,
        },
      },
    });
  } catch (error: any) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ success: false, error: 'فشل جلب بيانات لوحة التحكم' }, { status: 500 });
  }
}
