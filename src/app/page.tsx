'use client'

import { useState, lazy, Suspense } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, LogIn, LogOut, Users, Building2, DollarSign, Briefcase, CalendarDays, FileText, Settings as SettingsIcon, HardHat, ShoppingCart, BarChart3, CreditCard, UserCircle, Calculator, Plus, Search, Bell, Moon, Sun } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { findNavigation } from '@/ai/tools/find-navigation'
import { OfflineIndicator, SyncStatusProvider } from '@/context/sync-context'
import SystemExpertChatWidget from '@/components/ai/chat-widget'
import { useTheme } from 'next-themes'

const RegisteredClientsList = lazy(() => import('@/components/clients/registered-clients-list').then(m => ({ default: m.RegisteredClientsList })))
const EmployeesTable = lazy(() => import('@/components/hr/employees-table').then(m => ({ default: m.EmployeesTable })))
const LeaveRequestsList = lazy(() => import('@/components/hr/leave-requests-list').then(m => ({ default: m.LeaveRequestsList })))
const GratuityCalculatorView = lazy(() => import('@/components/hr/gratuity-calculator-view').then(m => ({ default: m.GratuityCalculatorView })))
const LeaveRequestForm = lazy(() => import('@/components/hr/leave-request-form').then(m => ({ default: m.LeaveRequestForm })))
const JournalEntriesList = lazy(() => import('@/components/accounting/journal-entries-list').then(m => ({ default: m.JournalEntriesList })))
const CashReceiptsList = lazy(() => import('@/components/accounting/cash-receipts-list').then(m => ({ default: m.CashReceiptsList })))
const PaymentVouchersList = lazy(() => import('@/components/accounting/payment-vouchers-list').then(m => ({ default: m.PaymentVouchersList })))
const QuotationsList = lazy(() => import('@/components/accounting/quotations-list').then(m => ({ default: m.QuotationsList })))
const ProjectsList = lazy(() => import('@/components/construction/projects-list').then(m => ({ default: m.ProjectsList })))
const FieldVisitsList = lazy(() => import('@/components/construction/field-visits-list').then(m => ({ default: m.FieldVisitsList })))
const VendorsList = lazy(() => import('@/components/purchasing/vendors-list').then(m => ({ default: m.VendorsList })))
const PurchaseOrdersList = lazy(() => import('@/components/purchasing/purchase-orders-list').then(m => ({ default: m.PurchaseOrdersList })))
const ItemsList = lazy(() => import('@/components/warehouse/items-list').then(m => ({ default: m.ItemsList })))

type Module = 'dashboard' | 'clients' | 'hr' | 'accounting' | 'contracts' | 'projects' | 'appointments' | 'billing' | 'reports' | 'construction' | 'purchasing' | 'warehouse' | 'settings'

interface NavItem { id: Module; labelAr: string; icon: any; color: string }

const navSections: { title: string; items: NavItem[] }[] = [
  { title: 'العمليات', items: [
    { id: 'clients', labelAr: 'العملاء', icon: Users, color: 'text-blue-600' },
    { id: 'projects', labelAr: 'المشاريع', icon: Building2, color: 'text-purple-600' },
    { id: 'contracts', labelAr: 'العقود', icon: FileText, color: 'text-orange-600' },
    { id: 'appointments', labelAr: 'المواعيد', icon: CalendarDays, color: 'text-cyan-600' },
  ]},
  { title: 'المالية', items: [
    { id: 'accounting', labelAr: 'المحاسبة', icon: Calculator, color: 'text-emerald-600' },
    { id: 'billing', labelAr: 'الفوترة', icon: CreditCard, color: 'text-green-600' },
    { id: 'reports', labelAr: 'التقارير', icon: BarChart3, color: 'text-indigo-600' },
  ]},
  { title: 'الموارد', items: [
    { id: 'hr', labelAr: 'الموارد البشرية', icon: UserCircle, color: 'text-sky-600' },
    { id: 'construction', labelAr: 'المقاولات', icon: HardHat, color: 'text-amber-600' },
    { id: 'purchasing', labelAr: 'المشتريات', icon: ShoppingCart, color: 'text-rose-600' },
    { id: 'warehouse', labelAr: 'المخازن', icon: ShoppingCart, color: 'text-teal-600' },
  ]},
  { title: 'النظام', items: [
    { id: 'settings', labelAr: 'الإعدادات', icon: SettingsIcon, color: 'text-gray-600' },
  ]},
]

function LoadingFallback() { return <div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" /></div> }

export default function Home() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nova-erp.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [activeModule, setActiveModule] = useState<Module>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4" dir="rtl">
        <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-[#F5820D] to-[#FF8F00] p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center"><Building2 className="h-10 w-10 text-white" /></div>
            <h1 className="text-3xl font-black text-white">Nova ERP</h1>
            <p className="text-white/80 text-sm mt-1">نظام إدارة موارد المؤسسات للسوق الكويتي</p>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="space-y-2"><Label className="font-bold text-gray-700">البريد الإلكتروني</Label><Input value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl border-2" /></div>
            <div className="space-y-2"><Label className="font-bold text-gray-700">كلمة المرور</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl border-2" /></div>
            <Button onClick={async () => { setLoading(true); const result = await signIn('credentials', { email, password, redirect: false }); if (result?.error) { setLoading(false); alert('فشل الدخول') } else { window.location.reload() } }} disabled={loading} className="w-full h-12 rounded-xl font-black text-lg gap-2 bg-[#F5820D] hover:bg-[#C45600]">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />} دخول</Button>
            <p className="text-center text-xs text-muted-foreground">تجريبي: admin@nova-erp.com / admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    if (q.trim().length >= 2) {
      const results = findNavigation(q)
      setSearchResults(results ? [results] : [])
    } else {
      setSearchResults(null)
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-stone-200 flex flex-col shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-xl flex items-center justify-center"><Building2 className="h-5 w-5 text-white" /></div>
            <div><h1 className="font-black text-sm">Nova ERP</h1><p className="text-[10px] text-muted-foreground">v1.0 — Prisma</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          <button onClick={() => setActiveModule('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeModule === 'dashboard' ? 'bg-[#F5820D] text-white' : 'text-stone-600 hover:bg-stone-100'}`}><BarChart3 className="h-4 w-4" /> لوحة التحكم</button>
          {navSections.map(section => (
            <div key={section.title}>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider px-3 mb-1">{section.title}</p>
              {section.items.map(item => {
                const Icon = item.icon
                return (
                  <button key={item.id} onClick={() => setActiveModule(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeModule === item.id ? 'bg-orange-50 text-[#F5820D]' : 'text-stone-600 hover:bg-stone-100'}`}>
                    <Icon className={`h-4 w-4 ${activeModule === item.id ? 'text-[#F5820D]' : item.color}`} /> {item.labelAr}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold">{(session.user as any)?.name?.charAt(0) || 'A'}</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{(session.user as any)?.name || 'Admin'}</p><p className="text-[10px] text-muted-foreground">{(session.user as any)?.role || 'admin'}</p></div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="w-full text-xs gap-1 text-stone-500"><LogOut className="h-3 w-3" /> خروج</Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar with search */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b px-6 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="ابحث عن صفحة أو ميزة..." className="pr-10 h-10 rounded-xl border-2 bg-stone-50" />
            {searchResults && searchResults.length > 0 && (
              <div className="absolute top-12 right-0 w-full bg-white rounded-xl shadow-2xl border p-2 z-50">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => { setSearchResults(null); setSearchQuery(''); alert(`انتقال إلى: ${r.name}`) }} className="w-full text-right px-3 py-2 rounded-lg hover:bg-stone-100 text-sm font-bold">{r.name}</button>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5 text-stone-500" /><span className="absolute top-1 right-1 w-2 h-2 bg-[#F5820D] rounded-full" /></Button>
        </div>

        <div className="p-6">
          {activeModule === 'dashboard' && <DashboardView />}
          {activeModule === 'clients' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">العملاء المسجلون</h1><Suspense fallback={<LoadingFallback />}><RegisteredClientsList /></Suspense></div>
          )}
          {activeModule === 'hr' && <HRModule />}
          {activeModule === 'accounting' && <AccountingModule />}
          {activeModule === 'contracts' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">عروض الأسعار والعقود</h1><Suspense fallback={<LoadingFallback />}><QuotationsList /></Suspense></div>
          )}
          {activeModule === 'projects' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">المشاريع</h1><Suspense fallback={<LoadingFallback />}><ProjectsList /></Suspense></div>
          )}
          {activeModule === 'appointments' && <AppointmentsModule />}
          {activeModule === 'construction' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">الزيارات الميدانية</h1><Suspense fallback={<LoadingFallback />}><FieldVisitsList /></Suspense></div>
          )}
          {activeModule === 'purchasing' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">الموردون وأوامر الشراء</h1><Suspense fallback={<LoadingFallback />}><VendorsList /></Suspense><Suspense fallback={<LoadingFallback />}><PurchaseOrdersList /></Suspense></div>
          )}
          {activeModule === 'warehouse' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">الأصناف</h1><Suspense fallback={<LoadingFallback />}><ItemsList /></Suspense></div>
          )}
          {activeModule === 'reports' && <ReportsModule />}
          {activeModule === 'billing' && (
            <div className="space-y-4"><h1 className="text-2xl font-black text-stone-800">الفوترة</h1>
            <Card className="rounded-2xl border p-8 text-center text-stone-400"><CreditCard className="h-12 w-12 mx-auto mb-3 text-stone-300" /><p>سيتم إضافة الفوترة قريباً</p></Card>
            </div>
          )}
          {activeModule === 'settings' && <SettingsModule />}
        </div>
      </main>
      <SystemExpertChatWidget />
      <SyncStatusProvider><OfflineIndicator /></SyncStatusProvider>
    </div>
  )
}

// ===================== DASHBOARD =====================
function DashboardView() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => { const r = await fetch('/api/dashboard'); if (!r.ok) return null; const j = await r.json(); return j.data?.kpis || null },
  })
  const k = kpis || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black text-stone-800">لوحة التحكم</h1><p className="text-sm text-stone-500">نظرة عامة على النظام</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="العملاء" value={k.totalClients} color="bg-blue-50 text-blue-600" />
        <KpiCard icon={Briefcase} label="المشاريع" value={k.activeProjects} color="bg-purple-50 text-purple-600" />
        <KpiCard icon={DollarSign} label="الإيرادات" value={formatCurrency(k.totalRevenue)} color="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={UserCircle} label="الموظفون" value={k.totalEmployees} color="bg-sky-50 text-sky-600" />
        <KpiCard icon={CalendarDays} label="إجازات معلقة" value={k.pendingLeaveRequests} color="bg-orange-50 text-orange-600" />
        <KpiCard icon={FileText} label="مهام معلقة" value={k.pendingTasks} color="bg-rose-50 text-rose-600" />
      </div>
      <Card className="rounded-2xl border border-stone-200">
        <CardHeader><CardTitle className="text-lg">مرحباً بك في Nova ERP</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-stone-600 leading-relaxed">نظام إدارة موارد المؤسسات المصمم خصيصاً لمكاتب الهندسة وشركات المقاولات في الكويت. يدعم القانون الكويتي (المواد 41، 51، 53)، المحافظات الكويتية، الدينار الكويتي، والعربية بـ RTL كامل.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-orange-50 text-[#F5820D]">قانون العمل الكويتي</Badge>
            <Badge className="bg-emerald-50 text-emerald-600">66 حساب محاسبي</Badge>
            <Badge className="bg-blue-50 text-blue-600">ربط العقد بالدفعات</Badge>
            <Badge className="bg-purple-50 text-purple-600">صلاحيات ذكية</Badge>
            <Badge className="bg-rose-50 text-rose-600">ذكاء اصطناعي</Badge>
            <Badge className="bg-cyan-50 text-cyan-600">بحث ذكي</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, color }: any) {
  return (<Card className="rounded-2xl border border-stone-200 overflow-hidden"><CardContent className="p-4 flex items-center gap-3"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div><div><p className="text-xs text-stone-500 font-medium">{label}</p><p className="text-lg font-black text-stone-800">{value}</p></div></CardContent></Card>)
}

// ===================== HR MODULE =====================
function HRModule() {
  const [tab, setTab] = useState<'employees' | 'gratuity' | 'leaves'>('employees')
  const [showLeave, setShowLeave] = useState(false)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">الموارد البشرية</h1>
      <div className="flex gap-2">
        <button onClick={() => setTab('employees')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'employees' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>الموظفون</button>
        <button onClick={() => setTab('gratuity')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'gratuity' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>حاسبة المكافأة</button>
        <button onClick={() => setTab('leaves')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'leaves' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>الإجازات</button>
      </div>
      {tab === 'employees' && <Suspense fallback={<LoadingFallback />}><EmployeesTable /></Suspense>}
      {tab === 'gratuity' && <Suspense fallback={<LoadingFallback />}><GratuityCalculatorView /></Suspense>}
      {tab === 'leaves' && (<div className="space-y-4"><Button onClick={() => setShowLeave(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> طلب إجازة</Button><Suspense fallback={<LoadingFallback />}><LeaveRequestsList /></Suspense><Suspense fallback={<LoadingFallback />}><LeaveRequestForm isOpen={showLeave} onClose={() => setShowLeave(false)} onSaveSuccess={() => {}} /></Suspense></div>)}
    </div>
  )
}

// ===================== ACCOUNTING MODULE =====================
function AccountingModule() {
  const [tab, setTab] = useState<'journal' | 'receipts' | 'vouchers' | 'accounts'>('journal')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المحاسبة</h1>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab('journal')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'journal' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>القيود</button>
        <button onClick={() => setTab('receipts')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'receipts' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>سندات القبض</button>
        <button onClick={() => setTab('vouchers')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'vouchers' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>سندات الصرف</button>
        <button onClick={() => setTab('accounts')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'accounts' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>شجرة الحسابات</button>
      </div>
      {tab === 'journal' && <Suspense fallback={<LoadingFallback />}><JournalEntriesList /></Suspense>}
      {tab === 'receipts' && <Suspense fallback={<LoadingFallback />}><CashReceiptsList /></Suspense>}
      {tab === 'vouchers' && <Suspense fallback={<LoadingFallback />}><PaymentVouchersList /></Suspense>}
      {tab === 'accounts' && <AccountsView />}
    </div>
  )
}

function AccountsView() {
  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: async () => { const r = await fetch('/api/accounts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <Card className="rounded-2xl border overflow-hidden">
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b sticky top-0"><tr><th className="text-right p-3 font-bold">الكود</th><th className="text-right p-3 font-bold">الاسم</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">المستوى</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {(accounts || []).map((a: any) => (
              <tr key={a.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold text-[#F5820D]">{a.code}</td><td className="p-3">{a.name}</td><td className="p-3"><Badge className={a.type === 'asset' ? 'bg-blue-50 text-blue-600' : a.type === 'liability' ? 'bg-red-50 text-red-600' : a.type === 'equity' ? 'bg-purple-50 text-purple-600' : a.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}>{a.type === 'asset' ? 'أصول' : a.type === 'liability' ? 'التزامات' : a.type === 'equity' ? 'حقوق ملكية' : a.type === 'income' ? 'إيرادات' : 'مصروفات'}</Badge></td><td className="p-3 text-stone-600">{a.level}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ===================== APPOINTMENTS MODULE =====================
function AppointmentsModule() {
  const { data: appts, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: async () => { const r = await fetch('/api/appointments'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المواعيد</h1>
      <Card className="rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">العنوان</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">التاريخ</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading && <tr><td colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
              {(appts || []).map((a: any) => (
                <tr key={a.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{a.title}</td><td className="p-3 text-stone-600">{a.clientName || a.client?.nameAr || '—'}</td><td className="p-3 text-stone-600">{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('ar-KW') : '—'}</td><td className="p-3"><Badge className="bg-cyan-50 text-cyan-600">{a.type === 'site-visit' ? 'زيارة موقع' : a.type === 'meeting' ? 'اجتماع' : a.type}</Badge></td><td className="p-3"><Badge className={a.status === 'scheduled' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}>{a.status === 'scheduled' ? 'مجدول' : a.status === 'confirmed' ? 'مؤكد' : a.status}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ===================== REPORTS MODULE =====================
function ReportsModule() {
  const { data: kpis } = useQuery({ queryKey: ['dashboard'], queryFn: async () => { const r = await fetch('/api/dashboard'); if (!r.ok) return null; const j = await r.json(); return j.data?.kpis || null } })
  const k = kpis || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-stone-800">التقارير</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">ملخص الموارد البشرية</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">إجمالي الموظفين</span><span className="font-bold">{k.totalEmployees}</span></div><div className="flex justify-between"><span className="text-stone-500">طلبات إجازة معلقة</span><span className="font-bold">{k.pendingLeaveRequests}</span></div><div className="flex justify-between"><span className="text-stone-500">مهام معلقة</span><span className="font-bold">{k.pendingTasks}</span></div></div></Card>
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">ملخص مالي</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">إجمالي العملاء</span><span className="font-bold">{k.totalClients}</span></div><div className="flex justify-between"><span className="text-stone-500">المشاريع النشطة</span><span className="font-bold">{k.activeProjects}</span></div><div className="flex justify-between"><span className="text-stone-500">إجمالي الإيرادات</span><span className="font-bold">{formatCurrency(k.totalRevenue)}</span></div></div></Card>
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">تقارير متقدمة</h3><div className="space-y-2"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><BarChart3 className="h-4 w-4" /> تقرير ربحية المشاريع</Button><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Users className="h-4 w-4" /> تقرير أداء الأقسام</Button><Button variant="outline" size="sm" className="w-full justify-start gap-2"><DollarSign className="h-4 w-4" /> تدفق نقدي</Button></div></Card>
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">تقارير HR</h3><div className="space-y-2"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><UserCircle className="h-4 w-4" /> ملف الموظف الكامل</Button><Button variant="outline" size="sm" className="w-full justify-start gap-2"><CalendarDays className="h-4 w-4" /> أرصدة الإجازات</Button><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Briefcase className="h-4 w-4" /> تقرير الرواتب</Button></div></Card>
      </div>
    </div>
  )
}

// ===================== SETTINGS MODULE =====================
function SettingsModule() {
  const { data: governorates } = useQuery({ queryKey: ['settings-gov'], queryFn: async () => { const r = await fetch('/api/governorates'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: departments } = useQuery({ queryKey: ['settings-dept'], queryFn: async () => { const r = await fetch('/api/departments?withJobs=true'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-stone-800">الإعدادات</h1>
      <Card className="rounded-2xl border p-6">
        <h3 className="font-black text-stone-800 mb-3">القوائم المرجعية الكويتية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-xs font-bold text-stone-500 mb-2">المحافظات ({governorates?.length || 0})</p><div className="flex flex-wrap gap-1">{(governorates || []).map((g: any) => <Badge key={g.id} className="bg-blue-50 text-blue-600">{g.name}</Badge>)}</div></div>
          <div><p className="text-xs font-bold text-stone-500 mb-2">الأقسام ({departments?.length || 0})</p><div className="flex flex-wrap gap-1">{(departments || []).map((d: any) => <Badge key={d.id} className="bg-emerald-50 text-emerald-600">{d.name}</Badge>)}</div></div>
        </div>
      </Card>
      <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">معلومات النظام</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">الإصدار</span><span className="font-bold">Nova ERP v1.0 (Prisma)</span></div><div className="flex justify-between"><span className="text-stone-500">قاعدة البيانات</span><span className="font-bold">SQLite + Prisma ORM</span></div><div className="flex justify-between"><span className="text-stone-500">المصادقة</span><span className="font-bold">NextAuth (JWT)</span></div><div className="flex justify-between"><span className="text-stone-500">الذكاء الاصطناعي</span><span className="font-bold">z-ai-web-dev-sdk</span></div></div></Card>
    </div>
  )
}
