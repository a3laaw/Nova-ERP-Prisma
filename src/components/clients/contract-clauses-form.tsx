'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileSignature, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InlineSearchList } from '@/components/ui/inline-search-list';

const DEFAULT_STAGES = [
  { value: 'عند توقيع العقد', label: 'عند توقيع العقد' },
  { value: 'عند تسليم المخططات', label: 'عند تسليم المخططات' },
  { value: 'عند البدء بالتنفيذ', label: 'عند البدء بالتنفيذ' },
  { value: 'عند انتهاء الهيكل الإنشائي', label: 'عند انتهاء الهيكل الإنشائي' },
  { value: 'عند التشطيبات', label: 'عند التشطيبات' },
  { value: 'عند التسليم النهائي', label: 'عند التسليم النهائي' },
];

export function ContractClausesForm({ isOpen, onClose, transaction, clientId, clientName, quotationIdToUpdate }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [specs, setSpecs] = useState<any>({ totalArea: 0, floorsCount: 1 });
  const [financials, setFinancials] = useState<any>({ type: 'fixed', totalAmount: 0, milestones: [] });

  useEffect(() => {
    if (isOpen && transaction) {
      const q = transaction;
      const type = q.financialsType || 'fixed';
      const rawItems = q.items || q.milestones || [];
      setFinancials({ type, totalAmount: Number(q.totalAmount || 0), milestones: rawItems.map((item: any, idx: number) => ({ id: Math.random().toString(36).substring(2, 9), name: item.description || `الدفعة ${idx + 1}`, condition: item.triggerCondition || (idx === 0 ? 'عند توقيع العقد' : ''), value: type === 'percentage' ? Number(item.percentage || 0) : Number(item.unitPrice || item.amount || 0) })) });
    }
  }, [isOpen, transaction]);

  const handleSubmit = async () => {
    if (!clientId || isSaving) return;
    setIsSaving(true);
    try {
      const finalClauses = financials.milestones.map((m: any) => ({ ...m, amount: financials.type === 'percentage' ? (m.value / 100) * financials.totalAmount : m.value, clauseStatus: 'غير مستحقة' }));
      const res = await fetch('/api/contracts/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactionId: transaction?.id, clientId, clientName, clauses: finalClauses, totalAmount: financials.totalAmount, financialsType: financials.type, specs, quotationIdToUpdate }) });
      if (!res.ok) throw new Error('فشل تفعيل العقد');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({ title: '✅ تم تفعيل العقد' });
      onClose(); router.push(`/dashboard/clients/${clientId}`);
    } catch (e: any) { toast({ variant: 'destructive', title: 'خطأ', description: e.message }); }
    finally { setIsSaving(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white" dir="rtl">
        <DialogHeader className="p-8 bg-primary/5 border-b"><div className="flex items-center gap-4"><div className="p-3 bg-primary rounded-2xl text-white shadow-xl"><FileSignature className="h-6 w-6" /></div><DialogTitle className="text-2xl font-black">تفعيل العقد المالي</DialogTitle></div></DialogHeader>
        <ScrollArea className="flex-1 p-8 max-h-[60vh]">
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 rounded-3xl border-2 border-dashed">
              <div className="grid gap-1"><Label className="text-[10px] font-black text-slate-400">المساحة</Label><Input type="number" value={specs.totalArea} onChange={e => setSpecs({ ...specs, totalArea: e.target.value })} className="h-10 rounded-xl" /></div>
              <div className="grid gap-1"><Label className="text-[10px] font-black text-slate-400">الأدوار</Label><Input type="number" value={specs.floorsCount} onChange={e => setSpecs({ ...specs, floorsCount: e.target.value })} className="h-10 rounded-xl" /></div>
              <div className="grid gap-1"><Label className="text-[10px] font-black text-slate-400">نظام الدفع</Label><Badge className="bg-primary h-10 rounded-xl justify-center font-black">{financials.type === 'fixed' ? 'مبالغ ثابتة' : 'نسب مئوية'}</Badge></div>
              <div className="grid gap-1"><Label className="text-[10px] font-black text-slate-400">إجمالي العقد</Label><div className="h-10 rounded-xl bg-white border-2 flex items-center justify-center font-black text-primary font-mono">{formatCurrency(financials.totalAmount)}</div></div>
            </div>
            <div className="border-2 rounded-[2rem] overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-900 h-12"><TableRow><TableHead className="w-16 text-center text-white font-black">#</TableHead><TableHead className="px-6 font-black text-white text-right">شرط الاستحقاق</TableHead><TableHead className="text-center w-48 font-black text-white">المبلغ / النسبة</TableHead></TableRow></TableHeader>
                <TableBody>
                  {financials.milestones.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">لا توجد بنود. أضف من عرض السعر.</TableCell></TableRow>}
                  {financials.milestones.map((m: any, i: number) => (
                    <TableRow key={m.id} className="h-16"><TableCell className="text-center font-black text-slate-400">{i + 1}</TableCell>
                      <TableCell className="px-6"><InlineSearchList value={m.condition} onSelect={v => { const n = [...financials.milestones]; n[i].condition = v; setFinancials({ ...financials, milestones: n }); }} options={DEFAULT_STAGES} placeholder="اربط بمرحلة..." allowCustomValue className="h-10" /></TableCell>
                      <TableCell className="text-center font-black font-mono text-primary text-xl bg-primary/5">{financials.type === 'percentage' ? `${m.value}%` : formatCurrency(m.value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-8 bg-muted/10 border-t flex gap-3"><Button variant="ghost" onClick={onClose} disabled={isSaving} className="rounded-xl font-bold h-12 px-8">تراجع</Button><Button onClick={handleSubmit} disabled={isSaving || financials.milestones.length === 0} className="rounded-xl font-black h-12 px-12 gap-2">{isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />} تفعيل العقد</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ContractClausesForm;
