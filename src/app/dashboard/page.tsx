'use client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Briefcase, DollarSign, UserCircle, CalendarDays, FileText, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const KWD = (n: number) => formatCurrency(n)

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const r = await fetch('/api/dashboard')
      if (!r.ok) return null
      const j = await r.json()
      return j.data?.kpis || null
    },
  })

  const d = kpis || { totalEmployees: 0, totalClients: 0, activeProjects: 0, totalRevenue: 0, pendingLeaveRequests: 0, pendingTasks: 0 }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" /></div>
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-stone-800">لوحة التحكم</h1>
        <p className="text-sm text-stone-500">نظرة عامة على النظام</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="العملاء" value={d.totalClients} color="bg-blue-50 text-blue-600" />
        <KpiCard icon={Briefcase} label="المشاريع" value={d.activeProjects} color="bg-purple-50 text-purple-600" />
        <KpiCard icon={DollarSign} label="الإيرادات" value={KWD(d.totalRevenue)} color="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={UserCircle} label="الموظفون" value={d.totalEmployees} color="bg-sky-50 text-sky-600" />
        <KpiCard icon={CalendarDays} label="إجازات معلقة" value={d.pendingLeaveRequests} color="bg-orange-50 text-orange-600" />
        <KpiCard icon={FileText} label="مهام معلقة" value={d.pendingTasks} color="bg-rose-50 text-rose-600" />
      </div>

      <Card className="rounded-2xl border border-stone-200">
        <CardHeader><CardTitle className="text-lg">مرحباً بك في Nova ERP</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-stone-600 leading-relaxed">
            نظام إدارة موارد المؤسسات المصمم خصيصاً لمكاتب الهندسة وشركات المقاولات في الكويت.
            يدعم القانون الكويتي (المواد 41، 51، 53)، المحافظات الكويتية، الدينار الكويتي، والعربية بـ RTL كامل.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-orange-50 text-[#F5820D]">قانون العمل الكويتي</Badge>
            <Badge className="bg-emerald-50 text-emerald-600">66 حساب محاسبي</Badge>
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
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-stone-500 font-medium">{label}</p>
          <p className="text-lg font-black text-stone-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
