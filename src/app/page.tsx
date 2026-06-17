'use client'

import { useState, lazy, Suspense } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, LogIn, LogOut, Users, Building2, DollarSign, Briefcase, CalendarDays, FileText, Settings as SettingsIcon, HardHat, ShoppingCart, BarChart3, CreditCard, UserCircle, Calculator, Plus, Search, Phone, Mail, MapPin, Trash2, Edit, Eye, X, Download, TrendingUp, TrendingDown, Clock, Shield, Banknote, BookOpen, Receipt, ChevronRight, ChevronLeft, Bell } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { findNavigation } from '@/ai/tools/find-navigation'
import { OfflineIndicator, SyncStatusProvider } from '@/context/sync-context'
import SystemExpertChatWidget from '@/components/ai/chat-widget'
import { GratuityCalculatorView } from '@/components/hr/gratuity-calculator-view'
import { LeaveRequestForm } from '@/components/hr/leave-request-form'
import { ContractClausesForm } from '@/components/clients/contract-clauses-form'
import { toDateSafe } from '@/services/date-converter'
import { useTheme } from 'next-themes'

type Module = 'dashboard' | 'clients' | 'hr' | 'accounting' | 'contracts' | 'projects' | 'appointments' | 'billing' | 'reports' | 'construction' | 'purchasing' | 'warehouse' | 'settings'

const KWD = (n: number) => formatCurrency(n)

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nova-erp.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [activeModule, setActiveModule] = useState<Module>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" /></div>

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
    if (q.trim().length >= 2) { const r = findNavigation(q); setSearchResults(r ? [r] : []) }
    else setSearchResults(null)
  }

  const navSections: { title: string; items: { id: Module; labelAr: string; icon: any; color: string }[] }[] = [
    { title: 'العمليات', items: [
      { id: 'clients', labelAr: 'العملاء', icon: Users, color: 'text-blue-600' },
      { id: 'projects', labelAr: 'المشاريع', icon: Building2, color: 'text-purple-600' },
      { id: 'contracts', labelAr: 'العقود', icon: FileText, color: 'text-orange-600' },
      { id: 'appointments', labelAr: 'المواعيد', icon: CalendarDays, color: 'text-cyan-600' },
    ]},
    { title: 'المالية', items: [
      { id: 'accounting', labelAr: 'المحاسبة', icon: Calculator, color: 'text-emerald-600' },
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

  return (
    <div className="min-h-screen flex bg-stone-50" dir="rtl">
      <aside className="w-64 bg-white border-l border-stone-200 flex flex-col shrink-0">
        <div className="p-4 border-b"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-xl flex items-center justify-center"><Building2 className="h-5 w-5 text-white" /></div><div><h1 className="font-black text-sm">Nova ERP</h1><p className="text-[10px] text-muted-foreground">v1.0 — Prisma</p></div></div></div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          <button onClick={() => setActiveModule('dashboard')} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all', activeModule === 'dashboard' ? 'bg-[#F5820D] text-white' : 'text-stone-600 hover:bg-stone-100')}><BarChart3 className="h-4 w-4" /> لوحة التحكم</button>
          {navSections.map(section => (
            <div key={section.title}>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider px-3 mb-1">{section.title}</p>
              {section.items.map(item => { const Icon = item.icon; return (
                <button key={item.id} onClick={() => setActiveModule(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all', activeModule === item.id ? 'bg-orange-50 text-[#F5820D]' : 'text-stone-600 hover:bg-stone-100')}>
                  <Icon className={cn('h-4 w-4', activeModule === item.id ? 'text-[#F5820D]' : item.color)} /> {item.labelAr}
                </button>
              )})}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold">{(session.user as any)?.name?.charAt(0) || 'A'}</div><div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{(session.user as any)?.name || 'Admin'}</p><p className="text-[10px] text-muted-foreground">{(session.user as any)?.role || 'admin'}</p></div></div>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="w-full text-xs gap-1 text-stone-500"><LogOut className="h-3 w-3" /> خروج</Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b px-6 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-md"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" /><Input value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="ابحث عن صفحة أو ميزة..." className="pr-10 h-10 rounded-xl border-2 bg-stone-50" />
            {searchResults && searchResults.length > 0 && (<div className="absolute top-12 right-0 w-full bg-white rounded-xl shadow-2xl border p-2 z-50">{searchResults.map((r, i) => (<button key={i} onClick={() => { setSearchResults(null); setSearchQuery('') }} className="w-full text-right px-3 py-2 rounded-lg hover:bg-stone-100 text-sm font-bold">{r.name}</button>))}</div>)}
          </div>
          <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5 text-stone-500" /><span className="absolute top-1 right-1 w-2 h-2 bg-[#F5820D] rounded-full" /></Button>
        </div>
        <div className="p-6">
          {activeModule === 'dashboard' && <DashboardView />}
          {activeModule === 'clients' && <ClientsView />}
          {activeModule === 'hr' && <HRView />}
          {activeModule === 'accounting' && <AccountingView />}
          {activeModule === 'contracts' && <ContractsView />}
          {activeModule === 'projects' && <ProjectsView />}
          {activeModule === 'appointments' && <AppointmentsView />}
          {activeModule === 'construction' && <ConstructionView />}
          {activeModule === 'purchasing' && <PurchasingView />}
          {activeModule === 'warehouse' && <WarehouseView />}
          {activeModule === 'reports' && <ReportsView />}
          {activeModule === 'settings' && <SettingsView />}
        </div>
      </main>
      <SystemExpertChatWidget />
      <SyncStatusProvider><OfflineIndicator /></SyncStatusProvider>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardView() {
  const { data: k } = useQuery({ queryKey: ['dashboard'], queryFn: async () => { const r = await fetch('/api/dashboard'); if (!r.ok) return null; const j = await r.json(); return j.data?.kpis || null } })
  const d = k || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black text-stone-800">لوحة التحكم</h1><p className="text-sm text-stone-500">نظرة عامة على النظام</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={Users} label="العملاء" value={d.totalClients} color="bg-blue-50 text-blue-600" />
        <Kpi icon={Briefcase} label="المشاريع" value={d.activeProjects} color="bg-purple-50 text-purple-600" />
        <Kpi icon={DollarSign} label="الإيرادات" value={KWD(d.totalRevenue)} color="bg-emerald-50 text-emerald-600" />
        <Kpi icon={UserCircle} label="الموظفون" value={d.totalEmployees} color="bg-sky-50 text-sky-600" />
        <Kpi icon={CalendarDays} label="إجازات معلقة" value={d.pendingLeaveRequests} color="bg-orange-50 text-orange-600" />
        <Kpi icon={FileText} label="مهام معلقة" value={d.pendingTasks} color="bg-rose-50 text-rose-600" />
      </div>
      <Card className="rounded-2xl border border-stone-200"><CardHeader><CardTitle className="text-lg">مرحباً بك في Nova ERP</CardTitle></CardHeader><CardContent><p className="text-sm text-stone-600 leading-relaxed">نظام إدارة موارد المؤسسات المصمم خصيصاً لمكاتب الهندسة وشركات المقاولات في الكويت. يدعم القانون الكويتي (المواد 41، 51، 53)، المحافظات الكويتية، الدينار الكويتي، والعربية بـ RTL كامل.</p>
        <div className="flex flex-wrap gap-2 mt-4"><Badge className="bg-orange-50 text-[#F5820D]">قانون العمل الكويتي</Badge><Badge className="bg-emerald-50 text-emerald-600">66 حساب محاسبي</Badge><Badge className="bg-blue-50 text-blue-600">ربط العقد بالدفعات</Badge><Badge className="bg-purple-50 text-purple-600">صلاحيات ذكية</Badge><Badge className="bg-rose-50 text-rose-600">ذكاء اصطناعي</Badge></div>
      </CardContent></Card>
    </div>
  )
}
function Kpi({ icon: Icon, label, value, color }: any) {
  return <Card className="rounded-2xl border border-stone-200 overflow-hidden"><CardContent className="p-4 flex items-center gap-3"><div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', color)}><Icon className="h-5 w-5" /></div><div><p className="text-xs text-stone-500 font-medium">{label}</p><p className="text-lg font-black text-stone-800">{value}</p></div></CardContent></Card>
}

// ═══════════════════════════════════════════════════════════════
// CLIENTS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function ClientsView() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [form, setForm] = useState({ nameAr: '', nameEn: '', mobile: '', phone: '', email: '', governorate: '', city: '', address: '', status: 'new', clientType: 'registered' })
  const qc = useQueryClient()
  const { data: clients, isLoading } = useQuery({ queryKey: ['clients'], queryFn: async () => { const r = await fetch('/api/clients?page=1&limit=200'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: governorates } = useQuery({ queryKey: ['govs'], queryFn: async () => { const r = await fetch('/api/governorates'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const filtered = (clients || []).filter((c: any) => !search || (c.nameAr || '').includes(search) || (c.nameEn || '').includes(search) || (c.mobile || '').includes(search))

  const addMutation = useMutation({ mutationFn: async (data: any) => { const cid = (await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())).data?.id; return cid }, onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); setShowAdd(false); setForm({ nameAr: '', nameEn: '', mobile: '', phone: '', email: '', governorate: '', city: '', address: '', status: 'new', clientType: 'registered' }) } })
  const deleteMutation = useMutation({ mutationFn: async (id: string) => fetch(`/api/clients/${id}`, { method: 'DELETE' }), onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }) })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-black text-stone-800">العملاء</h1><p className="text-sm text-stone-500">{filtered.length} عميل</p></div><div className="flex gap-2"><Button onClick={() => setShowAdd(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> عميل جديد</Button></div></div>
      <div className="relative max-w-sm"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الجوال..." className="pr-10 h-11 rounded-xl border-2" /></div>
      <Card className="rounded-2xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold text-stone-600">الاسم</th><th className="text-right p-3 font-bold text-stone-600">الجوال</th><th className="text-right p-3 font-bold text-stone-600">المحافظة</th><th className="text-right p-3 font-bold text-stone-600">الحالة</th><th className="text-right p-3 font-bold text-stone-600">إجراءات</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading && <tr><td colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
            {filtered.length === 0 && !isLoading && <tr><td colSpan={5} className="text-center py-8 text-stone-400">لا يوجد عملاء</td></tr>}
            {filtered.map((c: any) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="p-3 font-bold">{c.nameAr || c.nameEn || '—'}</td>
                <td className="p-3 text-stone-600">{c.mobile || '—'}</td>
                <td className="p-3 text-stone-600">{c.governorate || '—'}</td>
                <td className="p-3"><Badge className={c.status === 'contracted' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}>{c.status === 'contracted' ? 'متعاقد' : c.status === 'new' ? 'جديد' : c.status}</Badge></td>
                <td className="p-3"><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedClient(c); setShowContract(true) }}><FileText className="h-4 w-4 text-[#F5820D]" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm('حذف هذا العميل؟')) deleteMutation.mutate(c.id) }}><Trash2 className="h-4 w-4" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      <Dialog open={showAdd} onOpenChange={setShowAdd}><DialogContent dir="rtl" className="max-w-md rounded-2xl"><DialogHeader><DialogTitle className="font-black">إضافة عميل جديد</DialogTitle></DialogHeader>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3"><div><Label className="font-bold">الاسم (عربي) *</Label><Input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} className="h-11 rounded-xl border-2" /></div><div><Label className="font-bold">الاسم (إنجليزي)</Label><Input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><Label className="font-bold">الجوال *</Label><Input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="h-11 rounded-xl border-2" /></div><div><Label className="font-bold">الهاتف</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div><Label className="font-bold">البريد الإلكتروني</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl border-2" /></div>
          <div className="grid grid-cols-2 gap-3"><div><Label className="font-bold">المحافظة</Label><Select value={form.governorate} onValueChange={v => setForm({ ...form, governorate: v })}><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue placeholder="اختر..." /></SelectTrigger><SelectContent dir="rtl">{(governorates || []).map((g: any) => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}</SelectContent></Select></div><div><Label className="font-bold">المدينة</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div><Label className="font-bold">العنوان</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="h-11 rounded-xl border-2" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button><Button onClick={() => addMutation.mutate(form)} disabled={!form.nameAr || !form.mobile} className="bg-[#F5820D] hover:bg-[#C45600]">حفظ</Button></DialogFooter>
      </DialogContent></Dialog>
      {selectedClient && <ContractClausesForm isOpen={showContract} onClose={() => { setShowContract(false); setSelectedClient(null) }} transaction={null} clientId={selectedClient.id} clientName={selectedClient.nameAr || selectedClient.nameEn} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HR — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function HRView() {
  const [tab, setTab] = useState<'employees' | 'gratuity' | 'leaves' | 'attendance'>('employees')
  const [showLeave, setShowLeave] = useState(false)
  const [showAddEmp, setShowAddEmp] = useState(false)
  const [empForm, setEmpForm] = useState({ fullName: '', department: '', jobTitle: '', basicSalary: '', housingAllowance: '', transportAllowance: '', mobile: '', civilId: '', hireDate: '' })
  const qc = useQueryClient()
  const { data: employees, isLoading } = useQuery({ queryKey: ['employees'], queryFn: async () => { const r = await fetch('/api/employees?limit=200'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: leaves } = useQuery({ queryKey: ['leaves'], queryFn: async () => { const r = await fetch('/api/leave-requests'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: departments } = useQuery({ queryKey: ['depts'], queryFn: async () => { const r = await fetch('/api/departments'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const addEmpMut = useMutation({ mutationFn: async (d: any) => fetch('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); setShowAddEmp(false); setEmpForm({ fullName: '', department: '', jobTitle: '', basicSalary: '', housingAllowance: '', transportAllowance: '', mobile: '', civilId: '', hireDate: '' }) } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-stone-800">الموارد البشرية</h1>{tab === 'employees' && <Button onClick={() => setShowAddEmp(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> موظف جديد</Button>}</div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab('employees')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'employees' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>الموظفون ({employees?.length || 0})</button>
        <button onClick={() => setTab('gratuity')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'gratuity' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>حاسبة المكافأة</button>
        <button onClick={() => setTab('leaves')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'leaves' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>الإجازات ({leaves?.length || 0})</button>
      </div>
      {tab === 'employees' && (
        <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">الاسم</th><th className="text-right p-3 font-bold">الرقم الوظيفي</th><th className="text-right p-3 font-bold">القسم</th><th className="text-right p-3 font-bold">المسمى</th><th className="text-right p-3 font-bold">الراتب</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading && <tr><td colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
            {(employees || []).map((e: any) => (<tr key={e.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{e.fullName}</td><td className="p-3 font-mono text-stone-600">{e.employeeNumber}</td><td className="p-3 text-stone-600">{e.department || '—'}</td><td className="p-3 text-stone-600">{e.jobTitle || '—'}</td><td className="p-3 font-mono">{KWD(e.totalSalary || 0)}</td><td className="p-3"><Badge className={e.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}>{e.status === 'active' ? 'نشط' : 'منتهي'}</Badge></td></tr>))}
          </tbody>
        </table></div></Card>
      )}
      {tab === 'gratuity' && <GratuityCalculatorView />}
      {tab === 'leaves' && (<div className="space-y-4"><Button onClick={() => setShowLeave(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><Plus className="h-4 w-4" /> طلب إجازة</Button>
        <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">الموظف</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">من</th><th className="text-right p-3 font-bold">إلى</th><th className="text-right p-3 font-bold">الأيام</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead>
          <tbody className="divide-y divide-stone-100">{(leaves || []).map((l: any) => (<tr key={l.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{l.employee?.fullName || '—'}</td><td className="p-3">{l.leaveType === 'Annual' ? 'سنوية' : l.leaveType === 'Sick' ? 'مرضية' : l.leaveType === 'Emergency' ? 'طارئة' : 'بدون أجر'}</td><td className="p-3 text-stone-600">{l.startDate ? new Date(l.startDate).toLocaleDateString('ar-KW') : '—'}</td><td className="p-3 text-stone-600">{l.endDate ? new Date(l.endDate).toLocaleDateString('ar-KW') : '—'}</td><td className="p-3 text-stone-600">{l.totalDays}</td><td className="p-3"><Badge className={l.status === 'pending' ? 'bg-amber-50 text-amber-600' : l.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}>{l.status === 'pending' ? 'معلق' : l.status === 'approved' ? 'موافق' : 'مرفوض'}</Badge></td></tr>))}</tbody>
        </table></div></Card>
        <LeaveRequestForm isOpen={showLeave} onClose={() => setShowLeave(false)} onSaveSuccess={() => qc.invalidateQueries({ queryKey: ['leaves'] })} />
      </div>)}
      <Dialog open={showAddEmp} onOpenChange={setShowAddEmp}><DialogContent dir="rtl" className="max-w-md rounded-2xl"><DialogHeader><DialogTitle className="font-black">إضافة موظف جديد</DialogTitle></DialogHeader>
        <div className="space-y-3 p-4">
          <div><Label className="font-bold">الاسم الكامل *</Label><Input value={empForm.fullName} onChange={e => setEmpForm({ ...empForm, fullName: e.target.value })} className="h-11 rounded-xl border-2" /></div>
          <div className="grid grid-cols-2 gap-3"><div><Label className="font-bold">القسم</Label><Select value={empForm.department} onValueChange={v => setEmpForm({ ...empForm, department: v })}><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue placeholder="اختر..." /></SelectTrigger><SelectContent dir="rtl">{(departments || []).map((d: any) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select></div><div><Label className="font-bold">المسمى الوظيفي</Label><Input value={empForm.jobTitle} onChange={e => setEmpForm({ ...empForm, jobTitle: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div className="grid grid-cols-3 gap-3"><div><Label className="font-bold">الراتب الأساسي</Label><Input type="number" value={empForm.basicSalary} onChange={e => setEmpForm({ ...empForm, basicSalary: e.target.value })} className="h-11 rounded-xl border-2" /></div><div><Label className="font-bold">بدل سكن</Label><Input type="number" value={empForm.housingAllowance} onChange={e => setEmpForm({ ...empForm, housingAllowance: e.target.value })} className="h-11 rounded-xl border-2" /></div><div><Label className="font-bold">بدل مواصلات</Label><Input type="number" value={empForm.transportAllowance} onChange={e => setEmpForm({ ...empForm, transportAllowance: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><Label className="font-bold">الجوال</Label><Input value={empForm.mobile} onChange={e => setEmpForm({ ...empForm, mobile: e.target.value })} className="h-11 rounded-xl border-2" /></div><div><Label className="font-bold">الرقم المدني</Label><Input value={empForm.civilId} onChange={e => setEmpForm({ ...empForm, civilId: e.target.value })} className="h-11 rounded-xl border-2" /></div></div>
          <div><Label className="font-bold">تاريخ التعيين</Label><Input type="date" value={empForm.hireDate} onChange={e => setEmpForm({ ...empForm, hireDate: e.target.value })} className="h-11 rounded-xl border-2" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowAddEmp(false)}>إلغاء</Button><Button onClick={() => addEmpMut.mutate(empForm)} disabled={!empForm.fullName} className="bg-[#F5820D] hover:bg-[#C45600]">حفظ</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ACCOUNTING — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function AccountingView() {
  const [tab, setTab] = useState<'journal' | 'receipts' | 'vouchers' | 'accounts'>('accounts')
  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: async () => { const r = await fetch('/api/accounts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: journal } = useQuery({ queryKey: ['journal'], queryFn: async () => { const r = await fetch('/api/journal-entries'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: receipts } = useQuery({ queryKey: ['receipts'], queryFn: async () => { const r = await fetch('/api/cash-receipts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: vouchers } = useQuery({ queryKey: ['vouchers'], queryFn: async () => { const r = await fetch('/api/payment-vouchers'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المحاسبة</h1>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab('accounts')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'accounts' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>شجرة الحسابات ({accounts?.length || 0})</button>
        <button onClick={() => setTab('journal')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'journal' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>القيود ({journal?.length || 0})</button>
        <button onClick={() => setTab('receipts')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'receipts' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>سندات القبض ({receipts?.length || 0})</button>
        <button onClick={() => setTab('vouchers')} className={cn('px-4 py-2 rounded-xl text-sm font-bold', tab === 'vouchers' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-600')}>سندات الصرف ({vouchers?.length || 0})</button>
      </div>
      {tab === 'accounts' && <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto max-h-[60vh] overflow-y-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b sticky top-0"><tr><th className="text-right p-3 font-bold">الكود</th><th className="text-right p-3 font-bold">الاسم</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">المستوى</th><th className="text-right p-3 font-bold">القائمة</th></tr></thead><tbody className="divide-y divide-stone-100">{(accounts || []).map((a: any) => (<tr key={a.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold text-[#F5820D]">{a.code}</td><td className="p-3">{a.name}</td><td className="p-3"><Badge className={a.type === 'asset' ? 'bg-blue-50 text-blue-600' : a.type === 'liability' ? 'bg-red-50 text-red-600' : a.type === 'equity' ? 'bg-purple-50 text-purple-600' : a.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}>{a.type === 'asset' ? 'أصول' : a.type === 'liability' ? 'التزامات' : a.type === 'equity' ? 'حقوق ملكية' : a.type === 'income' ? 'إيرادات' : 'مصروفات'}</Badge></td><td className="p-3 text-stone-600">{a.level}</td><td className="p-3 text-stone-600">{a.statement === 'Balance Sheet' ? 'الميزانية' : 'قائمة الدخل'}</td></tr>))}</tbody></table></div></Card>}
      {tab === 'journal' && <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">رقم القيد</th><th className="text-right p-3 font-bold">التاريخ</th><th className="text-right p-3 font-bold">الوصف</th><th className="text-right p-3 font-bold">المدين</th><th className="text-right p-3 font-bold">الدائن</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">{(journal || []).map((j: any) => (<tr key={j.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold">{j.entryNumber}</td><td className="p-3 text-stone-600">{new Date(j.date).toLocaleDateString('ar-KW')}</td><td className="p-3">{j.description || '—'}</td><td className="p-3 font-mono">{KWD(j.totalDebit)}</td><td className="p-3 font-mono">{KWD(j.totalCredit)}</td><td className="p-3"><Badge className={j.status === 'posted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>{j.status === 'posted' ? 'مُرحّل' : 'مسودة'}</Badge></td></tr>))}</tbody></table></div></Card>}
      {tab === 'receipts' && <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">رقم السند</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">المبلغ</th><th className="text-right p-3 font-bold">التاريخ</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">{(receipts || []).map((r: any) => (<tr key={r.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold">{r.receiptNumber}</td><td className="p-3">{r.client?.nameAr || r.client?.nameEn || '—'}</td><td className="p-3 font-mono font-bold text-emerald-600">{KWD(r.amount)}</td><td className="p-3 text-stone-600">{new Date(r.date).toLocaleDateString('ar-KW')}</td><td className="p-3"><Badge className={r.status === 'posted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>{r.status === 'posted' ? 'مُرحّل' : 'مسودة'}</Badge></td></tr>))}</tbody></table></div></Card>}
      {tab === 'vouchers' && <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">رقم السند</th><th className="text-right p-3 font-bold">المستفيد</th><th className="text-right p-3 font-bold">المبلغ</th><th className="text-right p-3 font-bold">التاريخ</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">{(vouchers || []).map((v: any) => (<tr key={v.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold">{v.voucherNumber}</td><td className="p-3">{v.payeeName || '—'}</td><td className="p-3 font-mono font-bold text-red-600">{KWD(v.amount)}</td><td className="p-3 text-stone-600">{new Date(v.date).toLocaleDateString('ar-KW')}</td><td className="p-3"><Badge className={v.status === 'posted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>{v.status === 'posted' ? 'مُرحّل' : 'مسودة'}</Badge></td></tr>))}</tbody></table></div></Card>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CONTRACTS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function ContractsView() {
  const [showActivate, setShowActivate] = useState(false)
  const { data: quotations } = useQuery({ queryKey: ['quotations'], queryFn: async () => { const r = await fetch('/api/quotations'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: contracts } = useQuery({ queryKey: ['contracts'], queryFn: async () => { const r = await fetch('/api/contracts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-black text-stone-800">العقود وعروض الأسعار</h1><p className="text-sm text-stone-500">{quotations?.length || 0} عرض سعر • {contracts?.length || 0} عقد</p></div><Button onClick={() => setShowActivate(true)} className="gap-2 bg-[#F5820D] hover:bg-[#C45600]"><FileText className="h-4 w-4" /> تفعيل عقد</Button></div>
      <Card className="rounded-2xl border overflow-hidden"><CardHeader><CardTitle className="text-base">عروض الأسعار</CardTitle></CardHeader><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">رقم العرض</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">الموضوع</th><th className="text-right p-3 font-bold">المبلغ</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">{(quotations || []).map((q: any) => (<tr key={q.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold">{q.quotationNumber}</td><td className="p-3">{q.client?.nameAr || '—'}</td><td className="p-3">{q.subject || '—'}</td><td className="p-3 font-mono">{KWD(q.totalAmount)}</td><td className="p-3"><Badge className={q.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : q.status === 'sent' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}>{q.status === 'accepted' ? 'مقبول' : q.status === 'sent' ? 'مُرسل' : 'مسودة'}</Badge></td></tr>))}</tbody></table></div></Card>
      {contracts && contracts.length > 0 && <Card className="rounded-2xl border overflow-hidden"><CardHeader><CardTitle className="text-base">العقود المفعّلة</CardTitle></CardHeader><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">رقم العقد</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">المبلغ</th><th className="text-right p-3 font-bold">البنود</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">{contracts.map((c: any) => (<tr key={c.id} className="hover:bg-stone-50"><td className="p-3 font-mono font-bold">{c.contractNumber || '—'}</td><td className="p-3">{c.transaction?.client?.nameAr || '—'}</td><td className="p-3 font-mono">{KWD(c.totalAmount)}</td><td className="p-3 text-stone-600">{c.milestones?.length || 0} بند</td><td className="p-3"><Badge className={c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>{c.status === 'active' ? 'نشط' : c.status}</Badge></td></tr>))}</tbody></table></div></Card>}
      <ContractClausesForm isOpen={showActivate} onClose={() => setShowActivate(false)} transaction={null} clientId="client-1" clientName="شركة النور للإنشاءات" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function ProjectsView() {
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: async () => { const r = await fetch('/api/projects'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المشاريع</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <Card className="rounded-2xl border p-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></Card>}
        {(projects || []).map((p: any) => (
          <Card key={p.id} className="rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-stone-50 pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base font-black">{p.name}</CardTitle><Badge className={p.status === 'in-progress' ? 'bg-emerald-50 text-emerald-600' : p.status === 'planning' ? 'bg-blue-50 text-blue-600' : 'bg-stone-100 text-stone-600'}>{p.status === 'in-progress' ? 'قيد التنفيذ' : p.status === 'planning' ? 'تخطيط' : p.status}</Badge></div></CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-stone-500">العميل</span><span className="font-bold">{p.client?.nameAr || p.client?.nameEn || '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">الميزانية</span><span className="font-bold font-mono">{KWD(p.totalBudget)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">الإنجاز</span><span className="font-bold">{p.progressPercent}%</span></div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-[#F5820D] rounded-full" style={{ width: `${p.progressPercent}%` }} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// APPOINTMENTS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function AppointmentsView() {
  const { data: appts, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: async () => { const r = await fetch('/api/appointments'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المواعيد</h1>
      <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">العنوان</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">التاريخ</th><th className="text-right p-3 font-bold">النوع</th><th className="text-right p-3 font-bold">الحالة</th></tr></thead><tbody className="divide-y divide-stone-100">
        {isLoading && <tr><td colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-stone-400" /></td></tr>}
        {(appts || []).map((a: any) => (<tr key={a.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{a.title}</td><td className="p-3 text-stone-600">{a.clientName || a.client?.nameAr || '—'}</td><td className="p-3 text-stone-600">{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('ar-KW') : '—'}</td><td className="p-3"><Badge className="bg-cyan-50 text-cyan-600">{a.type === 'site-visit' ? 'زيارة موقع' : a.type === 'meeting' ? 'اجتماع' : a.type}</Badge></td><td className="p-3"><Badge className={a.status === 'scheduled' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}>{a.status === 'scheduled' ? 'مجدول' : a.status === 'confirmed' ? 'مؤكد' : a.status}</Badge></td></tr>))}
      </tbody></table></div></Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTION — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function ConstructionView() {
  const { data: projects } = useQuery({ queryKey: ['projects-construction'], queryFn: async () => { const r = await fetch('/api/projects'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المقاولات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border p-6"><Briefcase className="h-8 w-8 text-purple-600 mb-2" /><p className="text-2xl font-black">{projects?.length || 0}</p><p className="text-sm text-stone-500">مشاريع</p></Card>
        <Card className="rounded-2xl border p-6"><HardHat className="h-8 w-8 text-amber-600 mb-2" /><p className="text-2xl font-black">0</p><p className="text-sm text-stone-500">زيارات ميدانية</p></Card>
        <Card className="rounded-2xl border p-6"><FileText className="h-8 w-8 text-orange-600 mb-2" /><p className="text-2xl font-black">0</p><p className="text-sm text-stone-500">مستخلصات</p></Card>
      </div>
      <Card className="rounded-2xl border overflow-hidden"><CardHeader><CardTitle className="text-base">المشاريع النشطة</CardTitle></CardHeader><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">المشروع</th><th className="text-right p-3 font-bold">العميل</th><th className="text-right p-3 font-bold">الحالة</th><th className="text-right p-3 font-bold">الإنجاز</th></tr></thead><tbody className="divide-y divide-stone-100">{(projects || []).map((p: any) => (<tr key={p.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{p.name}</td><td className="p-3 text-stone-600">{p.client?.nameAr || '—'}</td><td className="p-3"><Badge className={p.status === 'in-progress' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}>{p.status === 'in-progress' ? 'قيد التنفيذ' : 'تخطيط'}</Badge></td><td className="p-3"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-[#F5820D] rounded-full" style={{ width: `${p.progressPercent}%` }} /></div><span className="text-xs font-bold">{p.progressPercent}%</span></div></td></tr>))}</tbody></table></div></Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PURCHASING — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function PurchasingView() {
  const { data: vendors } = useQuery({ queryKey: ['vendors'], queryFn: async () => { const r = await fetch('/api/vendors'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: pos } = useQuery({ queryKey: ['pos'], queryFn: async () => { const r = await fetch('/api/purchase-orders'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المشتريات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border overflow-hidden"><CardHeader><CardTitle className="text-base">الموردون ({vendors?.length || 0})</CardTitle></CardHeader><div className="divide-y divide-stone-100">{(vendors || []).map((v: any) => (<div key={v.id} className="p-3 flex items-center justify-between hover:bg-stone-50"><div><p className="font-bold text-sm">{v.name}</p><p className="text-xs text-stone-500">{v.contactPerson || '—'} • {v.phone || '—'}</p></div></div>))}</div></Card>
        <Card className="rounded-2xl border overflow-hidden"><CardHeader><CardTitle className="text-base">أوامر الشراء ({pos?.length || 0})</CardTitle></CardHeader><div className="divide-y divide-stone-100">{(pos || []).map((p: any) => (<div key={p.id} className="p-3 flex items-center justify-between hover:bg-stone-50"><div><p className="font-bold text-sm font-mono">{p.poNumber}</p><p className="text-xs text-stone-500">{p.vendor?.name || p.vendorName || '—'}</p></div><Badge className={p.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}>{p.status}</Badge></div>))}</div></Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// WAREHOUSE — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function WarehouseView() {
  const { data: items } = useQuery({ queryKey: ['items'], queryFn: async () => { const r = await fetch('/api/items'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-stone-800">المخازن — الأصناف</h1>
      <Card className="rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-stone-50 border-b"><tr><th className="text-right p-3 font-bold">الاسم</th><th className="text-right p-3 font-bold">SKU</th><th className="text-right p-3 font-bold">الوحدة</th><th className="text-right p-3 font-bold">سعر البيع</th><th className="text-right p-3 font-bold">التكلفة</th></tr></thead><tbody className="divide-y divide-stone-100">{(items || []).map((i: any) => (<tr key={i.id} className="hover:bg-stone-50"><td className="p-3 font-bold">{i.name}</td><td className="p-3 font-mono text-stone-600">{i.sku || '—'}</td><td className="p-3 text-stone-600">{i.unit || '—'}</td><td className="p-3 font-mono">{KWD(i.unitPrice)}</td><td className="p-3 font-mono text-stone-500">{KWD(i.costPrice)}</td></tr>))}</tbody></table></div></Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// REPORTS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function ReportsView() {
  const { data: k } = useQuery({ queryKey: ['dashboard'], queryFn: async () => { const r = await fetch('/api/dashboard'); if (!r.ok) return null; const j = await r.json(); return j.data?.kpis || null } })
  const d = k || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-stone-800">التقارير</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">ملخص الموارد البشرية</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">إجمالي الموظفين</span><span className="font-bold">{d.totalEmployees}</span></div><div className="flex justify-between"><span className="text-stone-500">طلبات إجازة معلقة</span><span className="font-bold">{d.pendingLeaveRequests}</span></div><div className="flex justify-between"><span className="text-stone-500">مهام معلقة</span><span className="font-bold">{d.pendingTasks}</span></div></div></Card>
        <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">ملخص مالي</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">إجمالي العملاء</span><span className="font-bold">{d.totalClients}</span></div><div className="flex justify-between"><span className="text-stone-500">المشاريع النشطة</span><span className="font-bold">{d.activeProjects}</span></div><div className="flex justify-between"><span className="text-stone-500">إجمالي الإيرادات</span><span className="font-bold">{KWD(d.totalRevenue)}</span></div></div></Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS — مبنية من الصفر
// ═══════════════════════════════════════════════════════════════
function SettingsView() {
  const { data: governorates } = useQuery({ queryKey: ['settings-gov'], queryFn: async () => { const r = await fetch('/api/governorates'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: departments } = useQuery({ queryKey: ['settings-dept'], queryFn: async () => { const r = await fetch('/api/departments?withJobs=true'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  const { data: accounts } = useQuery({ queryKey: ['settings-acc'], queryFn: async () => { const r = await fetch('/api/accounts'); if (!r.ok) return []; const j = await r.json(); return j.data || [] } })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-stone-800">الإعدادات</h1>
      <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">القوائم المرجعية الكويتية</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><p className="text-xs font-bold text-stone-500 mb-2">المحافظات ({governorates?.length || 0})</p><div className="flex flex-wrap gap-1">{(governorates || []).map((g: any) => <Badge key={g.id} className="bg-blue-50 text-blue-600">{g.name}</Badge>)}</div></div>
        <div><p className="text-xs font-bold text-stone-500 mb-2">الأقسام ({departments?.length || 0})</p><div className="flex flex-wrap gap-1">{(departments || []).map((d: any) => <Badge key={d.id} className="bg-emerald-50 text-emerald-600">{d.name}</Badge>)}</div></div>
        <div><p className="text-xs font-bold text-stone-500 mb-2">الحسابات ({accounts?.length || 0})</p><div className="flex flex-wrap gap-1">{(accounts || []).slice(0, 10).map((a: any) => <Badge key={a.id} className="bg-orange-50 text-[#F5820D]">{a.code}</Badge>)}{accounts?.length > 10 && <Badge className="bg-stone-100 text-stone-500">+{accounts.length - 10}</Badge>}</div></div>
      </div></Card>
      <Card className="rounded-2xl border p-6"><h3 className="font-black text-stone-800 mb-3">معلومات النظام</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-stone-500">الإصدار</span><span className="font-bold">Nova ERP v1.0 (Prisma)</span></div><div className="flex justify-between"><span className="text-stone-500">قاعدة البيانات</span><span className="font-bold">SQLite + Prisma ORM</span></div><div className="flex justify-between"><span className="text-stone-500">المصادقة</span><span className="font-bold">NextAuth (JWT)</span></div><div className="flex justify-between"><span className="text-stone-500">الذكاء الاصطناعي</span><span className="font-bold">z-ai-web-dev-sdk</span></div></div></Card>
    </div>
  )
}
