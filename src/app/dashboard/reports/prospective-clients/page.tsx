
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoShowClientsReport } from '@/components/reports/no-show-clients-report';
import { FollowUpClientsReport } from '@/components/reports/follow-up-clients-report';
import { useAnalyticalData } from '@/hooks/use-analytical-data';

export default function ProspectiveClientsReportPage() {
    const { appointments, employees, clients, transactions, loading } = useAnalyticalData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>متابعة العملاء المحتملين</CardTitle>
                <CardDescription>تحليل العملاء الذين لم يتعاقدوا بعد، سواء لم يحضروا أو توقفوا بعد الاستفسارات.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="follow-up" dir="rtl">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="follow-up">بحاجة لمتابعة</TabsTrigger>
                        <TabsTrigger value="no-shows">لم يحضروا</TabsTrigger>
                    </TabsList>
                    <TabsContent value="follow-up" className="mt-4">
                        <FollowUpClientsReport clients={clients} transactions={transactions} loading={loading} />
                    </TabsContent>
                    <TabsContent value="no-shows" className="mt-4">
                        <NoShowClientsReport appointments={appointments} employees={employees} loading={loading} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

  