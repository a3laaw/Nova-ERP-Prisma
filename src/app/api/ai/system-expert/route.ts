import { NextRequest, NextResponse } from 'next/server';
import { askSystemExpert } from '@/ai/flows/ask-system-expert';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await askSystemExpert({ question: body.question, history: body.history });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI system-expert error:', error);
    return NextResponse.json({ answer: 'عذراً، حدث خطأ في معالجة سؤالك.' }, { status: 500 });
  }
}
