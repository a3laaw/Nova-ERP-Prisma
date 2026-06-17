'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Building2, Bell, Search, Settings } from 'lucide-react'
import { OfflineIndicator } from '@/context/sync-context'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock user (مؤقتاً — للمراجعة بدون login)
const MOCK_USER = {
  id: 'admin',
  email: 'admin@nova-erp.com',
  username: 'admin',
  fullName: 'مدير النظام',
  name: 'مدير النظام',
  role: 'Admin',
  currentCompanyId: 'company-1',
  companyName: 'Nova Engineering',
  isActive: true,
}

interface NavItem {
  labelAr: string
  labelEn: string
  icon: any
  href: string
  color: string
}

const navSections: { titleAr: string; items: NavItem[] }[] = [
  {
    titleAr: 'العمليات',
    items: [
      { labelAr: 'العملاء', labelEn: 'Clients', icon: Users, href: '/dashboard/clients', color: 'text-blue-600' },
      { labelAr: 'المشاريع', labelEn: 'Projects', icon: Briefcase, href: '/dashboard/projects', color: 'text-purple-600' },
      { labelAr: 'العقود', labelEn: 'Contracts', icon: FileText, href: '/dashboard/contracts', color: 'text-orange-600' },
      { labelAr: 'المواعيد', labelEn: 'Appointments', icon: CalendarDays, href: '/dashboard/appointments', color: 'text-cyan-600' },
    ],
  },
  {
    titleAr: 'المالية',
    items: [
      { labelAr: 'المحاسبة', labelEn: 'Accounting', icon: Calculator, href: '/dashboard/accounting', color: 'text-emerald-600' },
      { labelAr: 'التقارير', labelEn: 'Reports', icon: BarChart3, href: '/dashboard/reports', color: 'text-indigo-600' },
    ],
  },
  {
    titleAr: 'الموارد',
    items: [
      { labelAr: 'الموارد البشرية', labelEn: 'HR', icon: UserCircle, href: '/dashboard/hr', color: 'text-sky-600' },
      { labelAr: 'المقاولات', labelEn: 'Construction', icon: HardHat, href: '/dashboard/construction', color: 'text-amber-600' },
      { labelAr: 'المشتريات', labelEn: 'Purchasing', icon: ShoppingCart, href: '/dashboard/purchasing', color: 'text-rose-600' },
      { labelAr: 'المخازن', labelEn: 'Warehouse', icon: Package, href: '/dashboard/warehouse', color: 'text-teal-600' },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = MOCK_USER

  return (
    <div className="min-h-screen flex bg-[#fdfaf3]" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-l border-stone-200 flex flex-col shrink-0 overflow-hidden`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-sm">Nova ERP</h1>
              <p className="text-[10px] text-stone-400">{user.companyName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-[#F5820D] text-white">
            <BarChart3 className="h-4 w-4" /> لوحة التحكم
          </Link>
          {navSections.map((section) => (
            <div key={section.titleAr}>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider px-3 mb-1">{section.titleAr}</p>
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all">
                    <Icon className={`h-4 w-4 ${item.color}`} /> {item.labelAr}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold">م</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.fullName}</p>
              <p className="text-[10px] text-stone-400">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-stone-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input placeholder="ابحث..." className="pr-10 h-9 rounded-lg bg-stone-50 border-stone-200" />
          </div>
          <button className="p-2 rounded-lg hover:bg-stone-100 relative">
            <Bell className="h-5 w-5 text-stone-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F5820D] rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-stone-100">
            <Settings className="h-5 w-5 text-stone-500" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <OfflineIndicator />
    </div>
  )
}

// Icons
import { Users, Briefcase, FileText, CalendarDays, Calculator, BarChart3, UserCircle, HardHat, ShoppingCart, Package } from 'lucide-react'
