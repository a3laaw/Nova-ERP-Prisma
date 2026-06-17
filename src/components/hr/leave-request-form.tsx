'use client';
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from '@/components/ui/date-input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, CalendarCheck, Calculator, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateWorkingDays, calculateSickLeaveTiers } from '@/services/leave-calculator';
import { InlineSearchList } from '@/components/ui/inline-search-list';
import { toDateSafe } from '@/services/date-converter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { startOfDay, endOfDay } from 'date-fns';
import { Separator } from '@/components/ui/separator';

const DEFAULT_WEEKLY_HOLIDAYS = ['Friday', 'Saturday'];

export function LeaveRequestForm({ isOpen, onClose, onSaveSuccess, leaveRequestToEdit }: any) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState<'Annual' | 'Sick' | 'Emergency' | 'Unpaid'>('Annual');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState('');
  const [overlapError, setOverlapError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [usedSickDays, setUsedSickDays] = useState(0);

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-leave'], queryFn: async () => { const r = await fetch('/api/employees?status=active&limit=200'); if (!r.ok) return []; const j = await r.json(); return Array.isArray(j) ? j : (j.data || []); }, enabled: isOpen, staleTime: 60_000,
  });

  useEffect(() => {
    if (isOpen) { setIsSaving(false); setOverlapError(null); if (leaveRequestToEdit) { setSelectedEmployeeId(leaveRequestToEdit.employeeId || ''); setLeaveType(leaveRequestToEdit.leaveType || 'Annual'); setStartDate(toDateSafe(leaveRequestToEdit.startDate) || undefined); setEndDate(toDateSafe(leaveRequestToEdit.endDate) || undefined); setNotes(leaveRequestToEdit.notes || ''); } else { setSelectedEmployeeId(''); setLeaveType('Annual'); setStartDate(undefined); setEndDate(undefined); setNotes(''); } }
  }, [isOpen, leaveRequestToEdit]);

  const leaveDuration = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return { totalDays: 0, workingDays: 0 };
    return calculateWorkingDays(startDate, endDate, DEFAULT_WEEKLY_HOLIDAYS, []);
  }, [startDate, endDate]);

  const sickTiers = useMemo(() => leaveType === 'Sick' && leaveDuration.workingDays > 0 ? calculateSickLeaveTiers(usedSickDays, leaveDuration.workingDays) : [], [leaveType, leaveDuration.workingDays, usedSickDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !startDate || !endDate) return;
    setIsSaving(true);
    try {
      const emp = (employees as any[]).find(e => e.id === selectedEmployeeId);
      const payload = { employeeId: selectedEmployeeId, employeeName: emp?.fullName || '', leaveType, startDate: startDate.toISOString(), endDate: endDate.toISOString(), totalDays: leaveDuration.totalDays, notes, status: 'pending' };
      const res = await fetch('/api/leave-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('فشل حفظ الطلب');
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      onSaveSuccess?.(); onClose();
      toast({ title: 'تم تقديم الطلب', description: 'تم حفظ طلب الإجازة بنجاح.' });
    } catch (error: any) { toast({ variant: 'destructive', title: 'خطأ', description: error.message }); }
    finally { setIsSaving(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-lg rounded-[2.5rem] shadow-2xl p-0 overflow-hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-8 bg-primary/5 border-b"><div className="flex items-center gap-4"><div className="p-3 bg-primary/10 rounded-2xl text-primary"><CalendarCheck className="h-6 w-6" /></div><DialogTitle className="text-xl font-black">تقديم طلب إجازة</DialogTitle></div></DialogHeader>
          <div className="p-8 space-y-6">
            {overlapError && <Alert variant="destructive" className="rounded-2xl"><AlertCircle className="h-5 w-5" /><AlertDescription>{overlapError}</AlertDescription></Alert>}
            <div className="grid gap-2"><Label className="font-black">الموظف *</Label><InlineSearchList value={selectedEmployeeId} onSelect={setSelectedEmployeeId} options={(employees as any[]).map(e => ({ value: e.id, label: e.fullName, searchKey: e.employeeNumber }))} placeholder={employeesLoading ? 'تحميل...' : 'اختر موظفاً...'} disabled={isSaving || employeesLoading} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label className="font-bold">نوع الإجازة *</Label><Select value={leaveType} onValueChange={(v: any) => setLeaveType(v)} disabled={isSaving}><SelectTrigger className="h-11 rounded-xl border-2 font-bold"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="Annual">سنوية</SelectItem><SelectItem value="Sick">مرضية</SelectItem><SelectItem value="Emergency">طارئة</SelectItem><SelectItem value="Unpaid">بدون أجر</SelectItem></SelectContent></Select></div>
              <div className="grid gap-2 text-center"><Label className="font-bold text-xs opacity-50">أيام العمل</Label><div className="h-11 rounded-xl bg-muted/30 border-2 flex items-center justify-center font-black text-primary">{leaveDuration.workingDays} أيام</div></div>
            </div>
            {leaveType === 'Sick' && sickTiers.length > 0 && (
              <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-[2rem] space-y-3">
                <div className="flex justify-between items-center text-xs font-black text-blue-800"><span className="flex items-center gap-2"><Calculator className="h-4 w-4" /> تحليل الشرائح:</span><span>المستخدم: {usedSickDays} يوم</span></div>
                <Separator className="bg-blue-200/50" />
                {sickTiers.map((t, i) => <div key={i} className="flex justify-between text-[11px] font-bold text-blue-900 bg-white/60 p-2 rounded-lg border border-blue-100"><span>{t.label}:</span><span>{t.days} يوم</span></div>)}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label className="font-bold">من *</Label><DateInput value={startDate} onChange={setStartDate} disabled={isSaving} /></div><div className="grid gap-2"><Label className="font-bold">إلى *</Label><DateInput value={endDate} onChange={setEndDate} disabled={isSaving} /></div></div>
            <div className="grid gap-2"><Label className="font-bold">ملاحظات</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="rounded-2xl border-2 p-4" placeholder="اختياري..." disabled={isSaving} /></div>
          </div>
          <DialogFooter className="p-8 bg-muted/10 border-t flex gap-3"><Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="rounded-xl font-bold h-12 px-8">إلغاء</Button><Button type="submit" disabled={isSaving || !!overlapError} className="rounded-xl font-black px-12 h-12 gap-2">{isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="ml-2 h-4 w-4" />} تقديم الطلب</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default LeaveRequestForm;
