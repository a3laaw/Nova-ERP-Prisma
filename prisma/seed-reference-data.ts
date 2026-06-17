import { PrismaClient } from '@prisma/client';
import { hardcodedChartOfAccounts } from '../src/lib/chart-of-accounts-data';
import { defaultDepartments, defaultJobs, defaultGovernorates, defaultAreas, defaultTransactionTypes, defaultServiceTypes } from '../src/lib/default-reference-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء زرع القوائم المرجعية...\n');

  // 1. المحافظات والمناطق
  console.log('📍 1. زرع المحافظات والمناطق...');
  for (const gov of defaultGovernorates) {
    const created = await prisma.governorate.upsert({
      where: { name: gov.name },
      update: { order: gov.order },
      create: { name: gov.name, nameEn: gov.name, code: gov.name === 'العاصمة' ? 'capital' : gov.name === 'حولي' ? 'hawalli' : gov.name === 'الأحمدي' ? 'ahmadi' : gov.name === 'الجهراء' ? 'jahra' : gov.name === 'مبارك الكبير' ? 'mubarak' : 'farwaniya', order: gov.order },
    });
    const areas = defaultAreas[gov.name] || [];
    for (const area of areas) {
      await prisma.area.upsert({ where: { id: `${created.id}-${area.name}` }, update: { name: area.name, governorateId: created.id }, create: { id: `${created.id}-${area.name}`, name: area.name, nameEn: area.name, governorateId: created.id } });
    }
  }
  console.log('   ✅ 6 محافظات + 18 منطقة');

  // 2. الأقسام والمسميات
  console.log('📋 2. زرع الأقسام والمسميات...');
  for (const dept of defaultDepartments) {
    const createdDept = await prisma.department.upsert({ where: { name: dept.name }, update: { order: dept.order }, create: { name: dept.name, nameEn: dept.name, order: dept.order } });
    const jobs = defaultJobs[dept.name] || [];
    for (const job of jobs) {
      let systemRole = 'engineer';
      if (job.name.includes('مدير عام') || job.name.includes('مدير مشاريع') || job.name.includes('مدير موارد')) systemRole = 'owner_executive';
      else if (job.name.includes('مدير مالي') || job.name.includes('محاسب') || job.name.includes('أمين صندوق')) systemRole = 'financial_manager';
      await prisma.jobTitle.upsert({ where: { name: job.name }, update: { departmentId: createdDept.id, systemRole }, create: { name: job.name, nameEn: job.name, departmentId: createdDept.id, systemRole } });
    }
  }
  console.log('   ✅ 5 أقسام + 15 مسمى وظيفي');

  // 3. أنواع المعاملات والخدمات
  console.log('🔧 3. زرع أنواع المعاملات...');
  for (const txType of defaultTransactionTypes) {
    const createdTx = await prisma.transactionType.upsert({ where: { name: txType.name }, update: { contractPath: txType.contractPath }, create: { name: txType.name, contractPath: txType.contractPath, targetDepartment: txType.targetDepartment || null, order: txType.order } });
    for (const serviceName of txType.allowedServiceTypes) {
      const serviceData = defaultServiceTypes.find(s => s.name === serviceName);
      if (serviceData) {
        await prisma.subService.upsert({ where: { name: serviceName }, update: { transactionTypeId: createdTx.id, domain: serviceData.domain }, create: { name: serviceName, nameEn: serviceName, transactionTypeId: createdTx.id, domain: serviceData.domain } });
      }
    }
  }
  console.log('   ✅ 3 أنواع معاملات + 3 خدمات');

  // 4. مراحل العمل
  console.log('⚙️ 4. زرع مراحل العمل...');
  const stages = [
    { name: 'عند توقيع العقد', nameEn: 'On Contract Signing', trackingType: 'occurrence', order: 0 },
    { name: 'عند تسليم المخططات', nameEn: 'On Plans Delivery', trackingType: 'occurrence', order: 1 },
    { name: 'عند البدء بالتنفيذ', nameEn: 'On Execution Start', trackingType: 'occurrence', order: 2 },
    { name: 'عند انتهاء الهيكل الإنشائي', nameEn: 'On Structure Completion', trackingType: 'duration', expectedDurationDays: 60, order: 3 },
    { name: 'عند التشطيبات', nameEn: 'On Finishes', trackingType: 'duration', expectedDurationDays: 45, order: 4 },
    { name: 'عند التسليم النهائي', nameEn: 'On Final Delivery', trackingType: 'occurrence', order: 5 },
  ];
  for (const stage of stages) {
    await prisma.workStage.upsert({ where: { name: stage.name }, update: { trackingType: stage.trackingType, expectedDurationDays: stage.expectedDurationDays || null, order: stage.order }, create: { name: stage.name, nameEn: stage.nameEn, trackingType: stage.trackingType, expectedDurationDays: stage.expectedDurationDays || null, order: stage.order } });
  }
  console.log('   ✅ 6 مراحل عمل');

  // 5. شجرة الحسابات
  console.log('📊 5. زرع شجرة الحسابات...');
  let accountsCount = 0;
  for (const account of hardcodedChartOfAccounts) {
    await prisma.account.upsert({ where: { code: account.code }, update: { name: account.name, type: account.type, parentCode: account.parentCode, level: account.level, isPayable: account.isPayable, balanceType: account.balanceType || null, statement: account.statement || null }, create: { code: account.code, name: account.name, type: account.type, parentCode: account.parentCode, level: account.level, isPayable: account.isPayable, balanceType: account.balanceType || null, statement: account.statement || null } });
    accountsCount++;
  }
  console.log(`   ✅ ${accountsCount} حساب`);

  console.log('\n🎉 تم زرع كل القوائم المرجعية!');
}
main().catch(e => { console.error('❌', e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
