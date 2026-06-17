'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, LogIn, LogOut, Users, Building2, DollarSign, Briefcase, CalendarDays, FileText, Settings as SettingsIcon, HardHat, ShoppingCart, BarChart3, CreditCard, UserCircle, Calculator, Plus, Search, Phone, Mail, MapPin, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { GratuityCalculatorView } from '@/components/hr/gratuity-calculator-view'
import { LeaveRequestForm } from '@/components/hr/leave-request-form'
import { ContractClausesForm } from '@/components/clients/contract-clauses-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

type Module = 'dashboard' | 'clients' | 'hr' | 'accounting' | 'contracts' | 'projects' | 'appointments' | 'billing' | 'reports' | 'construction' | 'purchasing' | 'settings'

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
  ]},
  { title: 'النظام', items: [
    { id: 'settings', labelAr: 'الإعدادات', icon: SettingsIcon, color: 'text-gray-600' },
  ]},
]

export default function Home() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nova-erp.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [activeModule, setActiveModule] = useState<Module>('dashboard')

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4" dir="rtl">
        <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-[#F5820D] to-[#FF8F00] p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">Nova ERP</h1>
            <p className="text-white/80 text-sm mt-1">نظام إدارة موارد المؤسسات للسوق الكويتي</p>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">البريد الإلكتروني</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl border-2" placeholder="admin@nova-erp.com" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">كلمة المرور</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl border-2" placeholder="••••••••" />
            </div>
            <Button onClick={() => { setLoading(true); signIn('credentials', { email, password, redirect: true, callbackUrl: '/' }) }} disabled={loading} className="w-full h-12 rounded-xl font-black text-lg gap-2 bg-[#F5820D] hover:bg-[#C45600]">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />} دخول
            </Button>
            <p className="text-center text-xs text-muted-foreground">تجريبي: admin@nova-erp.com / admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AppShell activeModule={activeModule} setActiveModule={setActiveModule} session={session} />
}

function AppShell({ activeModule, setActiveModule, session }: any) {
  return (
    <div className="min-h-screen flex bg-stone-50" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-stone-200 flex flex-col shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div><h1 className="font-black text-sm">Nova ERP</h1><p className="text-[10px] text-muted-foreground">الإصدار 1.0</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          <button onClick={() => setActiveModule('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeModule === 'dashboard' ? 'bg-[#F5820D] text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <BarChart3 className="h-4 w-4" /> لوحة التحكم
          </button>
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
      <main className="flex-1 overflow-auto p-6">
        {activeModule === 'dashboard' && <DashboardView />}
        {activeModule === 'clients' && <ClientsView />}
        {activeModule === 'hr' && <HRView />}
        {activeModule === 'accounting' && <AccountingView />}
        {activeModule === 'contracts' && <ContractsView />}
        {!['dashboard', 'clients', 'hr', 'accounting', 'contracts'].includes(activeModule) && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                {(() => { const Icon = navSections.flatMap(s => s.items).find(i => i.id === activeModule)?.icon || BarChart3; return <Icon className="h-8 w-8 text-stone-400" /> })()}
              </div>
              <h2 className="text-xl font-black text-stone-700">{navSections.flatMap(s => s.items).find(i => i.id === activeModule)?.labelAr || 'الوحدة'}</h2>
              <p className="text-sm text-stone-500 mt-2">هذه الوحدة جاهزة للربط. سيتم تفعيلها في الجلسة القادمة.</p>
              <Badge className="mt-4 bg-orange-50 text-[#F5820D]">قيد التطوير</Badge>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ===================== DASHBOARD =====================
function DashboardView() {
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => { const r = await fetch('/api/dashboard'); if (!r.ok) return null; const j = await r.json(); return j.data?.kpis || null },
  })
  const kpis = dashData || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black text-stone-800">لوحة التحكم</h1><p className="text-sm text-stone-500">نظرة عامة على النظام</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="إجمالي العملاء" value={kpis.totalClients} color="bg-blue-50 text-blue-600" />
        <KpiCard icon={Briefcase} label="المشاريع النشطة" value={kpis.activeProjects} color="bg-purple-50 text-purple-600" />
        <KpiCard icon={DollarSign} label="إجمالي الإيرادات" value={formatCurrency(kpis.totalRevenue)} color="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={UserCircle} label="الموظفون" value={kpis.totalEmployees} color="bg-sky-50 text-sky-600" />
        <KpiCard icon={CalendarDays} label="طلبات إجازة معلقة" value={kpis.pendingLeaveRequests} color="bg-orange-50 text-orange-600" />
        <KpiCard icon={FileText} label="مهام معلقة" value={kpis.pendingTasks} color="bg-rose-50 text-rose-600" />
      </div>
      <Card className="rounded-2xl border border-stone-200">
        <CardHeader><CardTitle className="text-lg">مرحباً بك في Nova ERP</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-stone-600 leading-relaxed">نظام إدارة موارد المؤسسات المصمم خصيصاً لمكاتب الهندسة وشركات المقاولات في الكويت. يدعم القانون الكويتي (المواد 41، 51، 53)، المحافظات الكويتية، الدينار الكويتي، والعربية بـ RTL كامل.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-orange-50 text-[#F5820D]">قانون العمل الكويتي</Badge>
            <Badge className="bg-emerald-50 text-emerald-600">شجرة حسابات كاملة</Badge>
            <Badge className="bg-blue-50 text-blue-600">ربط العقد بالدفعات</Badge>
            <Badge className="bg-purple-50 text-purple-600">صلاحيات ذكية</Badge>
            <Badge className="bg-rose-50 text-rose-600">ذكاء اصطناعي</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="rounded-2xl border border-stone-200 overflow-hidden">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
        <div><p className="text-xs text-stone-500 font-medium">{label}</p><p className="text-lg font-black text-stone-800">{value}</p></div>
      </CardContent>
    </Card>
  )
}

// ===================== CLIENTS =====================
function ClientsView() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newClient, setNewClient] = useState({ nameAr: '', mobile: '', governorate: '', email: '' })
  const queryClient = useQueryClient()

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients-list'],
    queryFn: async () => { const r = await fetch('/api/clients?page=1&limit=100'); if (!r.ok) return []; const j = await r.json(); return j.data || [] },
  })

  const clients = (clientsData || []).filter((c: any) => !search || (c.nameAr || '').includes(search) || (c.nameEn || '').includes(search) || (c.mobile || '').includes(search))

  const handleAdd = async () => {
    const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newClient, companyId: 'company-1' }) })
    if (res.ok) { queryClient.invalidateQueries({ queryKey: ['clients-list'] }); setShowAdd(false); setNewClient({ nameAr: '', mobile: '', governorate: '', email: '' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-stone-800">العملاء</h1><p className="text-sm text-stone-500">{clients.length} عميل</p></div>
        <Button onClick={() => setShowAdd(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> عميل جديد</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الجوال..." className="pr-10 h-11 rounded-xl border-2" />
      </div>

      <Card className="rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b">
              <tr>
                <th className="text-right p-3 font-bold text-stone-600">الاسم</th>
                <th className="text-right p-3 font-bold text-stone-600">الجوال</th>
                <th className="text-right p-3 font-bold text-stone-600">المحافظة</th>
                <th className="text-right p-3 font-bold text-stone-600">الحالة</th>
                <th className="text-right p-3 font-bold text-stone-600">النوع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading && <tr><td colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
              {clients.length === 0 && !isLoading && <tr><td colSpan={5} className="text-center py-8 text-stone-400">لا يوجد عملاء</td></tr>}
              {clients.map((c: any) => (
                <tr key={c.id} className="hover:bg-stone-50 cursor-pointer">
                  <td className="p-3 font-bold">{c.nameAr || c.nameEn || '—'}</td>
                  <td className="p-3 text-stone-600"><span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.mobile || '—'}</span></td>
                  <td className="p-3 text-stone-600">{c.governorate || '—'}</td>
                  <td className="p-3"><Badge className={c.status === 'contracted' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}>{c.status === 'contracted' ? 'متعاقد' : c.status === 'new' ? 'جديد' : c.status}</Badge></td>
                  <td className="p-3 text-stone-600">{c.clientType === 'registered' ? 'مسجل' : 'محتمل'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent dir="rtl" className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black">إضافة عميل جديد</DialogTitle></DialogHeader>
          <div className="space-y-3 p-4">
            <div><Label className="font-bold">الاسم (عربي) *</Label><Input value={newClient.nameAr} onChange={e => setNewClient({ ...newClient, nameAr: e.target.value })} className="h-11 rounded-xl border-2" placeholder="مثال: محمد عبدالله" /></div>
            <div><Label className="font-bold">الجوال *</Label><Input value={newClient.mobile} onChange={e => setNewClient({ ...newClient, mobile: e.target.value })} className="h-11 rounded-xl border-2" placeholder="XXXXXXXXX05" /></div>
            <div><Label className="font-bold">المحافظة</Label><Input value={newClient.governorate} onChange={e => setNewClient({ ...newClient, governorate: e.target.value })} className="h-11 rounded-xl border-2" placeholder="العاصمة" /></div>
            <div><Label className="font-bold">البريد الإلكتروني</Label><Input value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} className="h-11 rounded-xl border-2" placeholder="email@example.com" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button><Button onClick={handleAdd} className="bg-[#F5820D] hover:bg-[#C45600]">حفظ</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===================== HR =====================
function HRView() {
  const [hrTab, setHrTab] = useState<'employees' | 'gratuity' | 'leaves'>('employees')
  const [showLeave, setShowLeave] = useState(false)

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees-hr'],
    queryFn: async () => { const r = await fetch('/api/employees?limit=200'); if (!r.ok) return []; const j = await r.json(); return j.data || [] },
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black text-stone-800">الموارد البشرية</h1><p className="text-sm text-stone-500">إدارة الموظفين والإجازات والمكافآت</p></div>

      <div className="flex gap-2">
        <button onClick={() => setHrTab('employees')} className={`px-4 py-2 rounded-xl text-sm font-bold ${hrTab === 'employees' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>الموظفون</button>
        <button onClick={() => setHrTab('gratuity')} className={`px-4 py-2 rounded-xl text-sm font-bold ${hrTab === 'gratuity' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>حاسبة المكافأة</button>
        <button onClick={() => setHrTab('leaves')} className={`px-4 py-2 rounded-xl text-sm font-bold ${hrTab === 'leaves' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>الإجازات</button>
      </div>

      {hrTab === 'employees' && (
        <Card className="rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b">
                <tr>
                  <th className="text-right p-3 font-bold text-stone-600">الاسم</th>
                  <th className="text-right p-3 font-bold text-stone-600">الرقم الوظيفي</th>
                  <th className="text-right p-3 font-bold text-stone-600">القسم</th>
                  <th className="text-right p-3 font-bold text-stone-600">المسمى</th>
                  <th className="text-right p-3 font-bold text-stone-600">الراتب</th>
                  <th className="text-right p-3 font-bold text-stone-600">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {isLoading && <tr><td colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
                {(employees || []).map((e: any) => (
                  <tr key={e.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold">{e.fullName}</td>
                    <td className="p-3 text-stone-600 font-mono">{e.employeeNumber}</td>
                    <td className="p-3 text-stone-600">{e.department || '—'}</td>
                    <td className="p-3 text-stone-600">{e.jobTitle || '—'}</td>
                    <td className="p-3 text-stone-600 font-mono">{formatCurrency(e.totalSalary || 0)}</td>
                    <td className="p-3"><Badge className={e.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}>{e.status === 'active' ? 'نشط' : e.status === 'terminated' ? 'منتهي' : e.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {hrTab === 'gratuity' && <GratuityCalculatorView />}

      {hrTab === 'leaves' && (
        <div className="space-y-4">
          <Button onClick={() => setShowLeave(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> طلب إجازة جديد</Button>
          <LeavesList />
          <LeaveRequestForm isOpen={showLeave} onClose={() => setShowLeave(false)} onSaveSuccess={() => {}} />
        </div>
      )}
    </div>
  )
}

function LeavesList() {
  const { data: leaves, isLoading } = useQuery({
    queryKey: ['leaves-list'],
    queryFn: async () => { const r = await fetch('/api/leave-requests'); if (!r.ok) return []; const j = await r.json(); return j.data || [] },
  })
  return (
    <Card className="rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">الموظف</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">من</th><th className="text-right p-3 font-bold">إلى</th><th className="text-right p-3 font-bold">الأيام</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading && <tr><td colSpan={6} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin mx-auto text-stone-400" /></td></tr>}
            {(leaves || []).length === 0 && !isLoading && <tr><td colSpan={6} className="text-center py-6 text-stone-400">لا توجد طلبات إجازة</td></tr>}
            {(leaves || []).map((l: any) => (
              <tr key={l.id} className="hover:bg-stone-50">
                <td className="p-3 font-bold">{l.employee?.fullName || '—'}</td>
                <td className="p-3">{l.leaveType === 'Annual' ? 'سنوية' : l.leaveType === 'Sick' ? 'مرضية' : l.leaveType === 'Emergency' ? 'طارئة' : 'بدون أجر'}</td>
                <td className="p-3 text-stone-600">{l.startDate ? new Date(l.startDate).toLocaleDateString('ar-KW') : '—'}</td>
                <td className="p-3 text-stone-600">{l.endDate ? new Date(l.endDate).toLocaleDateString('ar-KW') : '—'}</td>
                <td className="p-3 text-stone-600">{l.totalDays}</td>
                <td className="p-3"><Badge className={l.status === 'pending' ? 'bg-amber-50 text-amber-600' : l.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}>{l.status === 'pending' ? 'معلق' : l.status === 'approved' ? 'موافق' : 'مرفوض'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ===================== ACCOUNTING =====================
function AccountingView() {
  const [accTab, setAccTab] = useState<'accounts' | 'journal'>('accounts')
  const { data: accounts } = useQuery({
    queryKey: ['accounts-list'],
    queryFn: async () => { const r = await fetch('/api/accounts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] },
  })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black text-stone-800">المحاسبة</h1><p className="text-sm text-stone-500">شجرة الحسابات والقيود المحاسبية</p></div>
      <div className="flex gap-2">
        <button onClick={() => setAccTab('accounts')} className={`px-4 py-2 rounded-xl text-sm font-bold ${accTab === 'accounts' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>شجرة الحسابات</button>
        <button onClick={() => setAccTab('journal')} className={`px-4 py-2 rounded-xl text-sm font-bold ${accTab === 'journal' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600'}`}>القيود اليومية</button>
      </div>
      {accTab === 'accounts' && (
        <Card className="rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b sticky top-0"><tr><th className="text-right p-3 font-bold">الكود</th><th className="text-right p-3 font-bold">الاسم</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">المستوى</th><th className="text-right p-3 font-bold">القائمة</th></tr></thead>
              <tbody className="divide-y divide-stone-100">
                {(accounts || []).map((a: any) => (
                  <tr key={a.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-[#F5820D]">{a.code}</td>
                    <td className="p-3">{a.name}</td>
                    <td className="p-3"><Badge className={a.type === 'asset' ? 'bg-blue-50 text-blue-600' : a.type === 'liability' ? 'bg-red-50 text-red-600' : a.type === 'equity' ? 'bg-purple-50 text-purple-600' : a.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}>{a.type === 'asset' ? 'أصول' : a.type === 'liability' ? 'التزامات' : a.type === 'equity' ? 'حقوق ملكية' : a.type === 'income' ? 'إيرادات' : 'مصروفات'}</Badge></td>
                    <td className="p-3 text-stone-600">{a.level}</td>
                    <td className="p-3 text-stone-600">{a.statement === 'Balance Sheet' ? 'الميزانية' : 'قائمة الدخل'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {accTab === 'journal' && <Card className="rounded-2xl border p-8 text-center text-stone-400">سيتم إضافة القيود اليومية في الجلسة القادمة</Card>}
    </div>
  )
}

// ===================== CONTRACTS =====================
function ContractsView() {
  const [showActivate, setShowActivate] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-stone-800">العقود وعروض الأسعار</h1><p className="text-sm text-stone-500">إدارة العقود وربطها بالدفعات</p></div>
        <Button onClick={() => setShowActivate(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><FileText className="h-4 w-4" /> تفعيل عقد</Button>
      </div>
      <Card className="rounded-2xl border p-8 text-center">
        <FileText className="h-12 w-12 mx-auto mb-3 text-stone-300" />
        <p className="text-stone-500 font-bold">وحدة العقود</p>
        <p className="text-sm text-stone-400 mt-1">استخدم "تفعيل عقد" لربط بنود العقد بمراحل العمل والدفعات</p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge className="bg-blue-50 text-blue-600">ربط العقد بالدفعات</Badge>
          <Badge className="bg-emerald-50 text-emerald-600">نسب مئوية / مبالغ ثابتة</Badge>
          <Badge className="bg-orange-50 text-orange-600">ربط بمراحل العمل</Badge>
        </div>
      </Card>
      <ContractClausesForm isOpen={showActivate} onClose={() => setShowActivate(false)} transaction={null} clientId="client-1" clientName="شركة النور للإنشاءات" />
    </div>
  )
}
