'use client';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InlineSearchList } from '@/components/ui/inline-search-list';
import { calculateGratuity } from '@/services/leave-calculator';
import { formatCurrency } from '@/lib/utils';
import { Calculator, Info, AlertTriangle, Scale, Landmark, Clock, FileCheck, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DateInput } from '@/components/ui/date-input';
import { Badge } from '@/components/ui/badge';

const terminationReasons = [
  { value: 'termination', label: 'إنهاء خدمات (مادة 51)' },
  { value: 'resignation', label: 'استقالة (مادة 53)' },
  { value: 'misconduct', label: 'إنهاء تأديبي (مادة 41)' },
  { value: 'probation_termination', label: 'إنهاء خلال التجربة' },
  { value: 'death_or_disability', label: 'وفاة أو عجز (مادة 52)' },
];

export function GratuityCalculatorView() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [terminationReason, setTerminationReason] = useState('termination');
  const [noticeType, setNoticeType] = useState<'worked' | 'indemnity' | 'waived'>('waived');
  const [noticeStartDate, setNoticeStartDate] = useState<Date | undefined>(new Date());
  const [result, setResult] = useState<any>(null);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees-gratuity'],
    queryFn: async () => { const r = await fetch('/api/employees?limit=200'); if (!r.ok) return []; const j = await r.json(); return Array.isArray(j) ? j : (j.data || []); },
  });

  const employeeOptions = useMemo(() => (employees as any[]).map(e => ({ value: e.id, label: e.status === 'terminated' ? `${e.fullName} (منتهية)` : e.fullName, searchKey: e.employeeNumber })), [employees]);

  const handleCalculate = () => {
    const emp = (employees as any[]).find(e => e.id === selectedEmployeeId);
    if (emp && noticeStartDate) setResult(calculateGratuity({ ...emp, terminationReason }, noticeStartDate, noticeType));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 pb-8 border-b">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calculator className="h-8 w-8" /></div>
            <div><CardTitle className="text-2xl font-black">حاسبة مستحقات الموظف النهائية</CardTitle>
            <CardDescription>حساب المكافأة وبدل الإجازات وفقاً لقانون العمل الكويتي.</CardDescription></div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid gap-3"><Label className="font-black text-gray-700">الموظف *</Label>
              <InlineSearchList value={selectedEmployeeId} onSelect={setSelectedEmployeeId} options={employeeOptions} placeholder={isLoading ? 'جاري التحميل...' : 'ابحث بالاسم...'} disabled={isLoading} className="h-12 rounded-2xl border-2" /></div>
            <div className="grid gap-3"><Label className="font-black text-gray-700">تاريخ بداية الإنذار</Label><DateInput value={noticeStartDate} onChange={setNoticeStartDate} className="h-12" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid gap-3"><Label className="font-black text-gray-700">معالجة فترة الإنذار</Label>
              <Select value={noticeType} onValueChange={(v) => setNoticeType(v as any)}><SelectTrigger className="h-12 rounded-2xl border-2"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="worked">دوام فترة الإنذار</SelectItem><SelectItem value="indemnity">صرف بدل إنذار (3 أشهر)</SelectItem><SelectItem value="waived">إعفاء من الإنذار</SelectItem></SelectContent></Select></div>
            <div className="grid gap-3"><Label className="font-black text-gray-700">سبب نهاية الخدمة</Label>
              <Select value={terminationReason} onValueChange={setTerminationReason}><SelectTrigger className="h-12 rounded-2xl border-2"><SelectValue /></SelectTrigger><SelectContent dir="rtl">{terminationReasons.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="flex justify-center pt-4"><Button onClick={handleCalculate} disabled={!selectedEmployeeId} className="w-full md:w-1/2 h-14 rounded-2xl font-black text-xl gap-3"><Scale className="h-6 w-6" /> حساب المستحقات</Button></div>
          {result && (
            <div className="pt-8 border-t space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-muted/30 rounded-3xl border-2 border-dashed text-center"><Label className="text-[10px] font-black uppercase mb-2 flex items-center gap-1 justify-center"><Clock className="h-3 w-3"/> مدة الخدمة</Label><p className="text-3xl font-black text-primary font-mono">{result.yearsOfService.toFixed(2)} <span className="text-sm">سنة</span></p></div>
                <div className="p-6 bg-muted/30 rounded-3xl border-2 border-dashed text-center"><Label className="text-[10px] font-black uppercase mb-2">الراتب الشامل</Label><p className="text-2xl font-black font-mono">{formatCurrency(result.lastSalary)}</p></div>
                <div className="p-6 bg-muted/30 rounded-3xl border-2 border-dashed text-center"><Label className="text-[10px] font-black uppercase mb-2">أجر اليوم</Label><p className="text-2xl font-black font-mono">{formatCurrency(result.dailyWage)}</p></div>
              </div>
              <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl border"><span className="font-bold text-gray-600">مكافأة نهاية الخدمة:</span><span className="text-2xl font-black text-primary font-mono">{formatCurrency(result.gratuity)}</span></div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl border"><span className="font-bold text-gray-600">بدل رصيد الإجازات ({result.leaveBalance.toFixed(1)} يوم):</span><span className="text-2xl font-black text-primary font-mono">{formatCurrency(result.leaveBalancePay)}</span></div>
                  {result.noticeIndemnity > 0 && <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-100"><span className="font-bold text-blue-800 flex items-center gap-2"><FileCheck className="h-4 w-4"/> بدل الإنذار (3 أشهر):</span><span className="text-2xl font-black text-blue-700 font-mono">{formatCurrency(result.noticeIndemnity)}</span></div>}
                  <Separator className="bg-primary/10 my-4" />
                  <div className="flex justify-between items-center p-6 bg-primary rounded-2xl text-white shadow-xl"><span className="text-xl font-black">إجمالي صافي الشيك:</span><span className="text-4xl font-black font-mono">{formatCurrency(result.total)}</span></div>
                </div>
                <Alert className="mt-6 bg-white border-2 border-primary/20 rounded-2xl"><Info className="h-5 w-5 text-primary" /><AlertTitle className="font-black text-primary">الحالة القانونية</AlertTitle><AlertDescription className="text-sm font-bold text-slate-700 mt-1">{result.notice}</AlertDescription></Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default GratuityCalculatorView;
