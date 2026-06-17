import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const company = await p.company.findFirst({ where: { slug: 'nova-default' } })
  if (!company) { console.log('❌ No company found'); return }
  const cid = company.id

  // More employees
  const emps = [
    { employeeNumber: 'EMP-002', fullName: 'Fatima Al-Mansoori', department: 'الهندسة والتصميم الفكري', jobTitle: 'مهندس تصميم إنشائي', basicSalary: 600, housingAllowance: 120, transportAllowance: 50, totalSalary: 770, hireDate: new Date('2023-09-01'), annualLeaveUsed: 15, carriedLeaveDays: 3 },
    { employeeNumber: 'EMP-003', fullName: 'Yusuf Al-Kandari', department: 'إدارة المشاريع والتنفيذ', jobTitle: 'مهندس موقع مدني', basicSalary: 550, housingAllowance: 100, transportAllowance: 60, totalSalary: 710, hireDate: new Date('2022-03-15'), annualLeaveUsed: 20, carriedLeaveDays: 0 },
    { employeeNumber: 'EMP-004', fullName: 'Noor Al-Sabah', department: 'الشؤون المالية', jobTitle: 'محاسب', basicSalary: 450, housingAllowance: 80, transportAllowance: 40, totalSalary: 570, hireDate: new Date('2024-06-01'), annualLeaveUsed: 5, carriedLeaveDays: 2 },
    { employeeNumber: 'EMP-005', fullName: 'Khalid Al-Otaibi', department: 'إدارة المشاريع والتنفيذ', jobTitle: 'مراقب ميداني', basicSalary: 400, housingAllowance: 70, transportAllowance: 30, totalSalary: 500, hireDate: new Date('2025-01-10'), annualLeaveUsed: 0, carriedLeaveDays: 0 },
  ]
  for (const e of emps) {
    await p.employee.upsert({ where: { employeeNumber: e.employeeNumber }, update: {}, create: { ...e, status: 'active', companyId: cid } })
  }
  console.log(`✅ ${emps.length} موظف إضافي`)

  // More clients
  const clients = [
    { nameAr: 'شركة المنارة للمقاولات', mobile: '+965-98765432', governorate: 'حولي', status: 'contracted', clientType: 'registered' },
    { nameAr: 'مؤسسة البناء الحديث', mobile: '+965-55667788', governorate: 'الأحمدي', status: 'prospective', clientType: 'prospective' },
    { nameAr: 'شركة الفجر للإنشاءات', mobile: '+965-11223344', governorate: 'العاصمة', status: 'contracted', clientType: 'registered' },
    { nameAr: 'ديار الكويت العقارية', mobile: '+965-99887766', governorate: 'الجهراء', status: 'new', clientType: 'prospective' },
  ]
  for (const c of clients) {
    const existing = await p.client.findFirst({ where: { nameAr: c.nameAr } })
    if (!existing) await p.client.create({ data: { ...c, companyId: cid } })
  }
  console.log(`✅ ${clients.length} عميل إضافي`)

  // More projects
  const projects = [
    { name: 'Sharq Office Tower', clientId: (await p.client.findFirst({ where: { nameAr: 'شركة الفجر للإنشاءات' } }))?.id, status: 'in-progress', totalBudget: 8500000, progressPercent: 15 },
    { name: 'Salmiya Villa Renovation', clientId: (await p.client.findFirst({ where: { nameAr: 'شركة المنارة للمقاولات' } }))?.id, status: 'planning', totalBudget: 350000, progressPercent: 0 },
  ]
  for (const proj of projects) {
    const existing = await p.project.findFirst({ where: { name: proj.name } })
    if (!existing && proj.clientId) await p.project.create({ data: { ...proj, companyId: cid } })
  }
  console.log(`✅ ${projects.length} مشروع إضافي`)

  // Sample cash receipt
  const cr = await p.cashReceipt.findFirst({ where: { receiptNumber: 'CR-2024-0001' } })
  if (!cr) {
    const client = await p.client.findFirst({ where: { nameAr: 'شركة النور للإنشاءات' } })
    if (client) await p.cashReceipt.create({ data: { receiptNumber: 'CR-2024-0001', clientId: client.id, amount: 25000, paymentMethod: 'bank', date: new Date('2024-03-01'), status: 'posted', companyId: cid } })
  }
  console.log('✅ سند قبض تجريبي')

  // Sample leave requests
  const emp1 = await p.employee.findFirst({ where: { employeeNumber: 'EMP-001' } })
  const emp2 = await p.employee.findFirst({ where: { employeeNumber: 'EMP-002' } })
  if (emp1) {
    const lr = await p.leaveRequest.findFirst({ where: { employeeId: emp1.id, leaveType: 'Annual' } })
    if (!lr) await p.leaveRequest.create({ data: { employeeId: emp1.id, leaveType: 'Annual', startDate: new Date('2026-07-01'), endDate: new Date('2026-07-10'), totalDays: 10, reason: 'إجازة صيفية', status: 'pending' } })
  }
  if (emp2) {
    const lr = await p.leaveRequest.findFirst({ where: { employeeId: emp2.id, leaveType: 'Sick' } })
    if (!lr) await p.leaveRequest.create({ data: { employeeId: emp2.id, leaveType: 'Sick', startDate: new Date('2026-06-10'), endDate: new Date('2026-06-15'), totalDays: 5, reason: 'إجازة مرضية', status: 'approved' } })
  }
  console.log('✅ طلبات إجازة تجريبية')

  // Sample tasks
  await p.task.upsert({ where: { id: 'task-1' }, update: {}, create: { id: 'task-1', title: 'مراجعة مخططات مشروع الجهراء', status: 'in-progress', priority: 'high', companyId: cid } })
  await p.task.upsert({ where: { id: 'task-2' }, update: {}, create: { id: 'task-2', title: 'إعداد تقرير الميزانية', status: 'pending', priority: 'medium', companyId: cid } })
  console.log('✅ مهام تجريبية')

  console.log('\n🎉 تم زرع البيانات التجريبية!')
}
main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await p.$disconnect() })
