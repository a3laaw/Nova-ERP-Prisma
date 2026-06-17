import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  // Create or find company
  const company = await prisma.company.upsert({
    where: { slug: 'nova-default' },
    update: {},
    create: { name: 'Nova Engineering', slug: 'nova-default', adminEmail: 'admin@nova-erp.com', status: 'active', subscriptionType: 'premium', maxUsersLimit: 50 },
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nova-erp.com' },
    update: { password: hashedPassword },
    create: { email: 'admin@nova-erp.com', username: 'admin', fullName: 'مدير النظام', password: hashedPassword, role: 'admin', isActive: true, companyId: company.id, activatedAt: new Date() },
  })

  // Create sample employee
  const emp = await prisma.employee.upsert({
    where: { employeeNumber: 'EMP-001' },
    update: {},
    create: { employeeNumber: 'EMP-001', fullName: 'Ahmed Al-Sabah', department: 'الهندسة والتصميم الفكري', jobTitle: 'مهندس تصميم معماري', basicSalary: 500, housingAllowance: 100, transportAllowance: 50, totalSalary: 650, status: 'active', hireDate: new Date('2024-01-15'), companyId: company.id, annualLeaveUsed: 10, carriedLeaveDays: 5 },
  })

  // Create sample client
  const client = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: { id: 'client-1', nameAr: 'شركة النور للإنشاءات', nameEn: 'Al-Noor Construction', mobile: '+965-12345678', status: 'contracted', clientType: 'registered', companyId: company.id },
  })

  // Create sample project
  await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: { id: 'project-1', name: 'Al-Jahra Residential Complex', clientId: client.id, status: 'in-progress', totalBudget: 2500000, progressPercent: 35, companyId: company.id },
  })

  console.log('✅ Admin user created: admin@nova-erp.com / admin123')
  console.log('✅ Sample data: 1 company, 1 employee, 1 client, 1 project')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
