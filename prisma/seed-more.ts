import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
async function main() {
  const cid = (await p.company.findFirst())?.id || ''
  // Vendors
  const vendors = [
    { name: 'شركة أسمنت الكويت', contactPerson: 'أحمد', phone: '+965-11111111', companyId: cid },
    { name: 'مؤسسة الحديد الحديثة', contactPerson: 'خالد', phone: '+965-22222222', companyId: cid },
    { name: 'شركة البلاط الكويتي', contactPerson: 'سعد', phone: '+965-33333333', companyId: cid },
  ]
  for (const v of vendors) { const e = await p.vendor.findFirst({ where: { name: v.name } }); if (!e) await p.vendor.create({ data: v }) }
  console.log(`✅ ${vendors.length} موردين`)

  // Items
  const items = [
    { name: 'أسمنت بورتلاندي', sku: 'CEM-001', unit: 'كيس', unitPrice: 2.5, costPrice: 1.8, companyId: cid },
    { name: 'حديد تسليح 12مم', sku: 'STL-012', unit: 'طن', unitPrice: 280, costPrice: 250, companyId: cid },
    { name: 'بلاط سيراميك 60x60', sku: 'TIL-060', unit: 'متر مربع', unitPrice: 8.5, costPrice: 6, companyId: cid },
    { name: 'رمل نظيف', sku: 'SND-001', unit: 'متر مكعب', unitPrice: 12, costPrice: 8, companyId: cid },
    { name: 'بلوك أسمنتي', sku: 'BLK-001', unit: 'قطعة', unitPrice: 0.35, costPrice: 0.25, companyId: cid },
  ]
  for (const i of items) { const e = await p.item.findFirst({ where: { name: i.name } }); if (!e) await p.item.create({ data: i }) }
  console.log(`✅ ${items.length} أصناف`)

  // Journal entries
  const je1 = await p.journalEntry.findFirst({ where: { entryNumber: 'JV-2024-0001' } })
  if (!je1) {
    const revenueAcc = await p.account.findFirst({ where: { code: '4101' } })
    const cashAcc = await p.account.findFirst({ where: { code: '110101' } })
    if (revenueAcc && cashAcc) {
      const je = await p.journalEntry.create({
        data: {
          entryNumber: 'JV-2024-0001', date: new Date('2024-01-15'),
          description: 'Capital injection by owner', totalDebit: 50000, totalCredit: 50000,
          status: 'posted', companyId: cid,
          lines: { create: [
            { accountId: cashAcc.id, debit: 50000, credit: 0, description: 'رأس مال نقدى' },
            { accountId: revenueAcc.id, debit: 0, credit: 50000, description: 'إيراد رأس مال' },
          ]},
        },
      })
      console.log('✅ قيد يومية تجريبي')
    }
  }

  // Appointments
  const appt = await p.appointment.findFirst({ where: { title: 'Initial Site Assessment' } })
  if (!appt) {
    const client = await p.client.findFirst()
    if (client) await p.appointment.create({
      data: { title: 'Initial Site Assessment', clientId: client.id, clientName: client.nameAr || 'عميل',
        appointmentDate: new Date('2026-06-20'), type: 'site-visit', status: 'scheduled', companyId: cid }
    })
    console.log('✅ موعد تجريبي')
  }

  console.log('\n🎉 تم!')
}
main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await p.$disconnect() })
